// src/app/api/verify-payment/route.js
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

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

    // Save to Google Sheets
    try {
      // Set up Google Sheets authentication
      const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
      const auth = new google.auth.JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      await auth.authorize();
      const sheets = google.sheets({ version: 'v4', auth });

      // Prepare data for Google Sheets
      const enrollmentData = [
        name,                           // Student Name
        email,                          // Student Email
        phone,                          // Student Phone
        course,                         // Course Name
        plan,                           // Plan Name
        `₹${amount}`,                   // Amount Paid
        razorpay_payment_id,            // Payment ID
        razorpay_order_id,              // Order ID
        'SUCCESS',                      // Payment Status
        new Date().toLocaleString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })                              // Date & Time
      ];

      // Append data to Google Sheets
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Enrollments!A:J', // Using 'Enrollments' sheet, adjust range as needed
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [enrollmentData],
        },
      });

      console.log('Enrollment data saved to Google Sheets successfully');

    } catch (sheetsError) {
      console.error('Error saving to Google Sheets:', sheetsError);
      // Don't fail the payment verification if Google Sheets fails
      // You might want to implement a retry mechanism or alternative storage
      console.warn('Payment verified but failed to save to Google Sheets');
    }

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