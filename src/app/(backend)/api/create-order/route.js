import Razorpay from 'razorpay';
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

// Helper function to check if coupon is applicable to the specific course
const isCouponApplicableToCourse = (applicableCourses, courseId, courseName) => {
  // If applicableCourses is empty, null, or undefined, coupon applies to all courses
  if (!applicableCourses || (Array.isArray(applicableCourses) && applicableCourses.length === 0)) {
    return true;
  }

  // Check if array contains "all" or "*" indicating universal applicability
  if (applicableCourses.some(course => 
    typeof course === 'string' && 
    (course.toLowerCase() === 'all' || course === '*')
  )) {
    return true;
  }

  // Convert to lowercase for case-insensitive comparison
  const coursesLower = applicableCourses.map(course => 
    typeof course === 'string' ? course.toLowerCase().trim() : ''
  );
  const courseIdLower = courseId ? courseId.toLowerCase().trim() : '';
  const courseNameLower = courseName ? courseName.toLowerCase().trim() : '';

  // Check if courseId or courseName matches any in the list
  return coursesLower.includes(courseIdLower) ||
         coursesLower.includes(courseNameLower);
};

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      currency = 'INR',
      course,
      plan,
      studentData,
      couponCode,
      originalAmount,
      courseId
    } = body;

    console.log('Create order request:', {
      currency,
      course,
      plan,
      studentData,
      couponCode,
      originalAmount,
      courseId
    });

    // Validate required fields
    if (!originalAmount || !course || !plan || !studentData) {
      return new Response(
        JSON.stringify({
          message: 'Missing required fields',
          success: false
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay credentials');
      return new Response(
        JSON.stringify({
          message: 'Server configuration error',
          success: false
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase credentials');
      return new Response(
        JSON.stringify({
          message: 'Server configuration error - cannot validate coupon',
          success: false
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    let finalAmount = originalAmount;
    let calculatedDiscountAmount = 0;
    let validatedCoupon = null;
    
    // If coupon is provided, re-validate and calculate the final amount
    if (couponCode) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        console.log('Fetching coupon from Supabase:', couponCode.toUpperCase());
        const { data: matchingCouponRow, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', couponCode.toUpperCase().trim())
          .eq('is_active', true) // Only fetch active coupons
          .single();

        if (error || !matchingCouponRow) {
          console.log('Coupon not found or inactive:', couponCode.toUpperCase(), 'Error:', error);
          return new Response(
            JSON.stringify({
              message: 'Invalid or inactive coupon code',
              success: false
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        console.log('Found matching coupon:', matchingCouponRow);

        // Check if coupon is active
        if (!matchingCouponRow.is_active) {
          return new Response(
            JSON.stringify({
              message: 'This coupon is no longer active',
              success: false
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        // Validate coupon dates
        if (!isValidCouponDate(matchingCouponRow.valid_from, matchingCouponRow.valid_until)) {
          const validUntilDate = matchingCouponRow.valid_until ? new Date(matchingCouponRow.valid_until).toLocaleDateString() : '';
          const validFromDate = matchingCouponRow.valid_from ? new Date(matchingCouponRow.valid_from).toLocaleDateString() : '';

          let dateMessage = 'Coupon is not valid';
          if (validUntilDate && new Date() > new Date(matchingCouponRow.valid_until)) {
            dateMessage = `Coupon expired on ${validUntilDate}`;
          } else if (validFromDate && new Date() < new Date(matchingCouponRow.valid_from)) {
            dateMessage = `Coupon will be valid from ${validFromDate}`;
          }

          return new Response(
            JSON.stringify({
              message: dateMessage,
              success: false
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        // Check usage limits
        if (matchingCouponRow.max_uses && matchingCouponRow.times_used >= matchingCouponRow.max_uses) {
          return new Response(
            JSON.stringify({
              message: 'This coupon has reached its usage limit',
              success: false
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        // Check minimum order amount (using correct field name from schema)
        if (matchingCouponRow.min_order_amount && originalAmount < matchingCouponRow.min_order_amount) {
          return new Response(
            JSON.stringify({
              message: `Minimum order amount of ₹${matchingCouponRow.min_order_amount} required for this coupon`,
              success: false
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        // Check if coupon is applicable for the course
        if (!isCouponApplicableToCourse(matchingCouponRow.applicable_courses, courseId, course)) {
          return new Response(
            JSON.stringify({
              message: 'This coupon is not applicable for the selected course',
              success: false
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        // Server-side discount calculation using correct field names from schema
        if (matchingCouponRow.discount_type === 'percentage') {
          // Use percentage_discount field from schema
          const percentageValue = matchingCouponRow.percentage_discount || 0;
          calculatedDiscountAmount = Math.round((originalAmount * percentageValue) / 100);
          
          // Note: max_discount_amount not in your current schema, but keeping for future use
          // if (matchingCouponRow.max_discount_amount && calculatedDiscountAmount > matchingCouponRow.max_discount_amount) {
          //   calculatedDiscountAmount = matchingCouponRow.max_discount_amount;
          // }
        } else if (matchingCouponRow.discount_type === 'fixed') {
          // Use fixed_amount_discount field from schema
          calculatedDiscountAmount = Math.min(matchingCouponRow.fixed_amount_discount || 0, originalAmount);
        }

        // Ensure discount doesn't exceed the order amount
        calculatedDiscountAmount = Math.min(calculatedDiscountAmount, originalAmount);
        finalAmount = Math.max(originalAmount - calculatedDiscountAmount, 0);
        validatedCoupon = matchingCouponRow;

        console.log('Coupon validation successful during order creation');
        console.log(`Original: ${originalAmount}, Discount: ${calculatedDiscountAmount}, Final: ${finalAmount}`);

      } catch (error) {
        console.error('Error validating coupon during order creation:', error);
        return new Response(
          JSON.stringify({
            message: 'Failed to validate coupon during order creation',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            success: false
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    // Ensure final amount is a number and convert to integer (paise)
    const amountInPaise = Math.round(Number(finalAmount) * 100); // Convert rupees to paise

    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      return new Response(
        JSON.stringify({
          message: 'Invalid final amount',
          success: false
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amountInPaise,
      currency,
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      notes: {
        course,
        plan,
        student_name: studentData.name,
        student_email: studentData.email,
        student_phone: studentData.phone,
        coupon_code: couponCode || '',
        original_amount: originalAmount.toString(),
        discount_amount: calculatedDiscountAmount.toString(),
        final_amount: finalAmount.toString(),
        course_id: courseId || '',
        discount_percentage: validatedCoupon ? 
          (validatedCoupon.discount_type === 'percentage' ? validatedCoupon.percentage_discount : Math.round((calculatedDiscountAmount / originalAmount) * 100)) : '0',
      },
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order.id);

    return new Response(
      JSON.stringify({
        id: order.id,
        currency: order.currency,
        amount: order.amount,
        finalAmount: finalAmount,
        originalAmount: originalAmount,
        discountAmount: calculatedDiscountAmount,
        success: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to create order',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        success: false,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      {
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