"use client"
import React, { useEffect, useRef, useState } from 'react'
import style from "./style/cart.module.scss"
import gsap from 'gsap'
import { toast } from 'react-toastify'
import Image from 'next/image'

const CartPage = () => {
    const star = useRef()
    const [storedItems, setStoredItems] = useState([]);
    
    // Display-only pricing (fetched from backend during order creation)
    const [displayPrices, setDisplayPrices] = useState({
        originalTotal: 0,
        packageDiscount: 0,
        couponDiscount: 0,
        finalAmount: 0
    });
    
    const [coupon, setCoupon] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [couponDetails, setCouponDetails] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // Tech Starter Pack states
    const [isTechStarterPack, setIsTechStarterPack] = useState(false);
    const [techPackageInfo, setTechPackageInfo] = useState(null);
    
    // Form fields
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [razorpayKeyId, setRazorpayKeyId] = useState(null)
    
    // Loading states
    const [pricesLoading, setPricesLoading] = useState(false);
    const [orderCreationLoading, setOrderCreationLoading] = useState(false);

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const isValidPhone = (phone) => {
        return /^[0-9]{10}$/.test(phone)
    }

    const isFormValid = () => {
        return (
            name.trim().length > 0 &&
            isValidEmail(email) &&
            isValidPhone(phone) &&
            !pricesLoading &&
            storedItems.length > 0
        )
    }

    const generateOrderId = () => {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 9)
        return `propack_${timestamp}_${random}`
    }

    useEffect(() => {
        const fetchRazorpayConfig = async () => {
            try {
                const response = await fetch('/api/config');
                if (response.ok) {
                    const config = await response.json();
                    setRazorpayKeyId(config.razorpayKeyId);
                }
            } catch (error) {
                console.error('Failed to fetch Razorpay config:', error);
            }
        };

        fetchRazorpayConfig();
    }, []);

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = src
            script.onload = () => resolve(true)
            script.onerror = () => reject(new Error(`Failed to load ${src}`))
            document.body.appendChild(script)
        })
    }

    const isCustomPack = () => {
        return storedItems.length > 1 || (storedItems.length === 1 && storedItems[0].isCustomPack);
    }

    // Get course details WITHOUT prices
    const getAllCourseDetails = () => {
        if (storedItems.length === 1 && storedItems[0].isCustomPack) {
            return storedItems[0].courses || [];
        } else if (storedItems.length > 1) {
            return storedItems.map(item => ({
                courseId: item.program_id || item.courseId || item.id,
                courseName: item.course || item.name,
                plan: item.plan,
                priceSearchTag: item.priceSearchTag || item.price_search_tag
            }));
        } else {
            return storedItems.length > 0 ? [{
                courseId: storedItems[0].program_id || storedItems[0].courseId || storedItems[0].id,
                courseName: storedItems[0].course || storedItems[0].name,
                plan: storedItems[0].plan,
                priceSearchTag: storedItems[0].priceSearchTag || storedItems[0].price_search_tag
            }] : [];
        }
    }

    // ✅ SECURE: Payment with backend price calculation
    const makePayment = async (name, email, phone) => {
        if (!isFormValid()) {
            alert("Please fill all fields correctly");
            return;
        }

        setIsProcessing(true);
        setOrderCreationLoading(true);

        const allCourses = getAllCourseDetails();
        const isCustomPackPurchase = isCustomPack();

        const cartType = isTechStarterPack
            ? "tech-starter-pack"
            : isCustomPackPurchase
                ? "custom-pack"
                : "single-course";

        // ✅ SECURE: Send ONLY course identifiers, NO PRICES
        const selectedCourses = allCourses.map(course => ({
            courseId: course.courseId,
            courseName: course.courseName,
            plan: course.plan,
            priceSearchTag: course.priceSearchTag
        }));

        const displayCourseName = isCustomPackPurchase
            ? `Custom Pack (${allCourses.length} courses)`
            : isTechStarterPack
                ? `Tech Starter Pack (${allCourses.length} courses)`
                : storedItems[0]?.isPack
                    ? storedItems[0].name
                    : storedItems[0]?.course || "Selected Course";

        const displayPlan = storedItems[0]?.plan || "Mentor Plan";
        const displayCourseId = isCustomPackPurchase
            ? "custom-pack"
            : isTechStarterPack
                ? "tech-starter-pack"
                : storedItems[0]?.program_id || "selected-course";

        const orderId = generateOrderId();

        try {
            // ✅ SECURE: Use new pro-packs endpoint
            const orderCreationData = {
                id: orderId,
                studentData: { name, email, phone },
                selectedCourses: selectedCourses,
                cartType: cartType,
                couponCode: appliedCoupon || null,
                course: displayCourseName,
                plan: displayPlan,
                courseId: displayCourseId
            };

            console.log("✅ Creating pro-pack order (NO PRICES from frontend):", {
                endpoint: '/api/pro-packs/order-creation',
                cartType,
                coursesCount: selectedCourses.length,
                couponCode: appliedCoupon || 'None'
            });

            const response = await fetch("/api/pro-packs/order-creation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderCreationData),
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Order creation failed:", response.status, errorData);
                throw new Error(errorData.message || `Order creation failed: ${response.status}`)
            }

            const data = await response.json()
            if (!data || !data.success) {
                throw new Error("Invalid order response")
            }

            console.log("✅ Order created with BACKEND-calculated prices:", {
                orderId: data.id,
                amount: data.amount,
                metadata: data.metadata
            });

            // ✅ SECURE: Use ONLY backend-calculated prices
            const backendPrices = data.metadata;
            const backendFinalAmount = backendPrices.finalAmount;
            const backendOriginalTotal = backendPrices.originalTotal;
            const backendPackageDiscount = backendPrices.packageDiscount || 0;
            const backendCouponDiscount = backendPrices.couponDiscount || 0;

            // Update display prices
            setDisplayPrices({
                originalTotal: backendOriginalTotal,
                packageDiscount: backendPackageDiscount,
                couponDiscount: backendCouponDiscount,
                finalAmount: backendFinalAmount
            });

            setOrderCreationLoading(false);

            const paymentObject = new window.Razorpay({
                key: razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency || 'INR',
                name: "Innoknowvex",
                description: appliedCoupon
                    ? `${displayCourseName} - ${displayPlan} (${appliedCoupon} applied)`
                    : `${displayCourseName} - ${displayPlan} Plan`,
                order_id: data.id,
                handler: async function (response) {
                    try {
                        console.log("✅ Razorpay payment successful:", response.razorpay_payment_id);

                        const verificationData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            studentData: { name, email, phone },
                            course: displayCourseName,
                            plan: displayPlan,
                            amount: backendFinalAmount,
                            originalAmount: backendOriginalTotal,
                            discountAmount: backendPackageDiscount + backendCouponDiscount,
                            discountPercentage: backendOriginalTotal > 0
                                ? Math.round(((backendPackageDiscount + backendCouponDiscount) / backendOriginalTotal) * 100)
                                : 0,
                            couponCode: appliedCoupon || null,
                            couponDetails: couponDetails,
                            courseId: displayCourseId,
                            courses: allCourses,
                            isCustomPack: isCustomPackPurchase,
                            isTechStarterPack: isTechStarterPack,
                            backendMetadata: data.metadata
                        };

                        // ✅ Use new pro-packs verify endpoint
                        const verifyResponse = await fetch("/api/pro-packs/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(verificationData),
                        })

                        const verifyData = await verifyResponse.json();

                        if (!verifyResponse.ok) {
                            throw new Error(verifyData.message || `Payment verification failed: ${verifyResponse.status}`)
                        }

                        if (verifyData.success) {
                            const discountInfo = appliedCoupon
                                ? `\n\nDiscount Applied:\n• Coupon Code: ${appliedCoupon}\n• Original Amount: ₹${backendOriginalTotal.toLocaleString('en-IN')}\n• Total Discount: ₹${(backendPackageDiscount + backendCouponDiscount).toLocaleString('en-IN')}\n• Final Amount: ₹${backendFinalAmount.toLocaleString('en-IN')}`
                                : backendPackageDiscount > 0
                                    ? `\n\nPackage Discount:\n• Original Amount: ₹${backendOriginalTotal.toLocaleString('en-IN')}\n• Package Discount: ₹${backendPackageDiscount.toLocaleString('en-IN')}\n• Final Amount: ₹${backendFinalAmount.toLocaleString('en-IN')}`
                                    : '';

                            const courseDetails = isCustomPackPurchase || isTechStarterPack
                                ? `\n\nCourses Enrolled (${allCourses.length}):\n${allCourses.map((course) => `• ${course.courseName} - ${course.plan}`).join('\n')}`
                                : '';

                            const successMessage = `Payment Successful! 
                        
Welcome to ${displayCourseName} - ${displayPlan} Plan!${courseDetails}

Your enrollment details have been recorded and you should receive a confirmation email shortly.${discountInfo}

Transaction Details:
• Payment ID: ${verifyData.paymentId}
• Order ID: ${verifyData.orderId}
• Total Courses: ${isCustomPackPurchase || isTechStarterPack ? allCourses.length : 1}
• Amount Paid: ₹${backendFinalAmount.toLocaleString('en-IN')}

Thank you for choosing Innoknowvex!`;

                            alert(successMessage);

                            sessionStorage.removeItem('cartItems');
                            sessionStorage.removeItem('techStarterCart');
                            sessionStorage.removeItem('techStarterPackageInfo');
                            closeForm();
                            window.location.reload();
                        } else {
                            alert("Payment verification failed: " + (verifyData.message || "Unknown error"))
                        }
                    } catch (err) {
                        console.error("❌ Verification error:", err)
                        alert("Something went wrong during verification: " + err.message)
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name,
                    email,
                    contact: phone,
                },
                notes: {
                    cart_type: cartType,
                    total_courses: allCourses.length.toString(),
                    coupon_code: appliedCoupon || 'none'
                },
                theme: {
                    color: "#A38907"
                },
                modal: {
                    ondismiss: function () {
                        console.log("Payment popup closed by user")
                        setIsProcessing(false);
                        setOrderCreationLoading(false);
                    },
                }
            })

            paymentObject.on('payment.failed', function (response) {
                console.error('❌ Payment failed:', response.error);
                alert(`Payment failed: ${response.error.description || 'Unknown error occurred'}`);
                setIsProcessing(false);
            });

            paymentObject.open()
        } catch (error) {
            console.error("❌ Payment error:", error)
            alert("Payment process failed. Please try again. Error: " + error.message)
            setIsProcessing(false);
            setOrderCreationLoading(false);
        }
    }

    useEffect(() => {
        loadScript("https://checkout.razorpay.com/v1/checkout.js").catch(err =>
            console.error("Failed to load Razorpay script:", err)
        )
    }, [])

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape" && !isProcessing) closeForm()
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [isProcessing])

    useEffect(() => {
        if (!isFormOpen) {
            setName("")
            setEmail("")
            setPhone("")
            setIsProcessing(false)
        }
    }, [isFormOpen])

    const handleDelete = (itemToBeDeleted) => {
        const updatedItems = storedItems.filter((item) => {
            if (itemToBeDeleted.isPack) {
                return item.id !== itemToBeDeleted.id;
            } else {
                return item.course !== itemToBeDeleted.course;
            }
        });

        setStoredItems(updatedItems)
        sessionStorage.setItem("cartItems", JSON.stringify(updatedItems))

        if (isTechStarterPack) {
            sessionStorage.setItem("techStarterCart", JSON.stringify(updatedItems))

            if (updatedItems.length > 0) {
                const updatedPackageInfo = {
                    ...techPackageInfo,
                    items: updatedItems,
                    coursesCount: updatedItems.length
                };
                sessionStorage.setItem('techStarterPackageInfo', JSON.stringify(updatedPackageInfo));
                setTechPackageInfo(updatedPackageInfo);
            } else {
                sessionStorage.removeItem('techStarterPackageInfo');
                setTechPackageInfo(null);
                setIsTechStarterPack(false);
            }
        }

        if (appliedCoupon) {
            setAppliedCoupon(null);
            setCouponDetails(null);
        }

        toast.success('Deleted !', {
            position: "top-right",
            autoClose: 500,
            theme: "colored",
            onClose: () => window.location.reload(),
        });
    }

    const handleEnrollClick = () => {
        if (storedItems.length === 0) {
            toast.warning('Add something to checkout', {
                position: "top-right",
                autoClose: 1000,
                theme: "colored",
            });
            return;
        }

        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    // ✅ SECURE: Validate coupon on backend with real prices
    const applyCoupon = async () => {
        if (appliedCoupon) {
            toast.warning("You already have a coupon applied. Remove it first to apply a new one.", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
            return;
        }

        if (!coupon || coupon.trim() === "") {
            toast.warning("Please enter a coupon code", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
            return;
        }

        try {
            setPricesLoading(true);

            const allCourses = getAllCourseDetails();
            const isCustomPackPurchase = isCustomPack();

            const cartType = isTechStarterPack
                ? "tech-starter-pack"
                : isCustomPackPurchase
                    ? "custom-pack"
                    : "single-course";

            const selectedCourses = allCourses.map(course => ({
                courseId: course.courseId,
                courseName: course.courseName,
                plan: course.plan,
                priceSearchTag: course.priceSearchTag
            }));

            const courseId = isCustomPackPurchase
                ? "custom-pack"
                : isTechStarterPack
                    ? "tech-starter-pack"
                    : storedItems[0]?.program_id || "selected-course";

            console.log("🎫 Validating coupon on backend:", {
                couponCode: coupon.trim().toUpperCase(),
                cartType,
                coursesCount: selectedCourses.length
            });

            // ✅ Call secure backend validation
            const response = await fetch("/api/pro-packs/coupon-validation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    couponCode: coupon.trim().toUpperCase(),
                    selectedCourses: selectedCourses,
                    cartType: cartType,
                    courseId: courseId
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message || "Invalid coupon code", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "colored",
                });
                setPricesLoading(false);
                return;
            }

            const data = await response.json();

            if (data.success) {
                // Update display prices with backend-calculated values
                setDisplayPrices({
                    originalTotal: data.originalTotal,
                    packageDiscount: data.packageDiscount || 0,
                    couponDiscount: data.couponDiscount,
                    finalAmount: data.finalPrice
                });

                setAppliedCoupon(coupon.trim().toUpperCase());
                setCouponDetails({
                    code: coupon.trim().toUpperCase(),
                    discountType: data.discountType,
                    discountValue: data.discount_value,
                    description: data.coupon.description
                });
                setCoupon("");

                const savingsAmount = data.couponDiscount;
                
                toast.success(`Coupon applied! You saved ₹${savingsAmount.toLocaleString('en-IN')} (${data.discountPercentage}% off)`, {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "colored",
                });
            } else {
                toast.error(data.message || "Invalid coupon code", {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "colored",
                });
            }

            setPricesLoading(false);

        } catch (error) {
            console.error("❌ Error validating coupon:", error);
            toast.error("Failed to validate coupon. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            setPricesLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponDetails(null);
        
        // Reset display prices
        setDisplayPrices({
            originalTotal: 0,
            packageDiscount: 0,
            couponDiscount: 0,
            finalAmount: 0
        });

        toast.info('Coupon removed successfully!', {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
        });
    };

    // Load cart from sessionStorage
    useEffect(() => {
        const cart = sessionStorage.getItem("cartItems");
        const techPackInfo = sessionStorage.getItem("techStarterPackageInfo");

        if (techPackInfo) {
            const packageData = JSON.parse(techPackInfo);
            setIsTechStarterPack(true);
            setTechPackageInfo(packageData);

            if (packageData.items) {
                setStoredItems(packageData.items);
            }
        } else if (cart) {
            setStoredItems(JSON.parse(cart));
            setIsTechStarterPack(false);
            setTechPackageInfo(null);
        }

        gsap.timeline()
            .fromTo(
                star.current,
                { opacity: 0, scale: 0 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
            )
            .to(
                star.current,
                { rotate: 720, duration: 1, ease: "power2.inOut" }
            )
            .to(
                star.current,
                { rotate: "+=720", duration: 1, ease: "power2.inOut", delay: 0.1 }
            );
    }, [])

    const renderItemName = (item) => {
        if (item.isPack) {
            return (
                <div className={style.itemName}>
                    {item.name}
                    <span className={style.packBadge}>Pack ({item.courseCount} courses)</span>
                </div>
            );
        } else if (item.isCustomPack) {
            return (
                <div className={style.itemName}>
                    Custom Pack
                    <span className={style.packBadge}>Your Selection ({item.courses?.length || 0} courses)</span>
                </div>
            );
        } else if (item.packId === 'tech-starter-pack') {
            return (
                <div className={style.itemName}>
                    {item.course}
                    <span className={style.packBadge}>Tech Starter Pack</span>
                </div>
            );
        } else {
            return <div className={style.itemName}>{item.course}</div>;
        }
    };

    const renderItemInfo = (item) => {
        if (item.isPack) {
            return <div className={style.itemInfo}>{item.plan} • {item.courseCount} courses</div>;
        } else if (item.isCustomPack) {
            return <div className={style.itemInfo}>{item.plan} • {item.courses?.length || 0} selected courses</div>;
        } else {
            return <div className={style.itemInfo}>{item.plan}</div>;
        }
    };

    const renderCourseList = () => {
        const allCourses = getAllCourseDetails();
        if (allCourses.length <= 1) return null;

        return (
            <div className={style.courseList}>
                <p><strong>Selected Courses ({allCourses.length}):</strong></p>
                <ul>
                    {allCourses.map((course, index) => (
                        <li key={index}>
                            {course.courseName} - {course.plan}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const getCheckoutButtonText = () => {
        if (orderCreationLoading) return "Creating Order...";
        if (isProcessing) return "Processing Payment...";
        if (!razorpayKeyId) return "Loading Payment Gateway...";
        return "Go to Checkout";
    };

    const isCheckoutDisabled = isProcessing || !razorpayKeyId || orderCreationLoading || storedItems.length === 0;

    return (
        <>
            {/* Payment Form Modal */}
            {isFormOpen && (
                <div className={style.formPage}>
                    <div className={style.overlay} onClick={isProcessing ? undefined : closeForm}></div>

                    <div className={style.formWrapper}>
                        <div className={style.formHeaderContainer}>
                            <h1>Checkout</h1>
                            <button className={style.closeButton} onClick={closeForm} disabled={isProcessing}>
                                ✕
                            </button>
                        </div>

                        {orderCreationLoading && (
                            <div className={style.priceLoadingAlert}>
                                <strong>⏳ Calculating Prices...</strong>
                                <p>
                                    Please wait while we fetch the latest prices and calculate your total.
                                </p>
                            </div>
                        )}

                        <div className={style.courseInfo}>
                            {displayPrices.finalAmount > 0 && (
                                <p>
                                    <strong>Estimated Total:</strong> ₹{displayPrices.finalAmount.toLocaleString('en-IN')}
                                </p>
                            )}
                            
                            {appliedCoupon && (
                                <p style={{ color: '#22c55e', fontSize: '0.9em' }}>
                                    🏷️ Coupon {appliedCoupon} will be applied
                                </p>
                            )}
                            
                            {storedItems.length > 0 && (
                                <div className={style.courseDetails}>
                                    <p><strong>Course:</strong> {isTechStarterPack ? `Tech Starter Pack (${storedItems.length} courses)` : isCustomPack() ? `Custom Pack (${getAllCourseDetails().length} courses)` : storedItems[0]?.isPack ? storedItems[0].name : storedItems[0]?.course}</p>
                                    <p><strong>Plan:</strong> {storedItems[0]?.plan}</p>
                                    {(isTechStarterPack || isCustomPack()) && renderCourseList()}
                                </div>
                            )}
                            
                            <p style={{ fontSize: '0.85em', color: '#6b7280', marginTop: '12px' }}>
                                🔒 Final price will be calculated securely on our server
                            </p>
                        </div>

                        <div className={style.inputGroup}>
                            <label className={style.formLabel}>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className={style.formInput}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isProcessing}
                            />
                        </div>

                        <div className={style.inputGroup}>
                            <label className={style.formLabel}>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={style.formInput}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isProcessing}
                            />
                            {email && !isValidEmail(email) && (
                                <span className={style.errorText}>Invalid email format</span>
                            )}
                        </div>

                        <div className={style.inputGroup}>
                            <label className={style.formLabel}>Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                className={style.formInput}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                maxLength={10}
                                required
                                disabled={isProcessing}
                            />
                            {phone && !isValidPhone(phone) && (
                                <span className={style.errorText}>Phone must be 10 digits</span>
                            )}
                        </div>

                        <div className={style.buttonGroup}>
                            <button
                                onClick={() => makePayment(name, email, phone)}
                                className={`${style.checkoutBtn} ${!isFormValid() || isCheckoutDisabled ? style.disabled : ''}`}
                                disabled={!isFormValid() || isCheckoutDisabled}
                            >
                                {getCheckoutButtonText()}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={style.head}>
                <svg ref={star} className={style.star} width="50" height="50" viewBox="0 0 136 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M66.0962 1.74792C66.3511 -0.582641 69.4658 -0.582641 69.7207 1.74792L71.8573 21.2992C74.6162 46.5452 92.9484 66.4498 116.2 69.4453L134.207 71.7651C136.354 72.0419 136.354 75.4237 134.207 75.7005L116.2 78.0203C92.9484 81.0159 74.6162 100.92 71.8573 126.166L69.7207 145.717C69.4658 148.048 66.3511 148.048 66.0962 145.717L63.9596 126.166C61.2007 100.92 42.8685 81.0159 19.6167 78.0203L1.60985 75.7005C-0.536616 75.4237 -0.536616 72.0419 1.60985 71.7651L19.6167 69.4453C42.8685 66.4498 61.2007 46.5452 63.9596 21.2992L66.0962 1.74792Z" fill="#9F8310" />
                </svg>

                <h1 className={style.heading}>Your Personalised <span>Cart</span></h1>
            </div>

            <div className={style.shoppingCartContainer}>
                <div className={style.cartContent}>
                    <div className={style.cartItems}>
                        <div className={style.cartItemsList}>
                            {storedItems.length > 0 ? (
                                <>
                                    {storedItems.map((item, index) => (
                                        <div key={item.id || index} className={style.item} data-item="n2o">
                                            <div>
                                                <Image
                                                    className={style.itemImage}
                                                    src={item.image}
                                                    height={100}
                                                    width={100}
                                                    alt={item.isPack ? item.name : item.course}
                                                />
                                            </div>

                                            <div className={style.itemDetails}>
                                                {renderItemName(item)}
                                                {renderItemInfo(item)}
                                            </div>

                                            <div className={style.itemControls}>
                                                <div className={style.itemPrice}>
                                                    Price at checkout
                                                </div>
                                            </div>

                                            <div>
                                                <svg
                                                    className={style.deleteItem}
                                                    onClick={() => handleDelete(item)}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className={style.emptyCart}>Nothing in cart yet</div>
                            )}
                        </div>
                    </div>

                    <div className={style.orderSummary}>
                        <h3 className={style.summaryTitle}>Order Summary</h3>
                        <div className={style.line1}></div>

                        <div className={style.summaryLine}>
                            <span>Items ({storedItems.length})</span>
                            <span className={style.amount}>
                                {displayPrices.originalTotal > 0 
                                    ? `₹${displayPrices.originalTotal.toLocaleString('en-IN')}`
                                    : 'At checkout'}
                            </span>
                        </div>

                        {displayPrices.packageDiscount > 0 && (
                            <div className={`${style.summaryLine} ${style.discountLine}`}>
                                <span>
                                    {isTechStarterPack ? 'Tech Starter Pack Discount' : 'Package Discount'}
                                </span>
                                <span className={style.discountAmount}>
                                    -₹{displayPrices.packageDiscount.toLocaleString('en-IN')}
                                </span>
                            </div>
                        )}

                        {!displayPrices.packageDiscount && isTechStarterPack && techPackageInfo && storedItems.length === 4 && (
                            <div className={`${style.summaryLine} ${style.discountLine}`}>
                                <span>Tech Starter Pack Discount</span>
                                <span className={style.discountAmount}>Applied at checkout</span>
                            </div>
                        )}

                        {displayPrices.couponDiscount > 0 && (
                            <div className={`${style.summaryLine} ${style.discountLine}`}>
                                <span>Coupon Discount ({appliedCoupon})</span>
                                <span className={style.discountAmount}>
                                    -₹{displayPrices.couponDiscount.toLocaleString('en-IN')}
                                </span>
                            </div>
                        )}

                        {appliedCoupon && !displayPrices.couponDiscount && (
                            <div className={`${style.summaryLine} ${style.discountLine}`}>
                                <span>Coupon Discount ({appliedCoupon})</span>
                                <span className={style.discountAmount}>Applied at checkout</span>
                            </div>
                        )}

                        <div className={`${style.summaryLine} ${style.summaryLineTotal}`}>
                            <span>Total</span>
                            <span className={style.amount}>
                                {displayPrices.finalAmount > 0
                                    ? `₹${displayPrices.finalAmount.toLocaleString('en-IN')}`
                                    : 'Calculated at checkout'}
                            </span>
                        </div>

                        <div className={style.line2}></div>

                        {isTechStarterPack && techPackageInfo && (
                            <div className={`${style.appliedCouponBox} ${storedItems.length === 4 ? style.techPackActive : style.techPackIncomplete}`}>
                                <div className={style.couponInfo}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5" />
                                    </svg>
                                    <div>
                                        <div className={style.couponLabel}>
                                            {storedItems.length === 4 ? 'Tech Starter Pack - Active' : `Tech Starter Pack - ${storedItems.length}/4 Courses`}
                                        </div>
                                        <div className={style.couponCode}>
                                            {storedItems.length === 4
                                                ? `${storedItems.length} Courses • ₹25,000 Fixed Price`
                                                : `Add ${4 - storedItems.length} more course(s) for pack discount`
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {appliedCoupon && (
                            <div className={style.appliedCouponBox}>
                                <div className={style.couponInfo}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                        <line x1="7" y1="7" x2="7.01" y2="7" />
                                    </svg>
                                    <div>
                                        <div className={style.couponLabel}>Applied Coupon</div>
                                        <div className={style.couponCode}>{appliedCoupon}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={removeCoupon}
                                    className={style.removeCouponBtn}
                                    title="Remove coupon"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {!appliedCoupon && (
                            <div className={style.couponSection}>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Coupon Code"
                                        id="couponInput"
                                        className={style.couponInput}
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                        onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                                        disabled={pricesLoading}
                                    />
                                </div>
                                <div>
                                    <button 
                                        onClick={applyCoupon} 
                                        className={style.couponBtn}
                                        disabled={pricesLoading}
                                    >
                                        {pricesLoading ? 'Validating...' : 'Apply'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            className={`${style.checkoutBtn} ${isCheckoutDisabled ? style.disabled : ''}`}
                            onClick={() => handleEnrollClick()}
                            disabled={isCheckoutDisabled}
                        >
                            {getCheckoutButtonText()}
                        </button>
                        
                        <p style={{ fontSize: '0.75em', color: '#6b7280', marginTop: '8px', textAlign: 'center' }}>
                            🔒 Final price calculated securely at checkout
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartPage