import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    // ============================================
    // STEP 1: Parse request body
    // ============================================
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentData,
      course,
      plan,
      amount,
      originalAmount,
      discountAmount,
      discountPercentage,
      couponCode,
      appliedCoupon,
      courseId,
    } = body;

    console.log('🔐 [VERIFY] Starting payment verification:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      courseId: courseId,
      student: studentData?.email,
      amount: amount,
    });

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('❌ [VERIFY] Missing payment verification parameters');
      return NextResponse.json(
        { 
          success: false,
          message: 'Missing payment verification parameters' 
        },
        { status: 400 }
      );
    }

    if (!studentData || !studentData.email || !studentData.name || !studentData.phone) {
      console.error('❌ [VERIFY] Missing student data');
      return NextResponse.json(
        { 
          success: false,
          message: 'Missing student data. Name, email, and phone are required.' 
        },
        { status: 400 }
      );
    }

    if (!courseId || !course || !plan) {
      console.error('❌ [VERIFY] Missing course or plan data');
      return NextResponse.json(
        { 
          success: false,
          message: 'Missing course or plan information' 
        },
        { status: 400 }
      );
    }

    // ============================================
    // STEP 2: Verify Razorpay signature
    // ============================================
    console.log('🔑 [VERIFY] Verifying Razorpay signature...');
    
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('❌ [VERIFY] Signature verification failed!');
      console.error('Expected:', generatedSignature);
      console.error('Received:', razorpay_signature);
      
      return NextResponse.json(
        { 
          success: false,
          message: 'Payment verification failed. Invalid signature.' 
        },
        { status: 400 }
      );
    }

    console.log('✅ [VERIFY] Signature verified successfully');

    // ============================================
    // STEP 3: Fetch payment details from Razorpay
    // ============================================
    let paymentDetails = null;
    try {
      console.log('📡 [VERIFY] Fetching payment details from Razorpay...');
      paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      
      console.log('✅ [VERIFY] Payment details fetched:', {
        status: paymentDetails.status,
        amount: paymentDetails.amount,
        method: paymentDetails.method,
        email: paymentDetails.email,
      });
    } catch (fetchError) {
      console.error('⚠️ [VERIFY] Error fetching payment details:', fetchError);
      // Continue even if fetch fails - signature is verified
    }

    // ============================================
    // STEP 4: Verify payment status
    // ============================================
    if (paymentDetails && paymentDetails.status !== 'captured') {
      console.error('❌ [VERIFY] Payment not captured. Status:', paymentDetails.status);
      return NextResponse.json(
        { 
          success: false,
          message: `Payment not completed. Status: ${paymentDetails.status}` 
        },
        { status: 400 }
      );
    }

    console.log('✅ [VERIFY] Payment status confirmed: captured');

    // ============================================
    // STEP 5: Check if payment already exists
    // ============================================
    console.log('🔍 [VERIFY] Checking if payment record already exists...');
    
    const { data: existingPayment, error: paymentCheckError } = await supabase
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .maybeSingle();

    if (paymentCheckError) {
      console.error('⚠️ [VERIFY] Error checking existing payment:', paymentCheckError);
      // Continue anyway
    }

    if (existingPayment) {
      console.log('⚠️ [VERIFY] Payment already processed:', razorpay_order_id);
      return NextResponse.json(
        {
          success: true,
          message: 'Payment already verified',
          data: {
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            courseId: courseId,
            alreadyProcessed: true,
            existingRecord: existingPayment,
          },
        }
      );
    }

    // ============================================
    // STEP 6: Prepare metadata
    // ============================================
    const metadata = {
      order_type: 'single_course',
      platform_discount: (originalAmount || amount) - amount,
      payment_method: paymentDetails?.method || 'unknown',
      payment_email: paymentDetails?.email || studentData.email,
      razorpay_status: paymentDetails?.status || 'captured',
      verified_at: new Date().toISOString(),
      total_savings: (originalAmount || amount) - amount + (discountAmount || 0),
    };

    // ============================================
    // STEP 7: Save payment to database
    // ============================================
    console.log('💾 [VERIFY] Saving payment record to database...');
    
    const paymentData = {
      student_name: studentData.name,
      student_email: studentData.email,
      student_phone: studentData.phone,
      course_name: course,
      course_id: courseId,
      plan: plan,
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      razorpay_signature: razorpay_signature,
      original_amount: originalAmount || amount,
      final_amount: amount,
      discount_amount: discountAmount || 0,
      discount_percentage: discountPercentage || 0,
      coupon_code: couponCode || null,
      coupon_details: appliedCoupon ? JSON.stringify(appliedCoupon) : null,
      payment_status: 'completed',
      verification_status: 'verified',
      metadata: JSON.stringify(metadata),
    };

    const { data: savedPayment, error: paymentSaveError } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (paymentSaveError) {
      console.error('❌ [VERIFY] Error saving payment:', paymentSaveError);
      
      // Check if it's a duplicate order ID error
      if (paymentSaveError.code === '23505') {
        console.log('⚠️ [VERIFY] Duplicate order ID - payment already processed');
        
        // Fetch the existing payment record
        const { data: existingRecord } = await supabase
          .from('payments')
          .select('*')
          .eq('razorpay_order_id', razorpay_order_id)
          .single();
        
        return NextResponse.json(
          {
            success: true,
            message: 'Payment already verified',
            data: {
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              courseId: courseId,
              alreadyProcessed: true,
              existingRecord: existingRecord,
            },
          }
        );
      }
      
      // Critical error - payment verification succeeded but database save failed
      return NextResponse.json(
        {
          success: false,
          message: 'Payment verified but failed to save record. Please contact support.',
          error: paymentSaveError.message,
          data: {
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            courseId: courseId,
            signature_verified: true,
          },
        },
        { status: 500 }
      );
    }

    console.log('✅ [VERIFY] Payment record saved successfully:', savedPayment.id);

    // ============================================
    // STEP 8: Update coupon usage (if applicable)
    // ============================================
    if (couponCode && appliedCoupon) {
      console.log('🎟️ [VERIFY] Updating coupon usage for:', couponCode);
      
      try {
        // Increment coupon usage count
        const { data: couponData, error: couponFetchError } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', couponCode.toUpperCase())
          .single();

        if (!couponFetchError && couponData) {
          const { error: couponUpdateError } = await supabase
            .from('coupons')
            .update({
              used_count: (couponData.used_count || 0) + 1,
              updated_at: new Date().toISOString(),
            })
            .eq('code', couponCode.toUpperCase());

          if (couponUpdateError) {
            console.error('⚠️ [VERIFY] Error updating coupon usage:', couponUpdateError);
          } else {
            console.log('✅ [VERIFY] Coupon usage updated');
          }

          // Log coupon usage (if you have a coupon_usage table)
          const { error: usageLogError } = await supabase
            .from('coupon_usage')
            .insert({
              coupon_code: couponCode.toUpperCase(),
              student_email: studentData.email,
              course_id: courseId,
              order_id: razorpay_order_id,
              discount_amount: discountAmount || 0,
              used_at: new Date().toISOString(),
            });

          if (usageLogError) {
            console.error('⚠️ [VERIFY] Error logging coupon usage:', usageLogError);
            // Don't fail if coupon_usage table doesn't exist
          } else {
            console.log('✅ [VERIFY] Coupon usage logged');
          }
        }
      } catch (couponError) {
        console.error('⚠️ [VERIFY] Error updating coupon:', couponError);
        // Don't fail the entire verification for coupon update errors
      }
    }

    // ============================================
    // STEP 9: Send confirmation email (optional)
    // ============================================
    console.log('📧 [VERIFY] Sending confirmation email...');
    
    try {
      // TODO: Implement your email service here
      // Example:
      // await sendEnrollmentEmail({
      //   to: studentData.email,
      //   studentName: studentData.name,
      //   courseName: course,
      //   plan: plan,
      //   amountPaid: amount,
      //   orderId: razorpay_order_id,
      //   paymentId: razorpay_payment_id,
      // });
      
      console.log('✅ [VERIFY] Confirmation email sent (TODO: implement actual email service)');
    } catch (emailError) {
      console.error('⚠️ [VERIFY] Error sending email:', emailError);
      // Don't fail verification if email fails
    }

    // ============================================
    // STEP 10: Return success response
    // ============================================
    console.log('🎉 [VERIFY] Payment verification completed successfully!');
    
    return NextResponse.json({
      success: true,
      message: 'Payment verified and enrollment completed successfully',
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        paymentRecordId: savedPayment.id,
        courseId: courseId,
        courseName: course,
        plan: plan,
        studentEmail: studentData.email,
        studentName: studentData.name,
        studentPhone: studentData.phone,
        amountPaid: amount,
        paymentMethod: paymentDetails?.method || 'N/A',
        verifiedAt: new Date().toISOString(),
        pricing: {
          originalAmount: originalAmount || amount,
          platformDiscount: (originalAmount || amount) - amount,
          couponDiscount: discountAmount || 0,
          couponCode: couponCode || null,
          finalAmount: amount,
          totalSavings: (originalAmount || amount) - amount + (discountAmount || 0),
        },
      },
    });

  } catch (error) {
    console.error('❌ [VERIFY] Critical error during verification:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Payment verification failed. Please contact support with your payment ID.',
        error: process.env.NODE_ENV === 'development'
          ? (error.message || 'Unknown error')
          : undefined,
      },
      { status: 500 }
    );
  }
}