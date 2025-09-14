// // src/app/api/verify-payment/route.js
// import crypto from 'crypto';
// import { NextResponse } from 'next/server';
// import { google } from 'googleapis';
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       studentData,
//       course,
//       plan,
//       amount,
//       originalAmount,
//       discountAmount,
//       couponCode
//     } = body;

//     console.log('Verify payment request:', {
//       razorpay_order_id,
//       razorpay_payment_id,
//       studentData: studentData ? { ...studentData, phone: studentData.phone ? 'XXX-XXX-XXXX' : undefined } : null,
//       course,
//       plan,
//       amount,
//       originalAmount,
//       discountAmount,
//       couponCode
//     });

//     // Validate required fields
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !studentData) {
//       return NextResponse.json(
//         { message: 'Missing required fields', success: false },
//         { status: 400 }
//       );
//     }

//     // Validate environment variables
//     if (!process.env.RAZORPAY_KEY_SECRET) {
//       console.error('Missing RAZORPAY_KEY_SECRET');
//       return NextResponse.json(
//         { message: 'Server configuration error', success: false },
//         { status: 500 }
//       );
//     }

//     if (!process.env.RESEND_API_KEY) {
//       console.error('Missing RESEND_API_KEY');
//       return NextResponse.json(
//         { message: 'Email service configuration error', success: false },
//         { status: 500 }
//       );
//     }

//     // Verify signature
//     const body_string = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body_string.toString())
//       .digest('hex');

//     console.log('Signature verification:', {
//       expected: expectedSignature.substring(0, 10) + '...',
//       received: razorpay_signature.substring(0, 10) + '...',
//       match: expectedSignature === razorpay_signature
//     });

//     if (expectedSignature !== razorpay_signature) {
//       return NextResponse.json(
//         { message: 'Payment verification failed - Invalid signature', success: false },
//         { status: 400 }
//       );
//     }

//     // Extract and validate student data
//     const { name, email, phone } = studentData;
//     if (!name || !email || !phone) {
//       return NextResponse.json(
//         { message: 'Invalid student data', success: false },
//         { status: 400 }
//       );
//     }

//     // Save to Google Sheets
//     try {
//       // Set up Google Sheets authentication
//       const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
//       const auth = new google.auth.JWT({
//         email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//         key: privateKey,
//         scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//       });

//       await auth.authorize();
//       const sheets = google.sheets({ version: 'v4', auth });

//       // Prepare data for Google Sheets
//       const enrollmentData = [
//         name,                           // Student Name
//         email,                          // Student Email
//         phone,                          // Student Phone
//         course,                         // Course Name
//         plan,                           // Plan Name
//         originalAmount ? `₹${originalAmount}` : `₹${amount}`, // Original Amount
//         couponCode || 'N/A',            // Coupon Code
//         discountAmount ? `₹${discountAmount}` : '₹0', // Discount Amount
//         `₹${amount}`,                   // Final Amount Paid
//         razorpay_payment_id,            // Payment ID
//         razorpay_order_id,              // Order ID
//         'SUCCESS',                      // Payment Status
//         new Date().toLocaleString('en-IN', { 
//           timeZone: 'Asia/Kolkata',
//           year: 'numeric',
//           month: '2-digit',
//           day: '2-digit',
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit',
//           hour12: true
//         })                              // Date & Time
//       ];

//       // Append data to Google Sheets
//       await sheets.spreadsheets.values.append({
//         spreadsheetId: process.env.GOOGLE_SHEET_ID,
//         range: 'Enrollments!A:M', // Updated range to include coupon fields
//         valueInputOption: 'USER_ENTERED',
//         requestBody: {
//           values: [enrollmentData],
//         },
//       });

//       console.log('Enrollment data saved to Google Sheets successfully');

//     } catch (sheetsError) {
//       console.error('Error saving to Google Sheets:', sheetsError);
//       // Don't fail the payment verification if Google Sheets fails
//       console.warn('Payment verified but failed to save to Google Sheets');
//     }

//     // Send confirmation email using Resend
//     try {
//       const discountText = couponCode && discountAmount > 0 
//         ? `
//           <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #22c55e;">
//             <h4 style="color: #16a34a; margin-top: 0;">Coupon Applied! 🎉</h4>
//             <p style="margin: 5px 0; color: #15803d;"><strong>Coupon Code:</strong> ${couponCode}</p>
//             <p style="margin: 5px 0; color: #15803d;"><strong>You Saved:</strong> ₹${discountAmount}</p>
//           </div>
//         `
//         : '';

//       const emailHtml = `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Innoknowvex!</h1>
//           </div>
          
//           <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
//             <h2 style="color: #333; margin-top: 0;">Thank you for your purchase, ${name}! 🎉</h2>
            
//             <p style="color: #666; font-size: 16px; line-height: 1.6;">
//               We are excited to have you on board. Your enrollment has been confirmed successfully!
//             </p>
            
//             ${discountText}
            
//             <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
//               <h3 style="color: #333; margin-top: 0;">Purchase Details:</h3>
//               <p style="margin: 5px 0;"><strong>Course:</strong> ${course}</p>
//               <p style="margin: 5px 0;"><strong>Plan:</strong> ${plan}</p>
//               ${originalAmount && originalAmount !== amount ? `<p style="margin: 5px 0;"><strong>Original Price:</strong> ₹${originalAmount}</p>` : ''}
//               ${discountAmount > 0 ? `<p style="margin: 5px 0; color: #22c55e;"><strong>Discount:</strong> -₹${discountAmount}</p>` : ''}
//               <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${amount}</p>
//               <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
//               <p style="margin: 5px 0;"><strong>Order ID:</strong> ${razorpay_order_id}</p>
//             </div>
            
//             <p style="color: #666; font-size: 16px; line-height: 1.6;">
//               Our team at <strong>Innoknowvex</strong> will be contacting you shortly with the next steps and course access details.
//             </p>
            
//             <p style="color: #666; font-size: 16px; line-height: 1.6;">
//               Congratulations on taking the first step toward your learning journey! 🚀
//             </p>
            
//             <div style="text-align: center; margin-top: 30px;">
//               <p style="color: #999; font-size: 14px;">
//                 If you have any questions, feel free to reach out to our support team.
//               </p>
//               <p style="color: #999; font-size: 14px;">
//                 <strong>Innoknowvex Team</strong>
//               </p>
//             </div>
//           </div>
//         </div>
//       `;

//       await resend.emails.send({
//         from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
//         to: email,
//         subject: `Welcome to ${course} - ${plan} | Innoknowvex`,
//         html: emailHtml,
//       });

//       console.log('Confirmation email sent successfully to:', email);

//     } catch (emailError) {
//       console.error('Error sending confirmation email:', emailError);
//       // Don't fail the payment verification if email fails
//       console.warn('Payment verified but failed to send confirmation email');
//     }

//     console.log('Payment verified successfully for:', email);

//     return NextResponse.json({
//       success: true,
//       message: 'Payment verified and enrollment recorded',
//       paymentId: razorpay_payment_id,
//       orderId: razorpay_order_id
//     });

//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     return NextResponse.json(
//       {
//         message: 'Failed to verify payment',
//         error: error.message,
//         success: false
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function OPTIONS() {
//   return new Response(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   });
// }

// src/app/api/verify-payment/route.js
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Resend } from 'resend';

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
      amount,
      originalAmount,
      discountAmount,
      couponCode
    } = body;

    console.log('Verify payment request:', {
      razorpay_order_id,
      razorpay_payment_id,
      studentData: studentData ? { ...studentData, phone: studentData.phone ? 'XXX-XXX-XXXX' : undefined } : null,
      course,
      plan,
      amount,
      originalAmount,
      discountAmount,
      couponCode
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

    if (!process.env.RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY');
      return NextResponse.json(
        { message: 'Email service configuration error', success: false },
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
        originalAmount ? `₹${originalAmount}` : `₹${amount}`, // Original Amount
        couponCode || 'N/A',            // Coupon Code
        discountAmount ? `₹${discountAmount}` : '₹0', // Discount Amount
        `₹${amount}`,                   // Final Amount Paid
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
        range: 'Enrollments!A:M', // Updated range to include coupon fields
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [enrollmentData],
        },
      });

      console.log('Enrollment data saved to Google Sheets successfully');

    } catch (sheetsError) {
      console.error('Error saving to Google Sheets:', sheetsError);
      // Don't fail the payment verification if Google Sheets fails
      console.warn('Payment verified but failed to save to Google Sheets');
    }

    // Send confirmation email using Resend
    try {
      // Initialize Resend inside the function where env vars are available
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const discountText = couponCode && discountAmount > 0 
        ? `
          <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #22c55e;">
            <h4 style="color: #16a34a; margin-top: 0;">Coupon Applied! 🎉</h4>
            <p style="margin: 5px 0; color: #15803d;"><strong>Coupon Code:</strong> ${couponCode}</p>
            <p style="margin: 5px 0; color: #15803d;"><strong>You Saved:</strong> ₹${discountAmount}</p>
          </div>
        `
        : '';

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Innoknowvex!</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">Thank you for your purchase, ${name}! 🎉</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We are excited to have you on board. Your enrollment has been confirmed successfully!
            </p>
            
            ${discountText}
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">Purchase Details:</h3>
              <p style="margin: 5px 0;"><strong>Course:</strong> ${course}</p>
              <p style="margin: 5px 0;"><strong>Plan:</strong> ${plan}</p>
              ${originalAmount && originalAmount !== amount ? `<p style="margin: 5px 0;"><strong>Original Price:</strong> ₹${originalAmount}</p>` : ''}
              ${discountAmount > 0 ? `<p style="margin: 5px 0; color: #22c55e;"><strong>Discount:</strong> -₹${discountAmount}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${amount}</p>
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

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: `Welcome to ${course} - ${plan} | Innoknowvex`,
        html: emailHtml,
      });

      console.log('Confirmation email sent successfully to:', email);

    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the payment verification if email fails
      console.warn('Payment verified but failed to send confirmation email');
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