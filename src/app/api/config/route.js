// src/app/api/config/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch configuration',
        success: false,
      },
      { status: 500 }
    );
  }
}