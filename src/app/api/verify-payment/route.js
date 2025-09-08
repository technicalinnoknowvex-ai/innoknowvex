// src/app/api/verify-payment/route.js
import crypto from 'crypto';
import { NextResponse } from 'next/server';

// Uncomment and adjust the import path for your database
// import sql from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentData,
      course,
      plan,
      amount
    } = body;

    console.log('Verify payment request:', {
      razorpay_order_id,
      razorpay_payment_id,
      studentData: studentData ? { ...studentData, phone: studentData.phone ? 'XXX-XXX-XXXX' : undefined } : null,
      course,
      plan,
      amount
    });

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !studentData) {
      return NextResponse.json(
        { message: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing RAZORPAY_KEY_SECRET');
      return NextResponse.json(
        { message: 'Server configuration error', success: false },
        { status: 500 }
      );
    }

    // Verify signature
    const body_string = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body_string.toString())
      .digest('hex');

    console.log('Signature verification:', {
      expected: expectedSignature.substring(0, 10) + '...',
      received: razorpay_signature.substring(0, 10) + '...',
      match: expectedSignature === razorpay_signature
    });

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: 'Payment verification failed - Invalid signature', success: false },
        { status: 400 }
      );
    }

    // Extract and validate student data
    const { name, email, phone } = studentData;
    if (!name || !email || !phone) {
      return NextResponse.json(
        { message: 'Invalid student data', success: false },
        { status: 400 }
      );
    }

    // Database insertion - uncomment and modify as needed
    /*
    try {
      await sql`
        INSERT INTO enrolled_students (
          student_name, 
          student_email, 
          student_phone, 
          course_name, 
          plan_name, 
          payment_status,
          amount_paid,
          payment_id,
          order_id,
          created_at
        ) VALUES (
          ${name}, 
          ${email}, 
          ${phone}, 
          ${course}, 
          ${plan}, 
          'SUCCESS',
          ${amount},
          ${razorpay_payment_id},
          ${razorpay_order_id},
          ${new Date().toISOString()}
        )
      `;
      console.log('Student enrollment recorded in database');
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        {
          message: 'Payment verified but failed to record enrollment',
          error: dbError.message,
          success: false
        },
        { status: 500 }
      );
    }
    */

    console.log('Payment verified successfully for:', email);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and enrollment recorded',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      {
        message: 'Failed to verify payment',
        error: error.message,
        success: false
      },
      { status: 500 }
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