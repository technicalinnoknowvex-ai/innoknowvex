

import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Fetch price from database using priceSearchTag
async function fetchCoursePrice(priceSearchTag, plan) {
  try {
    // console.log(`📡 [PRO-PACKS ORDER] Fetching price for: ${priceSearchTag} - ${plan}`);

    const { data, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('course_name', priceSearchTag)
      .single();

    if (error || !data) {
      console.error(`❌ [PRO-PACKS ORDER] Price not found for ${priceSearchTag}:`, error);
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

    // console.log(`✅ [PRO-PACKS ORDER] Price fetched: ₹${price}`);
    return price;
  } catch (error) {
    console.error(`❌ [PRO-PACKS ORDER] Error fetching price:`, error);
    throw error;
  }
}

// Validate coupon and calculate discount
async function validateAndCalculateCoupon(couponCode, basePrice, courseId) {
  try {
    // console.log(`🎫 [PRO-PACKS ORDER] Validating coupon: ${couponCode} for ₹${basePrice}`);

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase().trim())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return { success: false, message: 'Invalid coupon code', discount: 0 };
    }

    const now = new Date();

    // Check validity dates
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      const validFromDate = new Date(coupon.valid_from).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return { success: false, message: `Coupon valid from ${validFromDate}`, discount: 0 };
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      const expiredDate = new Date(coupon.valid_until).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return { success: false, message: `Coupon expired on ${expiredDate}`, discount: 0 };
    }

    // Check usage limits
    if (coupon.max_uses && coupon.times_used >= coupon.max_uses) {
      return { success: false, message: 'Coupon usage limit reached', discount: 0 };
    }

    // Check applicable courses
    if (coupon.applicable_courses && coupon.applicable_courses.length > 0) {
      const isApplicable = coupon.applicable_courses.some(
        course => course.toLowerCase() === (courseId || '').toLowerCase()
      );
      if (!isApplicable) {
        return { success: false, message: 'Coupon not valid for this course', discount: 0 };
      }
    }

    // Check minimum order amount
    if (coupon.min_order_amount && basePrice < coupon.min_order_amount) {
      return {
        success: false,
        message: `Minimum order amount of ₹${coupon.min_order_amount} required`,
        discount: 0
      };
    }

    // Calculate discount
    let discountAmount = 0;

    switch (coupon.discount_type) {
      case 'percentage':
        discountAmount = (basePrice * coupon.percentage_discount) / 100;
        break;
      case 'fixed':
        discountAmount = Math.min(coupon.fixed_amount_discount, basePrice);
        break;
      case 'fixed_price':
        if (coupon.fixed_amount_discount < basePrice) {
          discountAmount = basePrice - coupon.fixed_amount_discount;
        }
        break;
      case 'minimum_price':
        discountAmount = basePrice - Math.max(coupon.fixed_amount_discount, 0);
        break;
      default:
        return { success: false, message: 'Invalid discount type', discount: 0 };
    }

    discountAmount = Math.max(0, Math.min(discountAmount, basePrice));

    // console.log(`✅ [PRO-PACKS ORDER] Coupon valid: ${coupon.code} - Discount: ₹${discountAmount}`);

    return {
      success: true,
      discount: Math.round(discountAmount),
      couponDetails: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        percentage_discount: coupon.percentage_discount,
        fixed_amount_discount: coupon.fixed_amount_discount
      }
    };
  } catch (error) {
    console.error('❌ [PRO-PACKS ORDER] Error validating coupon:', error);
    return { success: false, message: 'Coupon validation failed', discount: 0 };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      id,
      studentData,
      selectedCourses,
      cartType,
      couponCode,
      course,
      plan,
      courseId
    } = body;

    // console.log('💰 [PRO-PACKS ORDER] Received request:', {
    //   orderId: id,
    //   cartType,
    //   coursesCount: selectedCourses?.length,
    //   couponCode: couponCode || 'None'
    // });

    // Validate required fields
    if (!selectedCourses || selectedCourses.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No courses selected' },
        { status: 400 }
      );
    }

    if (!studentData || !studentData.name || !studentData.email || !studentData.phone) {
      return NextResponse.json(
        { success: false, message: 'Student data is required' },
        { status: 400 }
      );
    }

    // ✅ STEP 1: Fetch real prices from database
    // console.log('📊 [PRO-PACKS ORDER] Fetching real prices from database...');
    
    let originalTotal = 0;
    const coursesWithPrices = [];

    for (const course of selectedCourses) {
      const priceSearchTag = course.priceSearchTag || course.price_search_tag;
      
      if (!priceSearchTag) {
        console.error(`❌ [PRO-PACKS ORDER] Missing priceSearchTag for course:`, course);
        return NextResponse.json(
          { success: false, message: `Missing price information for ${course.courseName}` },
          { status: 400 }
        );
      }

      try {
        const realPrice = await fetchCoursePrice(priceSearchTag, course.plan);
        originalTotal += realPrice;
        
        coursesWithPrices.push({
          ...course,
          realPrice: realPrice
        });
      } catch (error) {
        console.error(`❌ [PRO-PACKS ORDER] Failed to fetch price for ${course.courseName}:`, error);
        return NextResponse.json(
          { success: false, message: `Failed to fetch price for ${course.courseName}` },
          { status: 500 }
        );
      }
    }

    // console.log(`✅ [PRO-PACKS ORDER] Original total from database: ₹${originalTotal}`);

    // ✅ STEP 2: Apply package discount (if applicable)
    let packageDiscount = 0;
    let priceAfterPackageDiscount = originalTotal;

    if (cartType === 'tech-starter-pack' && selectedCourses.length === 4) {
      const TECH_PACK_PRICE = 25000;
      if (originalTotal > TECH_PACK_PRICE) {
        packageDiscount = originalTotal - TECH_PACK_PRICE;
        priceAfterPackageDiscount = TECH_PACK_PRICE;
        // console.log(`✅ [PRO-PACKS ORDER] Tech Starter Pack discount applied: -₹${packageDiscount}`);
      }
    } else if (cartType === 'custom-pack') {
      // Add custom pack logic here if needed
      console.log('ℹ️ [PRO-PACKS ORDER] Custom pack - no package discount');
    }

    // ✅ STEP 3: Validate and apply coupon (if provided)
    let couponDiscount = 0;
    let couponDetails = null;

    if (couponCode && couponCode.trim() !== '') {
      const courseIdForCoupon = cartType === 'tech-starter-pack' 
        ? 'tech-starter-pack' 
        : cartType === 'custom-pack'
          ? 'pro-packs'
          : courseId || 'pro-packs';

      const couponResult = await validateAndCalculateCoupon(
        couponCode,
        priceAfterPackageDiscount,
        courseIdForCoupon
      );

      if (couponResult.success) {
        couponDiscount = couponResult.discount;
        couponDetails = couponResult.couponDetails;
        // console.log(`✅ [PRO-PACKS ORDER] Coupon applied: ${couponCode} - Discount: ₹${couponDiscount}`);
      } else {
        // console.log(`⚠️ [PRO-PACKS ORDER] Coupon validation failed: ${couponResult.message}`);
        return NextResponse.json(
          { success: false, message: couponResult.message },
          { status: 400 }
        );
      }
    }

    // ✅ STEP 4: Calculate final amount
    const finalAmount = priceAfterPackageDiscount - couponDiscount;

    if (finalAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid final amount' },
        { status: 400 }
      );
    }

    // console.log('💰 [PRO-PACKS ORDER] Final calculation:', {
    //   originalTotal,
    //   packageDiscount,
    //   priceAfterPackageDiscount,
    //   couponDiscount,
    //   finalAmount
    // });

    // ✅ STEP 5: Create Razorpay order with BACKEND-calculated price
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: id || `receipt_${Date.now()}`,
      notes: {
        student_name: studentData.name,
        student_email: studentData.email,
        student_phone: studentData.phone,
        cart_type: cartType,
        courses_count: selectedCourses.length.toString(),
        coupon_code: couponCode || 'none',
        original_total: originalTotal.toString(),
        package_discount: packageDiscount.toString(),
        coupon_discount: couponDiscount.toString(),
        final_amount: finalAmount.toString()
      }
    });

    // console.log('✅ [PRO-PACKS ORDER] Razorpay order created:', {
    //   orderId: razorpayOrder.id,
    //   amount: razorpayOrder.amount,
    //   currency: razorpayOrder.currency
    // });

    // ✅ STEP 6: Return order details with metadata
    return NextResponse.json({
      success: true,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      metadata: {
        originalTotal,
        packageDiscount,
        couponDiscount,
        finalAmount,
        coursesWithPrices,
        couponDetails,
        cartType,
        coursesCount: selectedCourses.length
      }
    });

  } catch (error) {
    console.error('❌ [PRO-PACKS ORDER] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create order',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}