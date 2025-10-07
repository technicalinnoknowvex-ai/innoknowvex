// import { NextResponse } from "next/server"
// import Razorpay from "razorpay"

// export async function POST(request) {
//     try {
//         // Initialize Razorpay
//         const razorpay = new Razorpay({
//             key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//             key_secret: process.env.RAZORPAY_KEY_SECRET,
//         })

//         const body = await request.json()
//         const { 
//             price, 
//             id, 
//             course, 
//             plan, 
//             studentData, 
//             courseId,
//             originalAmount,
//             discountAmount,
//             discountPercentage,
//             couponCode,
//             couponDetails
//         } = body

//         console.log("Creating order with full data:", { 
//             price, 
//             id, 
//             course, 
//             plan, 
//             studentData, 
//             courseId,
//             originalAmount,
//             discountAmount,
//             discountPercentage,
//             couponCode,
//             couponDetails
//         })

//         // Validate required fields
//         if (!price || !id) {
//             return NextResponse.json(
//                 { message: "Price and ID are required" },
//                 { status: 400 }
//             )
//         }

//         if (!studentData || !studentData.name || !studentData.email || !studentData.phone) {
//             return NextResponse.json(
//                 { message: "Student details are required" },
//                 { status: 400 }
//             )
//         }

//         // Calculate final amounts - ensuring proper values
//         const finalAmount = parseFloat(price)
//         const originalPrice = originalAmount ? parseFloat(originalAmount) : finalAmount
//         const discountApplied = discountAmount ? parseFloat(discountAmount) : 0
//         const discountPercent = discountPercentage ? parseFloat(discountPercentage) : 0

//         console.log("Calculated amounts:", {
//             finalAmount,
//             originalPrice,
//             discountApplied,
//             discountPercent
//         })

//         // Create order options with comprehensive notes
//         const options = {
//             amount: Math.round(finalAmount * 100), // Convert to paise and ensure integer
//             currency: "INR",
//             receipt: id,
//             notes: {
//                 student_name: studentData.name,
//                 student_email: studentData.email,
//                 student_phone: studentData.phone,
//                 course_name: course || "Tech Starter Pack",
//                 course_id: courseId || "tech-starter-pack",
//                 plan: plan || "Mentor Plan",
//                 original_amount: originalPrice.toString(),
//                 final_amount: finalAmount.toString(),
//                 discount_amount: discountApplied.toString(),
//                 discount_percentage: discountPercent.toString(),
//                 coupon_code: couponCode || "none",
//                 has_discount: discountApplied > 0 ? "true" : "false"
//             }
//         }

//         console.log("Razorpay order options:", options)

//         // Create order
//         const order = await razorpay.orders.create(options)

//         if (!order || !order.id) {
//             console.error("Order creation failed - no order ID returned")
//             return NextResponse.json(
//                 { message: "Order creation failed" },
//                 { status: 500 }
//             )
//         }

//         console.log("Order created successfully:", order)

//         // Return order with additional metadata for payment verification
//         return NextResponse.json({
//             ...order,
//             metadata: {
//                 originalAmount: originalPrice,
//                 discountAmount: discountApplied,
//                 discountPercentage: discountPercent,
//                 couponCode: couponCode || null,
//                 couponDetails: couponDetails || null
//             }
//         }, { status: 200 })

//     } catch (error) {
//         console.error("Order creation error:", error)
//         return NextResponse.json(
//             { 
//                 message: "Something went wrong while creating order", 
//                 error: error.message 
//             },
//             { status: 500 }
//         )
//     }
// }







import { NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(request) {
    try {
        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })

        const body = await request.json()
        const { 
            price, 
            id, 
            course, 
            plan, 
            studentData, 
            courseId,
            originalAmount,
            discountAmount,
            discountPercentage,
            couponCode,
            couponDetails,
            // NEW: Support for multiple courses
            courses, // Array of course objects
            isCustomPack // Boolean flag
        } = body

        console.log("Creating order with full data:", { 
            price, 
            id, 
            course, 
            plan, 
            studentData, 
            courseId,
            originalAmount,
            discountAmount,
            discountPercentage,
            couponCode,
            couponDetails,
            courses,
            isCustomPack
        })

        // Validate required fields
        if (!price || !id) {
            return NextResponse.json(
                { message: "Price and ID are required" },
                { status: 400 }
            )
        }

        if (!studentData || !studentData.name || !studentData.email || !studentData.phone) {
            return NextResponse.json(
                { message: "Student details are required" },
                { status: 400 }
            )
        }

        // Calculate final amounts - ensuring proper values
        const finalAmount = parseFloat(price)
        const originalPrice = originalAmount ? parseFloat(originalAmount) : finalAmount
        const discountApplied = discountAmount ? parseFloat(discountAmount) : 0
        const discountPercent = discountPercentage ? parseFloat(discountPercentage) : 0

        console.log("Calculated amounts:", {
            finalAmount,
            originalPrice,
            discountApplied,
            discountPercent
        })

        // Prepare course information for notes
        let courseInfo = {
            course_name: course || "Tech Starter Pack",
            course_id: courseId || "tech-starter-pack",
            plan: plan || "Mentor Plan"
        }

        // Handle multiple courses for custom pack
        if (isCustomPack && courses && Array.isArray(courses) && courses.length > 0) {
            courseInfo = {
                pack_type: "custom",
                total_courses: courses.length,
                courses: courses.map((c, idx) => ({
                    index: idx + 1,
                    course_name: c.courseName || c.course_name,
                    course_id: c.courseId || c.course_id,
                    plan: c.plan || plan
                }))
            }
        }

        // Create order options with comprehensive notes
        const options = {
            amount: Math.round(finalAmount * 100), // Convert to paise and ensure integer
            currency: "INR",
            receipt: id,
            notes: {
                student_name: studentData.name,
                student_email: studentData.email,
                student_phone: studentData.phone,
                is_custom_pack: isCustomPack ? "true" : "false",
                course_info: JSON.stringify(courseInfo),
                original_amount: originalPrice.toString(),
                final_amount: finalAmount.toString(),
                discount_amount: discountApplied.toString(),
                discount_percentage: discountPercent.toString(),
                coupon_code: couponCode || "none",
                has_discount: discountApplied > 0 ? "true" : "false"
            }
        }

        console.log("Razorpay order options:", options)

        // Create order
        const order = await razorpay.orders.create(options)

        if (!order || !order.id) {
            console.error("Order creation failed - no order ID returned")
            return NextResponse.json(
                { message: "Order creation failed" },
                { status: 500 }
            )
        }

        console.log("Order created successfully:", order)

        // Return order with additional metadata for payment verification
        return NextResponse.json({
            ...order,
            metadata: {
                originalAmount: originalPrice,
                discountAmount: discountApplied,
                discountPercentage: discountPercent,
                couponCode: couponCode || null,
                couponDetails: couponDetails || null,
                isCustomPack: isCustomPack || false,
                courses: courses || null
            }
        }, { status: 200 })

    } catch (error) {
        console.error("Order creation error:", error)
        return NextResponse.json(
            { 
                message: "Something went wrong while creating order", 
                error: error.message 
            },
            { status: 500 }
        )
    }
}