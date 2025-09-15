
import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      amount, 
      currency = 'INR', 
      course, 
      plan, 
      studentData, 
      couponCode, 
      originalAmount, 
      discountAmount,
      courseId
    } = body;
             
    console.log('Create order request:', { 
      amount, 
      currency, 
      course, 
      plan, 
      studentData, 
      couponCode, 
      originalAmount, 
      discountAmount,
      courseId
    });

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

    // Initialize Razorpay here instead of at module level
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // If coupon is provided, re-validate it to prevent tampering
    if (couponCode) {
      try {
        // Set up Google Sheets authentication
        const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
        const auth = new google.auth.JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        await auth.authorize();
        const sheets = google.sheets({ version: 'v4', auth });

        // Fetch and validate coupon
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: 'Coupons!A:H',
        });

        const rows = response.data.values;
        if (rows && rows.length > 1) {
          const coupons = rows.slice(1);
          const coupon = coupons.find(row => 
            row[0] && row[0].toString().toUpperCase() === couponCode.toUpperCase()
          );

          if (!coupon) {
            return NextResponse.json(
              { message: 'Invalid coupon code during order creation', success: false },
              { status: 400 }
            );
          }

          // Re-validate coupon constraints
          const [
            code,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscount,
            validFrom,
            validUntil,
            applicableCourses
          ] = coupon;

          // Check expiry
          const currentDate = new Date();
          const validUntilDate = validUntil ? new Date(validUntil) : null;
          if (validUntilDate && currentDate > validUntilDate) {
            return NextResponse.json(
              { message: 'Coupon has expired', success: false },
              { status: 400 }
            );
          }

          // Check minimum amount
          const minAmount = parseFloat(minOrderAmount) || 0;
          if (originalAmount < minAmount) {
            return NextResponse.json(
              { message: `Minimum order amount of ₹${minAmount} required`, success: false },
              { status: 400 }
            );
          }

          // Check course applicability using course ID
          if (applicableCourses && applicableCourses.trim() !== '') {
            const applicableCoursesArray = applicableCourses.split(',').map(c => c.trim().toLowerCase());
            // Use courseId if available, otherwise fall back to course name
            const courseToCheck = courseId ? courseId.toLowerCase() : course.toLowerCase();
            
            if (!applicableCoursesArray.includes(courseToCheck)) {
              return NextResponse.json(
                { message: 'Coupon not applicable for this course', success: false },
                { status: 400 }
              );
            }
          }
          // If applicableCourses is empty, the coupon applies to all courses
        }
      } catch (error) {
        console.error('Error validating coupon during order creation:', error);
        return NextResponse.json(
          { message: 'Failed to validate coupon', success: false },
          { status: 500 }
        );
      }
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
        coupon_code: couponCode || '',
        original_amount: originalAmount || amount,
        discount_amount: discountAmount || 0,
        course_id: courseId || '',
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