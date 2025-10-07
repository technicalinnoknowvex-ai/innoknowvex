import crypto from "crypto"
import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
    try {
        const body = await request.json()
        
        // Extract all payment and student details
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
            courseId,
            couponCode,
            couponDetails,
            discountPercentage,
            // NEW: Support for multiple courses
            courses, // Array of course objects: [{ courseId, courseName, plan }]
            isCustomPack // Boolean flag to indicate custom pack
        } = body

        console.log("Received verification request:", {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            studentData,
            course,
            plan,
            amount,
            originalAmount,
            discountAmount,
            couponCode,
            discountPercentage,
            courses,
            isCustomPack
        })

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, message: "Missing payment details" },
                { status: 400 }
            )
        }

        if (!studentData || !studentData.name || !studentData.email || !studentData.phone) {
            return NextResponse.json(
                { success: false, message: "Missing student details" },
                { status: 400 }
            )
        }

        // Step 1: Verify payment signature
        const secretKey = process.env.RAZORPAY_KEY_SECRET
        const hmac = crypto.createHmac("sha256", secretKey)
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id)
        const generatedSignature = hmac.digest("hex")

        if (generatedSignature !== razorpay_signature) {
            console.error("Signature verification failed")
            return NextResponse.json(
                { success: false, message: "Payment verification failed - Invalid signature" },
                { status: 400 }
            )
        }

        console.log("Payment signature verified successfully")

        // Calculate discount details
        const finalAmount = amount || 0
        const originalPrice = originalAmount || finalAmount
        const discountApplied = discountAmount || (originalPrice - finalAmount)
        const discountPercent = discountPercentage || 
            (originalPrice > 0 ? ((discountApplied / originalPrice) * 100).toFixed(2) : 0)

        // Prepare coupon details object
        const couponDetailsObj = couponCode ? {
            code: couponCode,
            discount_type: couponDetails?.discount_type || 'percentage',
            discount_value: couponDetails?.discount_value || discountPercent,
            applied_at: new Date().toISOString(),
            ...couponDetails
        } : null

        // Generate a unique transaction ID for grouping multiple courses
        const transactionId = `TXN_${razorpay_order_id}_${Date.now()}`

        // Step 2: Prepare payment data
        let paymentRecords = []

        if (isCustomPack && courses && Array.isArray(courses) && courses.length > 0) {
            // CUSTOM PACK: Create separate records for each course
            const perCourseAmount = finalAmount / courses.length
            const perCourseOriginalAmount = originalPrice / courses.length
            const perCourseDiscount = discountApplied / courses.length

            paymentRecords = courses.map((courseItem, index) => ({
                student_name: studentData.name.trim(),
                student_email: studentData.email.toLowerCase().trim(),
                student_phone: studentData.phone.trim(),
                course_name: courseItem.courseName || courseItem.course_name || `Course ${index + 1}`,
                course_id: courseItem.courseId || courseItem.course_id || `course-${index + 1}`,
                plan: courseItem.plan || plan || "Custom Pack Plan",
                razorpay_order_id: `${razorpay_order_id}_${index + 1}`, // Unique order ID per course
                razorpay_payment_id: razorpay_payment_id,
                razorpay_signature: razorpay_signature,
                original_amount: parseFloat(perCourseOriginalAmount.toFixed(2)),
                final_amount: parseFloat(perCourseAmount.toFixed(2)),
                discount_amount: parseFloat(perCourseDiscount.toFixed(2)),
                discount_percentage: parseFloat(discountPercent),
                coupon_code: couponCode || null,
                coupon_details: couponDetailsObj,
                payment_status: 'completed',
                verification_status: 'verified',
                metadata: {
                    verified_at: new Date().toISOString(),
                    user_agent: request.headers.get('user-agent') || 'unknown',
                    payment_method: 'razorpay',
                    currency: 'INR',
                    transaction_id: transactionId,
                    pack_type: 'custom',
                    total_courses: courses.length,
                    course_index: index + 1,
                    original_order_id: razorpay_order_id,
                    course_details: {
                        course_name: courseItem.courseName || courseItem.course_name,
                        course_id: courseItem.courseId || courseItem.course_id,
                        plan_type: courseItem.plan || plan
                    },
                    total_transaction_amount: finalAmount,
                    discount_info: couponCode ? {
                        coupon_used: couponCode,
                        total_original_price: originalPrice,
                        total_discount_applied: discountApplied,
                        discount_percentage: discountPercent,
                        total_final_price: finalAmount,
                        per_course_amount: perCourseAmount
                    } : null
                }
            }))
        } else {
            // SINGLE COURSE OR PACK: Create one record
            paymentRecords = [{
                student_name: studentData.name.trim(),
                student_email: studentData.email.toLowerCase().trim(),
                student_phone: studentData.phone.trim(),
                course_name: course || "Tech Starter Pack",
                course_id: courseId || "tech-starter-pack",
                plan: plan || "Mentor Plan",
                razorpay_order_id: razorpay_order_id,
                razorpay_payment_id: razorpay_payment_id,
                razorpay_signature: razorpay_signature,
                original_amount: parseFloat(originalPrice),
                final_amount: parseFloat(finalAmount),
                discount_amount: parseFloat(discountApplied),
                discount_percentage: parseFloat(discountPercent),
                coupon_code: couponCode || null,
                coupon_details: couponDetailsObj,
                payment_status: 'completed',
                verification_status: 'verified',
                metadata: {
                    verified_at: new Date().toISOString(),
                    user_agent: request.headers.get('user-agent') || 'unknown',
                    payment_method: 'razorpay',
                    currency: 'INR',
                    transaction_id: transactionId,
                    pack_type: 'single',
                    course_details: {
                        course_name: course,
                        course_id: courseId,
                        plan_type: plan
                    },
                    discount_info: couponCode ? {
                        coupon_used: couponCode,
                        original_price: originalPrice,
                        discount_applied: discountApplied,
                        discount_percentage: discountPercent,
                        final_price: finalAmount
                    } : null
                }
            }]
        }

        console.log("Inserting payment records:", paymentRecords)

        // Step 3: Save to database (all records in one transaction)
        const { data, error } = await supabase
            .from('payments')
            .insert(paymentRecords)
            .select()

        if (error) {
            console.error("Database error:", error)
            
            // Check if it's a duplicate entry error
            if (error.code === '23505') { // Unique constraint violation
                console.log("Payment already exists in database")
                return NextResponse.json(
                    { 
                        success: true, 
                        message: "Payment already recorded",
                        orderId: razorpay_order_id,
                        paymentId: razorpay_payment_id,
                        alreadyExists: true
                    },
                    { status: 200 }
                )
            }
            
            return NextResponse.json(
                { success: false, message: "Failed to save payment data: " + error.message },
                { status: 500 }
            )
        }

        console.log("Payment saved successfully:", data)

        // Step 4: Prepare success response with detailed information
        const responseData = {
            success: true,
            message: "Payment verified and saved successfully",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            transactionId: transactionId,
            totalRecords: paymentRecords.length,
            paymentDetails: {
                studentName: studentData.name,
                studentEmail: studentData.email,
                course: isCustomPack ? `Custom Pack (${courses?.length || 0} courses)` : course,
                plan: plan,
                originalAmount: originalPrice,
                discountAmount: discountApplied,
                discountPercentage: discountPercent,
                finalAmount: finalAmount,
                couponCode: couponCode || null,
                paymentStatus: 'completed',
                isCustomPack: isCustomPack || false,
                courses: isCustomPack ? courses : null
            },
            data: data
        }

        console.log("Sending success response:", responseData)

        return NextResponse.json(responseData, { status: 200 })

    } catch (error) {
        console.error("Verification error:", error)
        return NextResponse.json(
            { 
                success: false, 
                message: "Payment verification failed: " + error.message 
            },
            { status: 500 }
        )
    }
}