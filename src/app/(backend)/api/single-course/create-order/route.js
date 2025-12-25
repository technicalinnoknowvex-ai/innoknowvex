import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getProgramById } from '@/app/(backend)/api/programs/programs';

// Initialize Razorpay with your credentials
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    // ============================================
    // STEP 1: Parse and validate request
    // ============================================
    const body = await request.json();
    const { courseId, plan, couponCode, studentData } = body;

    console.log('📝 Creating order for:', {
      courseId,
      plan,
      student: studentData?.email,
      hasCoupon: !!couponCode,
    });

    // Validate required fields
    if (!courseId || !plan || !studentData) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Missing required fields: courseId, plan, or studentData' 
        },
        { status: 400 }
      );
    }

    if (!studentData.name || !studentData.email || !studentData.phone) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid student data. Name, email, and phone are required.' 
        },
        { status: 400 }
      );
    }

    // ============================================
    // STEP 2: Fetch course details from programs table
    // ============================================
    const program = await getProgramById(courseId);

    if (!program) {
      console.error('❌ Course not found:', courseId);
      return NextResponse.json(
        { 
          success: false,
          message: 'Course not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Program found:', program.title);

    // ============================================
    // STEP 3: Fetch pricing from pricing API
    // ============================================
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';
    
    console.log('💰 Fetching pricing from API for course:', courseId);
    
    let pricingResponse;
    try {
      pricingResponse = await fetch(`${baseUrl}/api/pricing/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!pricingResponse.ok) {
        console.error('❌ Pricing API returned error:', pricingResponse.status);
        return NextResponse.json(
          { 
            success: false,
            message: 'Pricing not available for this course' 
          },
          { status: 400 }
        );
      }
    } catch (fetchError) {
      console.error('❌ Error fetching pricing:', fetchError);
      return NextResponse.json(
        { 
          success: false,
          message: 'Failed to fetch pricing data' 
        },
        { status: 500 }
      );
    }

    const pricingData = await pricingResponse.json();
    
    console.log('✅ Pricing data fetched:', pricingData);

    // ============================================
    // STEP 4: Extract plan-specific pricing
    // ============================================
    let originalPrice = 0;
    let currentPrice = 0;

    const planLower = plan.toLowerCase();

    // Extract prices based on plan from pricing table
    if (planLower === 'self' || planLower === 'self-paced') {
      originalPrice = pricingData.self_actual_price || 0;
      currentPrice = pricingData.self_current_price || 0;
    } else if (planLower === 'mentor' || planLower === 'mentor-led') {
      originalPrice = pricingData.mentor_actual_price || 0;
      currentPrice = pricingData.mentor_current_price || 0;
    } else if (planLower === 'professional') {
      originalPrice = pricingData.professional_actual_price || 0;
      currentPrice = pricingData.professional_current_price || 0;
    } else {
      console.error('❌ Invalid plan:', plan);
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid plan selected. Must be: Self-Paced, Mentor-Led, or Professional' 
        },
        { status: 400 }
      );
    }

    // Validate prices exist
    if (!currentPrice || currentPrice <= 0) {
      console.error('❌ Invalid pricing for plan:', plan, 'Price:', currentPrice);
      return NextResponse.json(
        { 
          success: false,
          message: `Pricing not available for ${plan} plan` 
        },
        { status: 400 }
      );
    }

    console.log('💰 Pricing extracted:', {
      originalPrice,
      currentPrice,
      plan: planLower,
      platformDiscount: originalPrice - currentPrice,
    });

    // ============================================
    // STEP 5: Validate and apply coupon (if provided)
    // ============================================
    let finalPrice = currentPrice;
    let couponDiscount = 0;
    let couponDiscountPercentage = 0;
    let appliedCouponDetails = null;

    if (couponCode && couponCode.trim().length > 0) {
      console.log('🎟️ Validating coupon:', couponCode);

      try {
        // Call existing coupon validation API
        const couponValidationResponse = await fetch(
          `${baseUrl}/api/validate-coupon`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              couponCode: couponCode.trim().toUpperCase(),
              courseId: courseId,
              originalPrice: currentPrice,
              course: program.title,
              plan: plan,
            }),
          }
        );

        if (couponValidationResponse.ok) {
          const couponResult = await couponValidationResponse.json();

          if (couponResult.success && couponResult.coupon) {
            couponDiscount = couponResult.pricing?.discountAmount || 0;
            couponDiscountPercentage = couponResult.pricing?.savingsPercentage || 0;
            finalPrice = couponResult.pricing?.finalAmount || currentPrice;
            appliedCouponDetails = couponResult.coupon;

            console.log('✅ Coupon applied successfully:', {
              code: couponCode,
              discount: couponDiscount,
              percentage: couponDiscountPercentage,
              finalPrice,
            });
          } else {
            console.log('⚠️ Coupon validation failed:', couponResult.message);
            // Continue without coupon - don't fail the entire order
          }
        } else {
          const errorData = await couponValidationResponse.json();
          console.log('⚠️ Coupon validation API error:', errorData.message);
          // Continue without coupon
        }
      } catch (couponError) {
        console.error('⚠️ Coupon validation error:', couponError);
        // Continue without coupon - don't fail the entire order
      }
    }

    // Final price validation
    if (finalPrice <= 0) {
      console.error('❌ Invalid final price:', finalPrice);
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid final price calculated. Please contact support.' 
        },
        { status: 400 }
      );
    }

    // ============================================
    // STEP 6: Create Razorpay order
    // ============================================
    const amountInPaise = Math.round(finalPrice * 100);

    console.log('🔐 Creating Razorpay order:', {
      amount: amountInPaise,
      amountInRupees: finalPrice,
      currency: pricingData.currency || 'INR',
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: pricingData.currency || 'INR',
      receipt: `order_${courseId}_${Date.now()}`,
      notes: {
        courseId: courseId,
        courseName: program.title,
        plan: plan,
        studentName: studentData.name,
        studentEmail: studentData.email,
        studentPhone: studentData.phone,
        couponCode: appliedCouponDetails?.code || 'N/A',
        originalPrice: originalPrice.toString(),
        currentPrice: currentPrice.toString(),
        couponDiscount: couponDiscount.toString(),
        finalPrice: finalPrice.toString(),
        orderType: 'single_course',
      },
    });

    console.log('✅ Razorpay order created successfully:', razorpayOrder.id);

    // ============================================
    // STEP 7: Return order details to frontend
    // ============================================
    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      
      // Pricing breakdown (for display purposes only - frontend CANNOT modify these)
      pricing: {
        originalPrice: originalPrice,
        currentPrice: currentPrice,
        platformDiscount: originalPrice - currentPrice,
        platformDiscountPercentage: originalPrice > 0 
          ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
          : 0,
        couponDiscount: couponDiscount,
        couponDiscountPercentage: couponDiscountPercentage,
        finalPrice: finalPrice,
        totalSavings: originalPrice - finalPrice,
        totalSavingsPercentage: originalPrice > 0
          ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
          : 0,
      },
      
      // Course details
      courseDetails: {
        id: program.id,
        title: program.title,
        category: program.category || 'N/A',
      },
      
      // Coupon details (if applied)
      appliedCoupon: appliedCouponDetails,

      // Metadata
      metadata: {
        orderType: 'single_course',
        plan: plan,
        createdAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create order. Please try again.',
        error: process.env.NODE_ENV === 'development' 
          ? (error.message || 'Unknown error')
          : undefined,
      },
      { status: 500 }
    );
  }
}