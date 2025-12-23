import { NextResponse } from "next/server"
import Razorpay from "razorpay"

// Fetch course price from database/API
async function getCoursePriceFromDB(courseId, plan) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pricing/${courseId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const priceData = await response.json();

            // Map plan to correct price field
            switch (plan.toLowerCase()) {
                case 'self':
                    return {
                        currentPrice: priceData.self_current_price || priceData.current_price || 0,
                        actualPrice: priceData.self_actual_price || priceData.actual_price || 0
                    };
                case 'mentor':
                    return {
                        currentPrice: priceData.mentor_current_price || priceData.current_price || 0,
                        actualPrice: priceData.mentor_actual_price || priceData.actual_price || 0
                    };
                case 'professional':
                    return {
                        currentPrice: priceData.professional_current_price || priceData.current_price || 0,
                        actualPrice: priceData.professional_actual_price || priceData.actual_price || 0
                    };
                default:
                    return {
                        currentPrice: priceData.current_price || 0,
                        actualPrice: priceData.actual_price || 0
                    };
            }
        }
        return null;
    } catch (error) {
        console.error(`Error fetching price for ${courseId}:`, error);
        return null;
    }
}

// Calculate total price for courses - ONLY SOURCE OF TRUTH
async function calculateTotalPrice(courses, cartType, couponCode) {
    let total = 0;
    let individualPrices = [];

    console.log("💰 Calculating prices for courses:", courses);

    // 1. Fetch real prices for each course from database
    for (const course of courses) {
        try {
            const prices = await getCoursePriceFromDB(course.courseId, course.plan);

            if (!prices || !prices.currentPrice || prices.currentPrice <= 0) {
                throw new Error(`Price missing for course ${course.courseId}`);
            }

            individualPrices.push({
                courseId: course.courseId,
                courseName: course.courseName,
                plan: course.plan,
                currentPrice: prices.currentPrice,
                originalPrice: prices.actualPrice || prices.currentPrice
            });

            total += prices.currentPrice;

        } catch (error) {
            console.error(`❌ Error processing price for ${course.courseId}:`, error);
            throw new Error("Could not fetch prices for some courses. Please try again.");
        }
    }

    console.log("✅ Total before discounts:", total);
    console.log("✅ Individual prices:", individualPrices);

    let packageDiscount = 0;
    let originalTotalBeforeDiscounts = individualPrices.reduce((sum, item) => sum + item.originalPrice, 0);

    // 2. Apply Tech Starter Pack discount if applicable
    if (cartType === "tech-starter-pack" && courses.length === 4) {
        const mentorPlansCount = courses.filter(c => c.plan.toLowerCase() === "mentor").length;
        console.log(`📊 Mentor plans count: ${mentorPlansCount}`);

        if (mentorPlansCount >= 2) {
            const packFixedPrice = 25000;
            if (total > packFixedPrice) {
                packageDiscount = total - packFixedPrice;
                total = packFixedPrice;
                console.log(`🎉 Applied Tech Starter Pack discount: ₹${packageDiscount}, New total: ₹${total}`);
            } else {
                console.log("ℹ️ Total is already less than or equal to pack price, no discount applied");
            }
        } else {
            console.log("ℹ️ Not enough mentor plans for Tech Starter Pack discount");
        }
    }

    // 3. Apply coupon discount if valid
    let couponDiscount = 0;
    if (couponCode) {
        try {
            const couponResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    couponCode,
                    amount: total,
                    cartType: cartType,
                    courseIds: courses.map(c => c.courseId)
                })
            });

            if (couponResponse.ok) {
                const couponData = await couponResponse.json();
                if (couponData.valid) {
                    couponDiscount = couponData.discountAmount || 0;
                    total -= couponDiscount;
                    console.log(`🏷️ Applied coupon discount: ₹${couponDiscount}, New total: ₹${total}`);
                } else {
                    console.log("⚠️ Coupon validation failed:", couponData.message);
                }
            }
        } catch (error) {
            console.error("❌ Error validating coupon:", error);
        }
    }

    // Ensure total is not negative
    total = Math.max(0, total);

    console.log("✅ Final calculated amount:", {
        finalAmount: total,
        originalTotal: originalTotalBeforeDiscounts,
        packageDiscount,
        couponDiscount,
        individualPrices
    });

    return {
        finalAmount: total,
        individualPrices,
        packageDiscount,
        couponDiscount,
        originalTotal: originalTotalBeforeDiscounts
    };
}

export async function POST(request) {
    try {
        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })

        const body = await request.json()
        const {
            id,
            studentData,
            cartType,
            selectedCourses,
            couponCode
        } = body

        console.log("=== ORDER CREATION REQUEST ===");
        console.log("Request data:", {
            id,
            cartType,
            selectedCoursesCount: selectedCourses?.length,
            couponCode
        });

        // Validate required fields
        if (!id) {
            return NextResponse.json(
                { message: "Order ID is required" },
                { status: 400 }
            )
        }

        if (!studentData || !studentData.name || !studentData.email || !studentData.phone) {
            return NextResponse.json(
                { message: "Student details are required" },
                { status: 400 }
            )
        }

        if (!selectedCourses || !Array.isArray(selectedCourses) || selectedCourses.length === 0) {
            return NextResponse.json(
                { message: "Course selection is required" },
                { status: 400 }
            )
        }

        // Validate each course has required fields
        for (const course of selectedCourses) {
            if (!course.courseId || !course.plan) {
                return NextResponse.json(
                    { message: "Each course must have courseId and plan" },
                    { status: 400 }
                )
            }
        }

        // Calculate AUTHORITATIVE price from backend database
        console.log("💰 Starting price calculation from database...");
        const priceCalculation = await calculateTotalPrice(selectedCourses, cartType, couponCode);

        // Prepare course information for notes
        const courseInfo = {
            cart_type: cartType || "unknown",
            total_courses: selectedCourses.length,
            courses: selectedCourses.map((c, idx) => ({
                index: idx + 1,
                course_name: c.courseName || `Course ${idx + 1}`,
                course_id: c.courseId,
                plan: c.plan
            }))
        };

        // Create Razorpay order options
        const options = {
            amount: Math.round(priceCalculation.finalAmount * 100), // Convert to paise
            currency: "INR",
            receipt: id,
            notes: {
                student_name: studentData.name,
                student_email: studentData.email,
                student_phone: studentData.phone,
                cart_type: cartType || "unknown",
                total_courses: selectedCourses.length.toString(),
                course_info: JSON.stringify(courseInfo),
                original_total: priceCalculation.originalTotal.toString(),
                final_amount: priceCalculation.finalAmount.toString(),
                package_discount: priceCalculation.packageDiscount.toString(),
                coupon_discount: priceCalculation.couponDiscount.toString(),
                coupon_code: couponCode || "none",
                is_custom_pack: (cartType === "custom-pack") ? "true" : "false",
                is_tech_starter_pack: (cartType === "tech-starter-pack") ? "true" : "false",
                price_calculated_at: new Date().toISOString()
            }
        }

        console.log("📝 Razorpay order options:", {
            amount: options.amount,
            currency: options.currency,
            notes_summary: {
                final_amount: options.notes.final_amount,
                total_courses: options.notes.total_courses
            }
        });

        // Create Razorpay order
        const order = await razorpay.orders.create(options);

        if (!order || !order.id) {
            console.error("❌ Order creation failed - no order ID returned");
            return NextResponse.json(
                { message: "Order creation failed" },
                { status: 500 }
            )
        }

        console.log("✅ Order created successfully:", {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });

        // Return order with price breakdown
        return NextResponse.json({
            ...order,
            metadata: {
                finalAmount: priceCalculation.finalAmount,
                originalTotal: priceCalculation.originalTotal,
                packageDiscount: priceCalculation.packageDiscount,
                couponDiscount: priceCalculation.couponDiscount,
                individualPrices: priceCalculation.individualPrices,
                couponCode: couponCode || null,
                cartType: cartType || "unknown",
                courses: selectedCourses,
                priceCalculationTime: new Date().toISOString()
            }
        }, { status: 200 });

    } catch (error) {
        console.error("❌ Order creation error:", error);

        // Provide specific error messages
        let errorMessage = "Something went wrong while creating order";
        let statusCode = 500;

        if (error.message.includes("Could not fetch prices")) {
            errorMessage = "Unable to fetch course prices. Please try again or contact support.";
            statusCode = 503; // Service Unavailable
        } else if (error.message.includes("Razorpay")) {
            errorMessage = "Payment gateway error. Please try again.";
        }

        return NextResponse.json(
            {
                message: errorMessage,
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: statusCode }
        )
    }
}