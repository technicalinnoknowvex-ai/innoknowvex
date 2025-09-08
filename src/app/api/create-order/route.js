// src/app/api/create-order/route.js
import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', course, plan, studentData } = body;
        
    console.log('Create order request:', { amount, currency, course, plan, studentData });

    // Validate required fields
    if (!amount || !course || !plan || !studentData) {
      return NextResponse.json(
        { message: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay credentials');
      return NextResponse.json(
        { message: 'Server configuration error', success: false },
        { status: 500 }
      );
    }

    // Ensure amount is a number and convert to integer (paise)
    const amountInPaise = Math.round(Number(amount));
        
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      return NextResponse.json(
        { message: 'Invalid amount', success: false },
        { status: 400 }
      );
    }

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
      },
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order.id);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      success: true,
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        message: 'Failed to create order',
        error: error.message,
        success: false,
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