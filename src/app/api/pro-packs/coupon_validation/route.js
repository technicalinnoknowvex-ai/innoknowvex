
// src/app/api/pro-packs/coupon_validation/route.js
import { createClient } from '@supabase/supabase-js';

// Helper function to validate date format and check if coupon is still valid
const isValidCouponDate = (validFrom, validUntil) => {
  try {
    const now = new Date();
    const startDate = validFrom ? new Date(validFrom) : null;
    const endDate = validUntil ? new Date(validUntil) : null;

    // If no dates provided, consider it always valid
    if (!startDate && !endDate) return true;

    // Check start date
    if (startDate && now < startDate) return false;

    // Check end date
    if (endDate && now > endDate) return false;

    return true;
  } catch (error) {
    console.error('Error validating coupon dates:', error);
    return false;
  }
};

// Helper function to check if a coupon is applicable to the specific course
const isCouponApplicableToCourse = (applicableCourses, courseId) => {
  // If applicableCourses is null, empty array, or contains no items, the coupon is always applicable
  if (!applicableCourses || applicableCourses.length === 0) {
    return true;
  }
  
  // Check if array contains "all" or "*" or "pro-packs" indicating universal applicability
  if (applicableCourses.some(course => {
    const courseStr = typeof course === 'string' ? course.toLowerCase().trim() : '';
    return courseStr === 'all' || courseStr === '*' || courseStr === 'pro-packs';
  })) {
    return true;
  }

  // Check if courseId is in the list of applicable courses
  const coursesList = applicableCourses.map(item => 
    typeof item === 'string' ? item.toLowerCase().trim() : ''
  );
  
  const courseIdLower = courseId ? courseId.toLowerCase().trim() : '';

  // The coupon is applicable if the courseId is in the list
  return coursesList.includes(courseIdLower);
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { couponCode, price, courseId } = body;

    console.log('Coupon validation request:', {
      couponCode,
      price,
      courseId
    });

    // Validate required fields
    if (!couponCode || !price) {
      return new Response(
        JSON.stringify({
          message: 'Missing required fields: couponCode and price are required',
          success: false
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (price <= 0) {
      return new Response(
        JSON.stringify({
          message: 'Invalid price',
          success: false
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate Supabase environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing required Supabase configuration');
      return new Response(
        JSON.stringify({
          message: 'Server configuration error',
          success: false
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL, 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    console.log('Successfully initialized Supabase client');

    // Query the Supabase database for the coupon
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        console.log('Coupon not found:', couponCode.toUpperCase());
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
      
      console.error('Supabase query error:', error);
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

    if (!matchingCoupon) {
      console.log('Coupon not found or inactive:', couponCode.toUpperCase());
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

    console.log('Found matching coupon:', matchingCoupon);

    // Check if coupon is active
    if (!matchingCoupon.is_active) {
      return new Response(
        JSON.stringify({
          message: 'This coupon is no longer active',
          success: false
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate coupon dates
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

    // Check usage limits
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

    // Check minimum order amount
    if (matchingCoupon.min_order_amount && price < matchingCoupon.min_order_amount) {
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

    // Check maximum order amount (if exists)
    if (matchingCoupon.max_order_amount && price > matchingCoupon.max_order_amount) {
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

    // Check if coupon is applicable for the course
    if (!isCouponApplicableToCourse(matchingCoupon.applicable_courses, courseId)) {
      return new Response(
        JSON.stringify({
          message: 'This coupon is not applicable for the selected course',
          success: false
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Calculate discount based on the discount type
    let discountAmount = 0;
    const discountType = matchingCoupon.discount_type;
    let discountPercentage = 0;

    if (discountType === 'percentage') {
      // Use percentage_discount field from schema
      const percentageValue = matchingCoupon.percentage_discount || 0;
      discountAmount = Math.round((price * percentageValue) / 100);
      discountPercentage = percentageValue;
    } else if (discountType === 'fixed') {
      // Use fixed_amount_discount field from schema
      discountAmount = Math.min(matchingCoupon.fixed_amount_discount || 0, price);
      discountPercentage = Math.round((discountAmount / price) * 100);
    }

    // Ensure discount doesn't exceed the order amount
    discountAmount = Math.min(discountAmount, price);
    const finalPrice = Math.max(price - discountAmount, 0);

    // Recalculate percentage based on actual discount amount
    const actualDiscountPercentage = price > 0 ? Math.round((discountAmount / price) * 100) : 0;

    console.log('Coupon validation successful:', {
      code: matchingCoupon.code,
      discountType: discountType,
      discountValue: discountType === 'percentage' ? matchingCoupon.percentage_discount : matchingCoupon.fixed_amount_discount,
      discountAmount,
      finalPrice,
      originalPrice: price,
      actualDiscountPercentage
    });

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Coupon applied successfully',
        originalPrice: price,
        finalPrice: Math.round(finalPrice),
        discountAmount: Math.round(discountAmount),
        discountPercentage: actualDiscountPercentage,
        discountType: discountType,
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
    console.error('Error validating coupon:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to validate coupon due to a server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        success: false,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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