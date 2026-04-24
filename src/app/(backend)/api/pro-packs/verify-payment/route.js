import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function incrementCouponUsage(couponCode) {
  try {
    if (!couponCode || couponCode.trim() === '') {
      console.log('ℹ️ [PRO-PACKS VERIFY] No coupon code provided');
      return { success: true, skipped: true };
    }

    // console.log(`🎫 [PRO-PACKS VERIFY] Incrementing usage for: ${couponCode}`);

    const { data: coupon, error: fetchError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase().trim())
      .single();

    if (fetchError || !coupon) {
      console.error('❌ [PRO-PACKS VERIFY] Coupon not found:', fetchError);
      return { success: false, error: 'Coupon not found' };
    }

    const newTimesUsed = (coupon.times_used || 0) + 1;

    // console.log('📊 [PRO-PACKS VERIFY] Current state:', {
    //   code: coupon.code,
    //   currentUsage: coupon.times_used || 0,
    //   newUsage: newTimesUsed,
    //   maxUses: coupon.max_uses || 'Unlimited'
    // });

    const { data: updatedCoupon, error: updateError } = await supabase
      .from('coupons')
      .update({ times_used: newTimesUsed })
      .eq('id', coupon.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ [PRO-PACKS VERIFY] Update failed:', updateError);
      return { success: false, error: updateError };
    }

    // console.log('✅ [PRO-PACKS VERIFY] Usage incremented successfully:', {
    //   code: updatedCoupon.code,
    //   timesUsed: updatedCoupon.times_used,
    //   maxUses: updatedCoupon.max_uses || 'Unlimited'
    // });

    if (updatedCoupon.max_uses && updatedCoupon.times_used >= updatedCoupon.max_uses) {
      console.log('⚠️ [PRO-PACKS VERIFY] Coupon reached maximum usage:', {
        code: updatedCoupon.code,
        timesUsed: updatedCoupon.times_used,
        maxUses: updatedCoupon.max_uses
      });
    }

    return { success: true, data: updatedCoupon };
  } catch (error) {
    console.error('❌ [PRO-PACKS VERIFY] Unexpected error:', error);
    return { success: false, error: error.message };
  }
}

export async function POST(request) {
  // console.log('=== Pro-Packs Payment Verification Started ===');
  
  try {
    const body = await request.json();
    // console.log('Received body:', JSON.stringify(body, null, 2));

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
      couponDetails,
      courseId,
      courses,
      isCustomPack,
      isTechStarterPack,
      backendMetadata
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing Razorpay fields:', {
        hasOrderId: !!razorpay_order_id,
        hasPaymentId: !!razorpay_payment_id,
        hasSignature: !!razorpay_signature
      });
      return new Response(
        JSON.stringify({
          message: 'Missing required Razorpay fields',
          success: false
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!studentData || !studentData.name || !studentData.email || !studentData.phone) {
      console.error('Invalid student data:', studentData);
      return new Response(
        JSON.stringify({
          message: 'Invalid or incomplete student data',
          success: false
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate environment variables
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing RAZORPAY_KEY_SECRET environment variable');
      return new Response(
        JSON.stringify({
          message: 'Server configuration error - missing payment credentials',
          success: false
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Verify Razorpay signature
    // console.log('Verifying signature...');
    const body_string = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body_string.toString())
      .digest('hex');

    // console.log('Signature verification:', {
    //   expected: expectedSignature.substring(0, 15) + '...',
    //   received: razorpay_signature.substring(0, 15) + '...',
    //   match: expectedSignature === razorpay_signature
    // });

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch - payment verification failed');
      return new Response(
        JSON.stringify({
          message: 'Payment verification failed - Invalid signature',
          success: false
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // console.log('✓ Signature verified successfully');

    // Extract student data
    const { name, email, phone } = studentData;

    // Increment coupon usage
    let couponIncrementSuccess = false;
    if (couponCode && couponCode.trim() !== '') {
      const couponResult = await incrementCouponUsage(couponCode);
      
      if (couponResult.success && !couponResult.skipped) {
        couponIncrementSuccess = true;
        // console.log('✅ [PRO-PACKS VERIFY] Coupon usage incremented');
      } else if (!couponResult.success) {
        console.error('⚠️ [PRO-PACKS VERIFY] Coupon increment failed, but payment is valid');
      }
    }

    // Save to Supabase
    let supabaseSuccess = false;
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Missing Supabase credentials');
        throw new Error('Supabase configuration missing');
      }

      // console.log('Preparing to save payment data to Supabase...');
      
      const paymentData = {
        student_name: name,
        student_email: email,
        student_phone: phone,
        course_name: course,
        course_id: courseId || (isTechStarterPack ? 'tech-starter-pack' : isCustomPack ? 'custom-pack' : 'pro-packs'),
        plan: plan,
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        original_amount: parseFloat(originalAmount || amount),
        final_amount: parseFloat(amount),
        discount_amount: parseFloat(discountAmount || 0),
        discount_percentage: parseFloat(discountPercentage || 0),
        coupon_code: couponCode || null,
        coupon_details: couponDetails || null,
        payment_status: 'completed',
        verification_status: 'verified',
        metadata: {
          isCustomPack: isCustomPack || false,
          isTechStarterPack: isTechStarterPack || false,
          coursesCount: courses?.length || 1,
          courses: courses || [],
          backendMetadata: backendMetadata || null,
          verifiedAt: new Date().toISOString()
        }
      };

      // console.log('Payment data to insert:', JSON.stringify(paymentData, null, 2));

      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // console.log('✓ Payment data saved to Supabase:', data);
      supabaseSuccess = true;

    } catch (dbError) {
      console.error('Error saving to Supabase:', dbError);
      console.error('Error details:', {
        message: dbError.message,
        code: dbError.code,
        details: dbError.details,
        hint: dbError.hint
      });
    }

    // Send confirmation email
    let emailSuccess = false;
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('Missing RESEND_API_KEY - skipping email');
        throw new Error('Email service not configured');
      }

      const resend = new Resend(process.env.RESEND_API_KEY);

      const coursesList = courses && courses.length > 0
        ? courses.map(c => `• ${c.courseName} - ${c.plan} Plan`).join('<br>')
        : `• ${course}`;

      let discountText = '';
      if (couponCode && discountAmount > 0 && originalAmount) {
        const discountPct = discountPercentage || ((discountAmount / originalAmount) * 100).toFixed(0);
        discountText = `
          <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #22c55e;">
            <h4 style="color: #16a34a; margin-top: 0;">Coupon Applied! 🎉</h4>
            <p style="margin: 5px 0; color: #15803d;"><strong>Coupon Code:</strong> ${couponCode}</p>
            <p style="margin: 5px 0; color: #15803d;"><strong>Discount:</strong> ${discountPct}% off</p>
            <p style="margin: 5px 0; color: #15803d;"><strong>You Saved:</strong> ₹${discountAmount.toLocaleString('en-IN')}</p>
          </div>
        `;
      }

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #A38907 0%, #9F8310 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Innoknowvex!</h1>
          </div>

          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">Thank you for your purchase, ${name}! 🎉</h2>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We are excited to have you on board. Your enrollment has been confirmed successfully!
            </p>

            ${discountText}

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #A38907;">
              <h3 style="color: #333; margin-top: 0;">Enrolled Courses:</h3>
              <p style="margin: 10px 0; line-height: 1.8;">${coursesList}</p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #A38907;">
              <h3 style="color: #333; margin-top: 0;">Purchase Details:</h3>
              <p style="margin: 5px 0;"><strong>Plan:</strong> ${plan}</p>
              ${originalAmount && originalAmount !== amount ? `<p style="margin: 5px 0;"><strong>Original Price:</strong> ₹${parseFloat(originalAmount).toLocaleString('en-IN')}</p>` : ''}
              ${discountAmount > 0 ? `<p style="margin: 5px 0; color: #22c55e;"><strong>Discount:</strong> -₹${parseFloat(discountAmount).toLocaleString('en-IN')}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${parseFloat(amount).toLocaleString('en-IN')}</p>
              <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${razorpay_order_id}</p>
            </div>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Our team at <strong>Innoknowvex</strong> will be contacting you shortly with the next steps and course access details.
            </p>

            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Congratulations on taking the first step toward your learning journey! 🚀
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 14px;">
                If you have any questions, feel free to reach out to our support team.
              </p>
              <p style="color: #999; font-size: 14px;">
                <strong>Innoknowvex Team</strong>
              </p>
            </div>
          </div>
        </div>
      `;

      // console.log('Sending confirmation email to:', email);
      
      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: `Welcome to ${course} - ${plan} | Innoknowvex`,
        html: emailHtml,
      });

      // console.log('✓ Email sent successfully:', emailResult);
      emailSuccess = true;

    } catch (emailError) {
      console.error('Error sending email:', emailError);
      console.error('Email error details:', {
        message: emailError.message,
        stack: emailError.stack
      });
    }

    // // Return success response
    // console.log('=== Pro-Packs Payment Verification Completed Successfully ===');
    // console.log('Results:', {
    //   signatureVerified: true,
    //   supabaseSaved: supabaseSuccess,
    //   couponUpdated: couponIncrementSuccess,
    //   emailSent: emailSuccess
    // });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified and enrollment recorded',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        couponUsed: !!couponCode,
        couponUpdated: couponIncrementSuccess,
        details: {
          supabaseSaved: supabaseSuccess,
          emailSent: emailSuccess
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error('=== Pro-Packs Payment Verification Error ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    
    return new Response(
      JSON.stringify({
        message: 'Failed to verify payment',
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