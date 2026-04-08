import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch price from database
async function fetchCoursePrice(priceSearchTag, plan) {
  try {
    const { data, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('course_name', priceSearchTag)
      .single();

    if (error || !data) {
      throw new Error(`Price not found for course: ${priceSearchTag}`);
    }

    let price = 0;
    switch (plan.toLowerCase()) {
      case 'self':
      case 'self-paced':
        price = data.self_current_price;
        break;
      case 'mentor':
      case 'mentor-led':
        price = data.mentor_current_price;
        break;
      case 'professional':
        price = data.professional_current_price;
        break;
      default:
        price = data.mentor_current_price;
    }

    if (!price || price <= 0) {
      throw new Error(`Invalid price for ${priceSearchTag} - ${plan}: ${price}`);
    }

    return price;
  } catch (error) {
    throw error;
  }
}

const isValidCouponDate = (validFrom, validUntil) => {
  try {
    const now = new Date();
    const startDate = validFrom ? new Date(validFrom) : null;
    const endDate = validUntil ? new Date(validUntil) : null;

    if (!startDate && !endDate) return true;
    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;

    return true;
  } catch (error) {
    console.error('Error validating coupon dates:', error);
    return false;
  }
};

const isCouponApplicableToCourse = (applicableCourses, courseId) => {
  if (!applicableCourses || applicableCourses.length === 0) {
    return true;
  }
  
  if (applicableCourses.some(course => {
    const courseStr = typeof course === 'string' ? course.toLowerCase().trim() : '';
    return courseStr === 'all' || courseStr === '*' || courseStr === 'pro-packs' || courseStr === 'tech-starter-pack';
  })) {
    return true;
  }

  const coursesList = applicableCourses.map(item => 
    typeof item === 'string' ? item.toLowerCase().trim() : ''
  );
  
  const courseIdLower = courseId ? courseId.toLowerCase().trim() : '';

  return coursesList.includes(courseIdLower);
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { couponCode, selectedCourses, cartType, courseId } = body;

    // console.log('🎫 [COUPON VALIDATION] Request:', {
    //   couponCode,
    //   cartType,
    //   coursesCount: selectedCourses?.length,
    //   courseId
    // });

    // ✅ Validate required fields
    if (!couponCode) {
      return new Response(
        JSON.stringify({
          message: 'Coupon code is required',
          success: false
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!selectedCourses || selectedCourses.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No courses selected',
          success: false
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ✅ STEP 1: Fetch real prices from database
    // console.log('📊 [COUPON VALIDATION] Fetching real prices from database...');
    
    let originalTotal = 0;

    for (const course of selectedCourses) {
      const priceSearchTag = course.priceSearchTag || course.price_search_tag;
      
      if (!priceSearchTag) {
        return new Response(
          JSON.stringify({
            message: `Missing price information for ${course.courseName}`,
            success: false
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      try {
        const realPrice = await fetchCoursePrice(priceSearchTag, course.plan);
        originalTotal += realPrice;
      } catch (error) {
        console.error(`❌ Failed to fetch price for ${course.courseName}:`, error);
        return new Response(
          JSON.stringify({
            message: `Failed to fetch price for ${course.courseName}`,
            success: false
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    // console.log(`✅ [COUPON VALIDATION] Original total from database: ₹${originalTotal}`);

    // ✅ STEP 2: Apply package discount (if applicable)
    let packageDiscount = 0;
    let priceAfterPackageDiscount = originalTotal;

    if (cartType === 'tech-starter-pack' && selectedCourses.length === 4) {
      const TECH_PACK_PRICE = 25000;
      if (originalTotal > TECH_PACK_PRICE) {
        packageDiscount = originalTotal - TECH_PACK_PRICE;
        priceAfterPackageDiscount = TECH_PACK_PRICE;
        console.log(`✅ [COUPON VALIDATION] Tech Starter Pack discount: -₹${packageDiscount}`);
      }
    }

    // ✅ STEP 3: Fetch and validate coupon
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(
          JSON.stringify({
            message: 'Invalid or inactive coupon code',
            success: false
          }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      console.error('❌ [COUPON VALIDATION] Supabase error:', error);
      return new Response(
        JSON.stringify({
          message: 'Failed to fetch coupon from database',
          success: false
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const matchingCoupon = data;

    if (!matchingCoupon || !matchingCoupon.is_active) {
      return new Response(
        JSON.stringify({
          message: 'Invalid or inactive coupon code',
          success: false
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ✅ Validate coupon dates
    if (!isValidCouponDate(matchingCoupon.valid_from, matchingCoupon.valid_until)) {
      let dateMessage = 'Coupon is not valid';
      if (matchingCoupon.valid_until && new Date() > new Date(matchingCoupon.valid_until)) {
        dateMessage = `Coupon expired on ${new Date(matchingCoupon.valid_until).toLocaleDateString()}`;
      } else if (matchingCoupon.valid_from && new Date() < new Date(matchingCoupon.valid_from)) {
        dateMessage = `Coupon will be valid from ${new Date(matchingCoupon.valid_from).toLocaleDateString()}`;
      }

      return new Response(
        JSON.stringify({
          message: dateMessage,
          success: false
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ✅ Check usage limits
    if (matchingCoupon.max_uses && matchingCoupon.times_used >= matchingCoupon.max_uses) {
      return new Response(
        JSON.stringify({
          message: 'This coupon has reached its usage limit',
          success: false
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ✅ Check minimum order amount (apply to price after package discount)
    if (matchingCoupon.min_order_amount && priceAfterPackageDiscount < matchingCoupon.min_order_amount) {
      return new Response(
        JSON.stringify({
          message: `Minimum order amount of ₹${matchingCoupon.min_order_amount} required for this coupon`,
          success: false
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ✅ Check maximum order amount
    if (matchingCoupon.max_order_amount && priceAfterPackageDiscount > matchingCoupon.max_order_amount) {
      return new Response(
        JSON.stringify({
          message: `This coupon is only valid for orders up to ₹${matchingCoupon.max_order_amount}`,
          success: false
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ✅ Check course applicability
    const courseIdForCheck = cartType === 'tech-starter-pack' 
      ? 'tech-starter-pack' 
      : courseId || 'pro-packs';

    if (!isCouponApplicableToCourse(matchingCoupon.applicable_courses, courseIdForCheck)) {
      return new Response(
        JSON.stringify({
          message: 'This coupon is not applicable for the selected course(s)',
          success: false
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ✅ STEP 4: Calculate discount
    let discountAmount = 0;
    let finalPrice = priceAfterPackageDiscount;
    const discountType = matchingCoupon.discount_type;
    let discountPercentage = 0;

    if (discountType === 'percentage') {
      const percentageValue = matchingCoupon.percentage_discount || 0;
      discountAmount = Math.round((priceAfterPackageDiscount * percentageValue) / 100);
      finalPrice = priceAfterPackageDiscount - discountAmount;
      discountPercentage = percentageValue;
      
    } else if (discountType === 'fixed') {
      discountAmount = Math.min(matchingCoupon.fixed_amount_discount || 0, priceAfterPackageDiscount);
      finalPrice = priceAfterPackageDiscount - discountAmount;
      discountPercentage = Math.round((discountAmount / priceAfterPackageDiscount) * 100);
      
    } else if (discountType === 'fixed_price') {
      const targetPrice = matchingCoupon.fixed_amount_discount || 0;
      
      if (priceAfterPackageDiscount <= targetPrice) {
        return new Response(
          JSON.stringify({
            message: `This coupon sets the price to ₹${targetPrice.toLocaleString('en-IN')}, but the current price is already ₹${priceAfterPackageDiscount.toLocaleString('en-IN')}`,
            success: false
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      finalPrice = targetPrice;
      discountAmount = priceAfterPackageDiscount - targetPrice;
      discountPercentage = Math.round((discountAmount / priceAfterPackageDiscount) * 100);
      
    } else if (discountType === 'minimum_price') {
      const targetPrice = matchingCoupon.fixed_amount_discount || 0;
      
      if (priceAfterPackageDiscount <= targetPrice) {
        return new Response(
          JSON.stringify({
            message: `This coupon sets the price to ₹${targetPrice.toLocaleString('en-IN')}, but the current price is already ₹${priceAfterPackageDiscount.toLocaleString('en-IN')}`,
            success: false
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      finalPrice = targetPrice;
      discountAmount = priceAfterPackageDiscount - targetPrice;
      discountPercentage = Math.round((discountAmount / priceAfterPackageDiscount) * 100);
    }

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, priceAfterPackageDiscount);
    finalPrice = Math.max(finalPrice, 0);

    const actualDiscountPercentage = priceAfterPackageDiscount > 0 
      ? Math.round((discountAmount / priceAfterPackageDiscount) * 100) 
      : 0;

    // console.log('✅ [COUPON VALIDATION] Success:', {
    //   code: matchingCoupon.code,
    //   originalTotal,
    //   packageDiscount,
    //   priceAfterPackageDiscount,
    //   couponDiscount: discountAmount,
    //   finalPrice,
    //   discountPercentage: actualDiscountPercentage
    // });

    // ✅ Return success with all pricing details
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Coupon applied successfully',
        originalTotal: originalTotal,
        packageDiscount: packageDiscount,
        priceAfterPackageDiscount: priceAfterPackageDiscount,
        couponDiscount: Math.round(discountAmount),
        finalPrice: Math.round(finalPrice),
        discountPercentage: actualDiscountPercentage,
        discountType: discountType,
        discount_value: discountType === 'percentage' ? matchingCoupon.percentage_discount : matchingCoupon.fixed_amount_discount,
        coupon: {
          code: matchingCoupon.code,
          description: matchingCoupon.description || '',
          validUntil: matchingCoupon.valid_until,
        }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error('❌ [COUPON VALIDATION] Error:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to validate coupon due to a server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        success: false
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}