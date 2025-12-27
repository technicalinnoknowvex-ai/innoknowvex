"use client"
import React, { useEffect, useRef, useState } from 'react'
import style from "./style/cart.module.scss"
import gsap from 'gsap'
import { toast } from 'react-toastify'
import Image from 'next/image'

const CartPage = () => {
    const star = useRef()
    const [storedItems, setStoredItems] = useState([]);
    const [originalTotal, setOriginalTotal] = useState(0)
    const [total, setTotal] = useState(0)
    const [coupon, setCoupon] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [discount, setDiscount] = useState(0)
    const [discountPercentage, setDiscountPercentage] = useState(0)
    const [couponDetails, setCouponDetails] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Tech Starter Pack states
    const [isTechStarterPack, setIsTechStarterPack] = useState(false);
    const [techPackageInfo, setTechPackageInfo] = useState(null);
    const [techPackBasePrice, setTechPackBasePrice] = useState(25000);
    const [techPackDiscountedPrice, setTechPackDiscountedPrice] = useState(25000);

    // Form fields
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [razorpayKeyId, setRazorpayKeyId] = useState(null)

    // CRITICAL: Price validation and fetching state
    const [pricesLoading, setPricesLoading] = useState(false);
    const [priceValidationError, setPriceValidationError] = useState(null);

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const isValidPhone = (phone) => {
        return /^[0-9]{10}$/.test(phone)
    }

    // ✅ NEW: Fetch price for items without prices (Choose Your Own Pack)
    const fetchPriceForItem = async (priceSearchTag, plan) => {
        try {
            const response = await fetch(`/api/pricingPowerPack/${priceSearchTag}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch price for ${priceSearchTag}`);
            }

            const priceData = await response.json();

            // Map plan to correct price field
            switch (plan.toLowerCase()) {
                case 'self':
                    return priceData.self_current_price || 0;
                case 'mentor':
                    return priceData.mentor_current_price || 0;
                case 'professional':
                    return priceData.professional_current_price || 0;
                default:
                    return priceData.mentor_current_price || 0; // Default to mentor
            }
        } catch (error) {
            console.error(`❌ Error fetching price for ${priceSearchTag}:`, error);
            return null;
        }
    };

    // ✅ NEW: Fetch prices for all items that don't have prices
    const fetchMissingPrices = async (items) => {
        console.log("🔍 Checking for items without prices...");
        
        const itemsNeedingPrices = items.filter(item => !item.price || item.price <= 0);
        
        if (itemsNeedingPrices.length === 0) {
            console.log("✅ All items have prices");
            return items;
        }

        console.log(`📥 Fetching prices for ${itemsNeedingPrices.length} items...`);
        setPricesLoading(true);

        const updatedItems = await Promise.all(
            items.map(async (item) => {
                // If item already has valid price, return as-is
                if (item.price && item.price > 0) {
                    return item;
                }

                // If item has priceSearchTag, fetch price
                if (item.priceSearchTag && item.plan) {
                    console.log(`📡 Fetching price for ${item.course} (${item.plan})...`);
                    const fetchedPrice = await fetchPriceForItem(item.priceSearchTag, item.plan);
                    
                    if (fetchedPrice && fetchedPrice > 0) {
                        console.log(`✅ Fetched price for ${item.course}: ₹${fetchedPrice}`);
                        return {
                            ...item,
                            price: fetchedPrice,
                            actualPrice: fetchedPrice,
                            priceFetched: true // Flag to know it was fetched
                        };
                    } else {
                        console.error(`❌ Failed to fetch valid price for ${item.course}`);
                        return {
                            ...item,
                            price: 0,
                            priceError: true
                        };
                    }
                }

                // Item has no price and no way to fetch it
                console.error(`❌ Item ${item.course} has no price and no priceSearchTag`);
                return {
                    ...item,
                    price: 0,
                    priceError: true
                };
            })
        );

        setPricesLoading(false);

        // Update sessionStorage with fetched prices
        sessionStorage.setItem("cartItems", JSON.stringify(updatedItems));

        return updatedItems;
    };

    // CRITICAL FIX: Validate ALL prices are real (no fallbacks, no zeros, no undefined)
    const validatePrices = () => {
        if (storedItems.length === 0) return { valid: true, issues: [] };

        const issues = [];
        
        storedItems.forEach((item, index) => {
            const price = item.actualPrice || item.price || 0;
            const courseName = item.course || item.name || `Course ${index + 1}`;

            // Check for invalid prices (0, undefined, null)
            if (!price || price <= 0) {
                issues.push(`${courseName}: Missing or invalid price (${price})`);
            }

            // Check for suspicious fallback prices (10,000, 5,000, etc.)
            if (price === 10000 || price === 5000) {
                console.warn(`⚠️ Suspicious price detected for ${courseName}: ₹${price} (possible fallback)`);
            }
        });

        return {
            valid: issues.length === 0,
            issues: issues
        };
    };

    const hasInvalidPrice = (() => {
        const validation = validatePrices();
        if (!validation.valid) {
            console.error("❌ Price validation failed:", validation.issues);
        }
        return !validation.valid;
    })();

    const isFormValid = () => {
        return (
            name.trim().length > 0 &&
            isValidEmail(email) &&
            isValidPhone(phone) &&
            !hasInvalidPrice &&
            !pricesLoading
        )
    }

    const generateOrderId = () => {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 9)
        return `techpack_${timestamp}_${random}`
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

    const getAllCourseDetails = () => {
        if (storedItems.length === 1 && storedItems[0].isCustomPack) {
            return storedItems[0].courses || [];
        } else if (storedItems.length > 1) {
            return storedItems.map(item => ({
                courseId: item.program_id || item.courseId || item.id,
                courseName: item.course || item.name,
                plan: item.plan,
                price: item.price,
                priceSearchTag: item.priceSearchTag || item.price_search_tag
            }));
        } else {
            return storedItems.length > 0 ? [{
                courseId: storedItems[0].program_id || storedItems[0].courseId || storedItems[0].id,
                courseName: storedItems[0].course || storedItems[0].name,
                plan: storedItems[0].plan,
                price: storedItems[0].price,
                priceSearchTag: storedItems[0].priceSearchTag || storedItems[0].price_search_tag
            }] : [];
        }
    }

    const makePayment = async (name, email, phone) => {
        if (!isFormValid()) {
            if (hasInvalidPrice) {
                alert("Some course prices are still loading or invalid. Please wait or refresh the page.");
            } else {
                alert("Please fill all fields correctly");
            }
            return;
        }

        const priceValidation = validatePrices();
        if (!priceValidation.valid) {
            console.error("❌ Cannot proceed with payment - invalid prices:", priceValidation.issues);
            alert(`Cannot process payment: ${priceValidation.issues.join(', ')}`);
            return;
        }

        setIsProcessing(true)

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
            plan: course.plan
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

        const couponData = getCouponDataForPopup();
        const couponCode = couponData?.couponCode || null;

        const orderId = generateOrderId();

        try {
            const orderCreationData = {
                id: orderId,
                studentData: { name, email, phone },
                selectedCourses: selectedCourses,
                cartType: cartType,
                couponCode: couponCode,
                course: displayCourseName,
                plan: displayPlan,
                courseId: displayCourseId
            };

            console.log("✅ Creating order with validated course data:", {
                cartType,
                coursesCount: selectedCourses.length,
                couponCode
            });

            const response = await fetch("/api/pro-packs/ordercreation", {
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
            if (!data) {
                throw new Error("Invalid order response")
            }

            console.log("✅ Order created with backend-calculated price:", {
                orderId: data.id,
                amount: data.amount,
                metadata: data.metadata
            });

            // Use ONLY backend-calculated price (NEVER fallback to frontend)
            const backendCalculatedPrice = data.metadata.finalAmount;
            const backendOriginalTotal = data.metadata.originalTotal;
            const backendPackageDiscount = data.metadata.packageDiscount;
            const backendCouponDiscount = data.metadata.couponDiscount;

            const paymentObject = new window.Razorpay({
                key: razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency || 'INR',
                name: "Innoknowvex",
                description: couponCode
                    ? `${displayCourseName} - ${displayPlan} (${couponCode} applied)`
                    : `${displayCourseName} - ${displayPlan} Plan`,
                order_id: data.id,
                handler: async function (response) {
                    try {
                        console.log("✅ Razorpay payment successful:", response.razorpay_payment_id);

                        const verificationData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            studentData: {
                                name: name,
                                email: email,
                                phone: phone
                            },
                            course: displayCourseName,
                            plan: displayPlan,
                            amount: backendCalculatedPrice,
                            originalAmount: backendOriginalTotal,
                            discountAmount: backendPackageDiscount + backendCouponDiscount,
                            discountPercentage: backendOriginalTotal > 0
                                ? Math.round(((backendPackageDiscount + backendCouponDiscount) / backendOriginalTotal) * 100)
                                : 0,
                            couponCode: couponCode,
                            couponDetails: couponData,
                            courseId: displayCourseId,
                            courses: allCourses,
                            isCustomPack: isCustomPackPurchase,
                            isTechStarterPack: isTechStarterPack,
                            backendMetadata: data.metadata
                        };

                        const verifyResponse = await fetch("/api/pro-packs/verifypayment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(verificationData),
                        })

                        const verifyData = await verifyResponse.json();

                        if (!verifyResponse.ok) {
                            throw new Error(verifyData.message || `Payment verification failed: ${verifyResponse.status}`)
                        }

                        if (verifyData.success) {
                            const discountInfo = couponCode
                                ? `\n\nDiscount Applied:\n• Coupon Code: ${couponCode}\n• Original Amount: ₹${backendOriginalTotal.toLocaleString('en-IN')}\n• Discount: ₹${(backendPackageDiscount + backendCouponDiscount).toLocaleString('en-IN')}\n• Final Amount: ₹${backendCalculatedPrice.toLocaleString('en-IN')}`
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
• Amount Paid: ₹${backendCalculatedPrice.toLocaleString('en-IN')}

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
                    coupon_code: couponCode || 'none',
                    is_custom_pack: isCustomPackPurchase ? 'true' : 'false',
                    is_tech_starter_pack: isTechStarterPack ? 'true' : 'false'
                },
                theme: {
                    color: "#A38907"
                },
                modal: {
                    ondismiss: function () {
                        console.log("Payment popup closed by user")
                        setIsProcessing(false);
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
                    coursesCount: updatedItems.length,
                    originalPrice: updatedItems.reduce((sum, item) => sum + (item.actualPrice || item.price || 0), 0)
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
            setDiscount(0);
            setDiscountPercentage(0);
            if (isTechStarterPack) {
                setTechPackDiscountedPrice(techPackBasePrice);
            }
        }

        toast.success('Deleted !', {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: () => window.location.reload(),
        });
    }

    const handleEnrollClick = () => {
        if (total == 0) {
            toast.warning('Add something to checkout', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }

        if (hasInvalidPrice) {
            toast.error('Some course prices are invalid. Please refresh the page or contact support.', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            return;
        }

        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

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
            const actualCartTotal = storedItems.reduce((sum, item) => {
                const price = item.actualPrice || item.price || 0;
                if (price <= 0) {
                    console.error(`❌ Invalid price for ${item.course || item.name}: ${price}`);
                }
                return sum + price;
            }, 0);

            console.log("💰 Applying coupon - Cart total:", actualCartTotal);

            const priceForValidation = isTechStarterPack
                ? (actualCartTotal < techPackBasePrice ? actualCartTotal : techPackBasePrice)
                : actualCartTotal;

            const courseIdForValidation = isTechStarterPack ? "tech-starter-pack" : "pro-packs";

            const response = await fetch("/api/pro-packs/coupon_validation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    couponCode: coupon.trim(),
                    price: priceForValidation,
                    courseId: courseIdForValidation,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.message || "Failed to apply coupon";
                toast.error(message, { position: "top-right", autoClose: 3000, theme: "colored" });
                return;
            }

            const data = await response.json();

            if (data.success) {
                const discountAmount = priceForValidation - data.finalPrice;
                const discountPercent = ((discountAmount / priceForValidation) * 100).toFixed(2);

                if (isTechStarterPack) {
                    setTechPackDiscountedPrice(data.finalPrice);
                    setTotal(data.finalPrice);
                } else {
                    setTotal(data.finalPrice);
                }

                setDiscount(discountAmount);
                setDiscountPercentage(parseFloat(discountPercent));
                setAppliedCoupon(coupon.trim());

                setCouponDetails({
                    discount_type: data.discount_type || 'percentage',
                    discount_value: data.discount_value || discountPercent,
                    coupon_name: coupon.trim(),
                    valid_from: data.valid_from || null,
                    valid_until: data.valid_until || null,
                    min_purchase: data.min_purchase || null,
                    max_discount: data.max_discount || null,
                    ...data
                });

                setCoupon("");
                toast.success(`Coupon applied! You saved ₹${discountAmount.toLocaleString('en-IN')}`, {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "colored",
                });
            } else {
                const message = data.message || "Invalid coupon";
                setCoupon("")
                toast.error(message, { position: "top-right", autoClose: 3000, theme: "colored" });
            }
        } catch (err) {
            console.error("❌ Error applying coupon:", err);
            toast.error("Something went wrong. Please try again later.", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
        }
    };

    const removeCoupon = () => {
        const actualCartTotal = storedItems.reduce((sum, item) => {
            const price = item.actualPrice || item.price || 0;
            return sum + price;
        }, 0);

        console.log("💰 Removing coupon - Restoring to cart total:", actualCartTotal);

        if (isTechStarterPack) {
            const priceToSet = actualCartTotal < techPackBasePrice ? actualCartTotal : techPackBasePrice;
            setTechPackDiscountedPrice(priceToSet);
            setTotal(priceToSet);
        } else {
            setTotal(actualCartTotal);
        }

        setDiscount(0);
        setDiscountPercentage(0);
        setAppliedCoupon(null);
        setCouponDetails(null);

        toast.info('Coupon removed successfully!', {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
        });
    };

    // ✅ NEW: Load cart and fetch missing prices
    useEffect(() => {
        const loadCartAndFetchPrices = async () => {
            const cart = sessionStorage.getItem("cartItems");
            const techPackCart = sessionStorage.getItem("techStarterCart");
            const techPackInfo = sessionStorage.getItem("techStarterPackageInfo");

            console.log("🔄 Loading cart from sessionStorage...");

            let initialItems = [];

            if (techPackInfo) {
                const packageData = JSON.parse(techPackInfo);
                setIsTechStarterPack(true);
                setTechPackageInfo(packageData);
                setTechPackBasePrice(packageData.fixedPrice || 25000);
                setTechPackDiscountedPrice(packageData.fixedPrice || 25000);

                if (packageData.items && packageData.items.length > 0) {
                    initialItems = packageData.items;
                } else if (techPackCart) {
                    const techCartItems = JSON.parse(techPackCart);
                    if (techCartItems.length > 0) {
                        initialItems = techCartItems;
                        const updatedPackageInfo = {
                            ...packageData,
                            items: techCartItems,
                            coursesCount: techCartItems.length,
                            originalPrice: techCartItems.reduce((sum, item) => sum + (item.actualPrice || item.price || 0), 0)
                        };
                        sessionStorage.setItem('techStarterPackageInfo', JSON.stringify(updatedPackageInfo));
                        setTechPackageInfo(updatedPackageInfo);
                    }
                }
            } else if (techPackCart) {
                const techCartItems = JSON.parse(techPackCart);
                if (techCartItems.length > 0) {
                    setIsTechStarterPack(true);
                    initialItems = techCartItems;

                    const packageInfo = {
                        items: techCartItems,
                        fixedPrice: 25000,
                        originalPrice: techCartItems.reduce((sum, item) => sum + (item.actualPrice || item.price || 0), 0),
                        coursesCount: techCartItems.length,
                        isTechStarterPack: true,
                        packId: 'tech-starter-pack',
                        packName: 'Tech Starter Pack'
                    };
                    sessionStorage.setItem('techStarterPackageInfo', JSON.stringify(packageInfo));
                    setTechPackageInfo(packageInfo);
                    setTechPackBasePrice(25000);
                    setTechPackDiscountedPrice(25000);
                }
            } else if (cart) {
                initialItems = JSON.parse(cart);
                setIsTechStarterPack(false);
                setTechPackageInfo(null);
                console.log("✅ Loaded regular cart items");
            }

            // ✅ NEW: Fetch missing prices for items without them
            if (initialItems.length > 0) {
                const itemsWithPrices = await fetchMissingPrices(initialItems);
                setStoredItems(itemsWithPrices);
                console.log("✅ Cart loaded with prices:", itemsWithPrices);
            }
        };

        loadCartAndFetchPrices();

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

    // CRITICAL FIX: Calculate totals using ONLY real prices (NO fallbacks)
    useEffect(() => {
        console.log("💰 Recalculating totals...");

        if (isTechStarterPack && techPackageInfo) {
            const realOriginalPrice = storedItems.reduce((acc, item) => {
                const price = item.actualPrice || item.price || 0;
                if (price <= 0) {
                    console.warn(`⚠️ Invalid price for ${item.course || item.name}: ${price}`);
                }
                return acc + price;
            }, 0);

            console.log(`💰 Tech Starter Pack - Real original price: ₹${realOriginalPrice}`);

            const isPackageComplete = storedItems.length === 4;
            const shouldApplyPackageDiscount = isPackageComplete && realOriginalPrice >= techPackBasePrice;

            if (shouldApplyPackageDiscount) {
                const packPrice = appliedCoupon ? techPackDiscountedPrice : techPackBasePrice;
                setOriginalTotal(realOriginalPrice);
                setTotal(packPrice);
                console.log(`✅ Applied package discount: ₹${realOriginalPrice} → ₹${packPrice}`);
            } else {
                setOriginalTotal(realOriginalPrice);
                if (appliedCoupon) {
                    setTotal(techPackDiscountedPrice);
                } else {
                    setTotal(realOriginalPrice);
                }
                console.log(`✅ Using cart total: ₹${realOriginalPrice}`);
            }
        } else {
            const realAmount = storedItems.reduce((acc, item) => {
                const price = item.actualPrice || item.price || 0;
                if (price <= 0) {
                    console.warn(`⚠️ Invalid price for ${item.course || item.name}: ${price}`);
                }
                return acc + price;
            }, 0);

            console.log(`💰 Regular cart - Real amount: ₹${realAmount}`);

            setOriginalTotal(realAmount);

            if (!appliedCoupon) {
                setTotal(realAmount);
            }
        }
    }, [storedItems, appliedCoupon, isTechStarterPack, techPackageInfo, techPackDiscountedPrice, techPackBasePrice]);

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

    const getCouponDataForPopup = () => {
        if (!appliedCoupon) return null;

        const actualCartTotal = storedItems.reduce((sum, item) => {
            const price = item.actualPrice || item.price || 0;
            return sum + price;
        }, 0);

        const basePrice = isTechStarterPack
            ? (actualCartTotal < techPackBasePrice ? actualCartTotal : techPackBasePrice)
            : actualCartTotal;

        return {
            couponCode: appliedCoupon,
            originalPrice: basePrice,
            discountAmount: discount,
            discountPercentage: discountPercentage,
            discount_type: couponDetails?.discount_type || 'percentage',
            discount_value: couponDetails?.discount_value || discountPercentage,
            coupon_name: appliedCoupon,
            valid_from: couponDetails?.valid_from || null,
            valid_until: couponDetails?.valid_until || null,
            min_purchase: couponDetails?.min_purchase || null,
            max_discount: couponDetails?.max_discount || null
        };
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

    const couponData = getCouponDataForPopup();

    const isPackageComplete = isTechStarterPack && techPackageInfo && storedItems.length === 4;
    const shouldShowPackageDiscount = isPackageComplete && originalTotal >= techPackBasePrice;

    const techPackSavings = shouldShowPackageDiscount
        ? originalTotal - (appliedCoupon ? techPackDiscountedPrice : techPackBasePrice)
        : 0;

    const techPackDiscountPercent = shouldShowPackageDiscount && originalTotal > 0
        ? Math.round((techPackSavings / originalTotal) * 100)
        : 0;

    const techPackCouponSavings = isTechStarterPack && appliedCoupon
        ? (shouldShowPackageDiscount ? techPackBasePrice : originalTotal) - techPackDiscountedPrice
        : 0;

    const techPackCouponPercent = isTechStarterPack && appliedCoupon
        ? Math.round((techPackCouponSavings / (shouldShowPackageDiscount ? techPackBasePrice : originalTotal)) * 100)
        : 0;

    const getCheckoutButtonText = () => {
        if (hasInvalidPrice) return "Loading prices...";
        if (pricesLoading) return "Fetching prices...";
        if (isProcessing) return "Processing Payment...";
        if (!razorpayKeyId) return "Loading Payment Gateway...";
        return `Pay ₹${total?.toLocaleString('en-IN')}`;
    };

    const isCheckoutDisabled = !isFormValid() || isProcessing || !razorpayKeyId || hasInvalidPrice || pricesLoading;

    return (
        <>
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

                        {hasInvalidPrice && (
                            <div className={style.priceErrorAlert}>
                                <strong>⚠️ Price Validation Error</strong>
                                <p>
                                    Some course prices are invalid or still loading. Please refresh the page or contact support.
                                </p>
                            </div>
                        )}

                        {pricesLoading && (
                            <div className={style.priceLoadingAlert}>
                                <strong>⏳ Fetching Prices...</strong>
                                <p>
                                    Please wait while we fetch the latest prices for your selected courses.
                                </p>
                            </div>
                        )}

                        <div className={style.courseInfo}>
                            {shouldShowPackageDiscount && (
                                <>
                                    <div className={style.discountInfo}>
                                        <p className={style.discountTitle}>
                                            🎉 Tech Starter Pack - Special Price!
                                        </p>
                                        <p className={style.originalPriceStrike}>
                                            Individual Value: ₹{originalTotal?.toLocaleString('en-IN')}
                                        </p>
                                        <p className={style.savingsText}>
                                            Package Savings: ₹{techPackSavings?.toLocaleString('en-IN')} ({techPackDiscountPercent}% OFF)
                                        </p>
                                    </div>

                                    {appliedCoupon && (
                                        <div className={style.discountInfo}>
                                            <p className={style.couponTitle}>
                                                🏷️ {appliedCoupon} Applied - Additional {techPackCouponPercent}% OFF!
                                            </p>
                                            <p className={style.originalPriceStrike}>
                                                Pack Price: ₹{techPackBasePrice?.toLocaleString('en-IN')}
                                            </p>
                                            <p className={style.couponText}>
                                                Coupon Discount: -₹{techPackCouponSavings?.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {!shouldShowPackageDiscount && isTechStarterPack && appliedCoupon && (
                                <div className={style.discountInfo}>
                                    <p className={style.couponTitle}>
                                        🏷️ {appliedCoupon} Applied - {techPackCouponPercent}% OFF!
                                    </p>
                                    <p className={style.originalPriceStrike}>
                                        Original: ₹{originalTotal?.toLocaleString('en-IN')}
                                    </p>
                                    <p className={style.couponText}>
                                        Discount: -₹{techPackCouponSavings?.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            )}

                            {couponData && couponData.couponCode && !isTechStarterPack && (
                                <div className={style.discountInfo}>
                                    <p className={style.discountTitle}>
                                        🎉 {couponData.couponCode} Applied - {couponData.discountPercentage}% OFF!
                                    </p>
                                    <p className={style.originalPriceStrike}>
                                        Original: ₹{couponData.originalPrice?.toLocaleString('en-IN')}
                                    </p>
                                    <p className={style.savingsText}>
                                        Discount: -₹{couponData.discountAmount?.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            )}
                            <p>
                                <strong>Total Amount:</strong> ₹{total?.toLocaleString('en-IN')}
                            </p>
                            {storedItems.length > 0 && (
                                <div className={style.courseDetails}>
                                    <p><strong>Course:</strong> {isTechStarterPack ? `Tech Starter Pack (${storedItems.length} courses)` : isCustomPack() ? `Custom Pack (${getAllCourseDetails().length} courses)` : storedItems[0]?.isPack ? storedItems[0].name : storedItems[0]?.course}</p>
                                    <p><strong>Plan:</strong> {storedItems[0]?.plan}</p>
                                    {(isTechStarterPack || isCustomPack()) && renderCourseList()}
                                </div>
                            )}
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
                                className={`${style.checkoutBtn} ${isCheckoutDisabled ? style.disabled : ''}`}
                                disabled={isCheckoutDisabled}
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

            {pricesLoading && (
                <div className={style.priceLoadingContainer}>
                    <div className={style.loadingSpinner}></div>
                    <h3>Fetching Latest Prices...</h3>
                    <p>Please wait while we load the current prices for your selected courses.</p>
                </div>
            )}

            <div className={style.shoppingCartContainer}>
                <div className={style.cartContent}>
                    <div className={style.cartItems}>
                        <div className={style.cartItemsList}>
                            {storedItems.length > 0 ? (
                                <>
                                    {storedItems.map((item, index) => {
                                        const itemPrice = item.actualPrice || item.price || 0;
                                        const isPriceInvalid = itemPrice <= 0;

                                        return (
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
                                                    {isPriceInvalid ? (
                                                        <div className={`${style.itemPrice} ${style.priceLoading}`}>
                                                            Loading...
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className={style.itemPrice}>
                                                                ₹{itemPrice.toLocaleString('en-IN')}
                                                            </div>
                                                            {item.originalPrice && item.originalPrice > itemPrice && (
                                                                <div className={style.originalPrice}>
                                                                    ₹{(item.originalPrice || 0).toLocaleString('en-IN')}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
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
                                        );
                                    })}
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
                            <span>Subtotal</span>
                            <span className={style.amount}>₹{originalTotal.toLocaleString('en-IN')}</span>
                        </div>

                        {shouldShowPackageDiscount && (
                            <>
                                <div className={`${style.summaryLine} ${style.discountLine}`}>
                                    <span>Tech Starter Pack Discount ({techPackDiscountPercent}%)</span>
                                    <span className={style.discountAmount}>-₹{techPackSavings.toLocaleString('en-IN')}</span>
                                </div>

                                <div className={style.summaryLine}>
                                    <span>Pack Base Price</span>
                                    <span className={style.amount}>₹{techPackBasePrice.toLocaleString('en-IN')}</span>
                                </div>
                            </>
                        )}

                        {appliedCoupon && (
                            <div className={`${style.summaryLine} ${style.discountLine}`}>
                                <span>Coupon Discount ({discountPercentage}%)</span>
                                <span className={style.discountAmount}>-₹{discount.toLocaleString('en-IN')}</span>
                            </div>
                        )}

                        <div className={`${style.summaryLine} ${style.summaryLineTotal}`}>
                            <span>Total</span>
                            <span className={style.amount} id="total">₹{total.toLocaleString('en-IN')}</span>
                        </div>

                        <div className={style.line2}></div>

                        {isTechStarterPack && techPackageInfo && (
                            <div className={`${style.appliedCouponBox} ${shouldShowPackageDiscount ? style.techPackActive : style.techPackIncomplete}`}>
                                <div className={style.couponInfo}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L2 7l10 5l10-5l-10-5zM2 17l10 5l10-5M2 12l10 5l10-5" />
                                    </svg>
                                    <div>
                                        <div className={style.couponLabel}>
                                            {shouldShowPackageDiscount ? 'Tech Starter Pack - Active' : `Tech Starter Pack - ${storedItems.length}/4 Courses`}
                                        </div>
                                        <div className={style.couponCode}>
                                            {shouldShowPackageDiscount
                                                ? `${storedItems.length} Courses • Pack Price: ₹${techPackBasePrice.toLocaleString('en-IN')}`
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
                                        <div className={style.couponCode}>{appliedCoupon} - {discountPercentage}% OFF</div>
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
                                    />
                                </div>
                                <div>
                                    <button onClick={applyCoupon} className={style.couponBtn}>Apply</button>
                                </div>
                            </div>
                        )}

                        <button 
                            className={`${style.checkoutBtn} ${(hasInvalidPrice || pricesLoading) ? style.disabled : ''}`}
                            onClick={() => handleEnrollClick()}
                            disabled={hasInvalidPrice || pricesLoading}
                        >
                            {hasInvalidPrice ? 'Loading prices...' : pricesLoading ? 'Fetching prices...' : 'Go to Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartPage