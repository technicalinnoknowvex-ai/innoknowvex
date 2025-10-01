// import crypto from "crypto"
// import { NextResponse } from "next/server"

// export async function POST(request) {
//     const body = await request.json()
//     const { order_id, payment_id, signature } = body

//     const secretKey = process.env.RAZORPAY_KEY_SECRET

//     const hmac = crypto.createHmac("sha256", secretKey)
//     hmac.update(order_id + "|" + payment_id)

//     const generatedSignature = hmac.digest("hex")

//     if (generatedSignature === signature) {
//         return NextResponse.json({ success: true, message: "payemnt verified" }, { status: 200 })
//     }
//     else {
//         return NextResponse.json({ success: false, message: "payemnt failed" }, { status: 400 })
//     }
// }


import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      order_id,
      payment_id,
      signature,
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
      metadata
    } = body;

    console.log("Payment verification request:", {
      order_id,
      payment_id,
      hasStudentData: !!studentData,
      course,
      plan,
      amount,
      courseId
    });

    // Validate required fields
    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required payment fields (order_id, payment_id, signature)"
        },
        { status: 400 }
      );
    }

    // Validate student data (required fields per schema)
    if (!studentData || !studentData.name || !studentData.email || !studentData.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required student information (name, email, phone)"
        },
        { status: 400 }
      );
    }

    // Validate course and plan (required fields per schema)
    if (!course || !courseId || !plan) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required course information (course, courseId, plan)"
        },
        { status: 400 }
      );
    }

    // Validate amounts (required fields per schema)
    if (amount === undefined || amount === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required amount field"
        },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("Missing RAZORPAY_KEY_SECRET");
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error"
        },
        { status: 500 }
      );
    }

    // Verify Razorpay signature
    const secretKey = process.env.RAZORPAY_KEY_SECRET;
    const hmac = crypto.createHmac("sha256", secretKey);
    hmac.update(order_id + "|" + payment_id);
    const generatedSignature = hmac.digest("hex");

    console.log("Signature verification:", {
      match: generatedSignature === signature
    });

    if (generatedSignature !== signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed - Invalid signature"
        },
        { status: 400 }
      );
    }

    // Payment verified successfully - now store in database
    try {
      // Validate Supabase configuration
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("Missing Supabase credentials");
        throw new Error("Database configuration error");
      }

      // Initialize Supabase client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      // Check if payment already exists (using unique constraints)
      const { data: existingPayment, error: checkError } = await supabase
        .from("payments")
        .select("id")
        .or(`razorpay_order_id.eq.${order_id},razorpay_payment_id.eq.${payment_id}`)
        .maybeSingle();

      if (existingPayment) {
        console.log("Payment already exists in database");
        return NextResponse.json(
          {
            success: true,
            message: "Payment already verified and saved",
            paymentId: payment_id,
            orderId: order_id,
            duplicate: true
          },
          { status: 200 }
        );
      }

      // Extract student data
      const { name, email, phone } = studentData;

      // Calculate final amount and discount
      const finalAmount = amount;
      const originalAmountValue = originalAmount || amount;
      const discountAmountValue = discountAmount || (originalAmountValue - finalAmount);
      const discountPercentageValue = discountPercentage || 
        (originalAmountValue > 0 ? ((discountAmountValue / originalAmountValue) * 100) : 0);

      // Prepare payment data matching schema (all required fields)
      const paymentData = {
        student_name: name,
        student_email: email,
        student_phone: phone,
        course_name: course,
        course_id: courseId,
        plan: plan,
        razorpay_order_id: order_id,
        razorpay_payment_id: payment_id,
        razorpay_signature: signature,
        original_amount: parseFloat(originalAmountValue),
        final_amount: parseFloat(finalAmount),
        discount_amount: parseFloat(discountAmountValue),
        discount_percentage: parseFloat(discountPercentageValue.toFixed(2)),
        payment_status: "completed",
        verification_status: "verified"
      };

      // Add optional fields if provided
      if (couponCode) {
        paymentData.coupon_code = couponCode;
      }

      if (couponDetails) {
        paymentData.coupon_details = couponDetails;
      }

      // Add metadata (can include additional info)
      if (metadata) {
        paymentData.metadata = metadata;
      } else {
        paymentData.metadata = {
          verified_at: new Date().toISOString(),
          user_agent: request.headers.get('user-agent') || 'unknown'
        };
      }

      console.log("Saving payment data to database...");

      // Insert into database
      const { data, error } = await supabase
        .from("payments")
        .insert([paymentData])
        .select();

      if (error) {
        console.error("Database error:", error);
        
        // Check if it's a duplicate key error
        if (error.code === '23505') {
          return NextResponse.json(
            {
              success: true,
              message: "Payment already verified and saved",
              paymentId: payment_id,
              orderId: order_id,
              duplicate: true
            },
            { status: 200 }
          );
        }
        
        throw error;
      }

      console.log("Payment data saved successfully:", data);

      // If coupon was used, update coupon usage count
      if (couponCode) {
        try {
          const { data: couponData, error: couponFetchError } = await supabase
            .from("coupons")
            .select("times_used")
            .eq("code", couponCode.toUpperCase())
            .single();

          if (!couponFetchError && couponData) {
            const { error: updateError } = await supabase
              .from("coupons")
              .update({ times_used: (couponData.times_used || 0) + 1 })
              .eq("code", couponCode.toUpperCase());

            if (!updateError) {
              console.log("Coupon usage updated for:", couponCode);
            }
          }
        } catch (couponError) {
          console.error("Error updating coupon usage:", couponError);
          // Don't fail the payment if coupon update fails
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: "Payment verified and saved successfully",
          paymentId: payment_id,
          orderId: order_id,
          data: data[0]
        },
        { status: 200 }
      );

    } catch (dbError) {
      console.error("Database error:", dbError);
      
      // Payment verified but database save failed
      return NextResponse.json(
        {
          success: true,
          message: "Payment verified but failed to save to database",
          warning: "Please contact support with your payment ID",
          paymentId: payment_id,
          orderId: order_id,
          dbError: process.env.NODE_ENV === "development" ? dbError.message : undefined
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error in payment verification:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}