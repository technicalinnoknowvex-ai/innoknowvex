// "use client"
// import React, { useEffect, useRef, useState } from 'react'
// import style from "./style/cart.module.scss"
// import gsap from 'gsap'
// import { toast } from 'react-toastify'
// import Image from 'next/image'

// const CartPage = () => {
//     const star = useRef()
//     const [storedItems, setStoredItems] = useState([]);
//     const [originalTotal, setOriginalTotal] = useState(0)
//     const [total, setTotal] = useState(0)
//     const [coupon, setCoupon] = useState("")
//     const [appliedCoupon, setAppliedCoupon] = useState(null)
//     const [discount, setDiscount] = useState(0)
//     const [discountPercentage, setDiscountPercentage] = useState(0)
//     const [couponDetails, setCouponDetails] = useState(null)
//     const [isFormOpen, setIsFormOpen] = useState(false);
    
//     // Form fields
//     const [name, setName] = useState("")
//     const [email, setEmail] = useState("")
//     const [phone, setPhone] = useState("")
//     const [isProcessing, setIsProcessing] = useState(false)
//     const [razorpayKeyId, setRazorpayKeyId] = useState(null)

//     // Email validation regex
//     const isValidEmail = (email) => {
//         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
//     }

//     // Phone validation (10 digits)
//     const isValidPhone = (phone) => {
//         return /^[0-9]{10}$/.test(phone)
//     }

//     // Check if form is valid
//     const isFormValid = () => {
//         return (
//             name.trim().length > 0 &&
//             isValidEmail(email) &&
//             isValidPhone(phone)
//         )
//     }

//     // Generate unique ID for the order
//     const generateOrderId = () => {
//         const timestamp = Date.now()
//         const random = Math.random().toString(36).substring(2, 9)
//         return `techpack_${timestamp}_${random}`
//     }

//     // Fetch Razorpay key ID when component mounts
//     useEffect(() => {
//         const fetchRazorpayConfig = async () => {
//             try {
//                 const response = await fetch('/api/config');
//                 if (response.ok) {
//                     const config = await response.json();
//                     setRazorpayKeyId(config.razorpayKeyId);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch Razorpay config:', error);
//             }
//         };
        
//         fetchRazorpayConfig();
//     }, []);

//     const loadScript = (src) => {
//         return new Promise((resolve, reject) => {
//             const script = document.createElement("script")
//             script.src = src
//             script.onload = () => resolve(true)
//             script.onerror = () => reject(new Error(`Failed to load ${src}`))
//             document.body.appendChild(script)
//         })
//     }

//     // NEW: Check if cart contains a custom pack with multiple courses
//     const isCustomPack = () => {
//         return storedItems.length > 1 || (storedItems.length === 1 && storedItems[0].isCustomPack);
//     }

//     // NEW: Get all course details for custom pack
//     const getAllCourseDetails = () => {
//         if (storedItems.length === 1 && storedItems[0].isCustomPack) {
//             // Single custom pack item containing multiple courses
//             return storedItems[0].courses || [];
//         } else if (storedItems.length > 1) {
//             // Multiple individual courses selected
//             return storedItems.map(item => ({
//                 courseId: item.program_id || item.id,
//                 courseName: item.course || item.name,
//                 plan: item.plan,
//                 price: item.price
//             }));
//         } else {
//             // Single course or regular pack
//             return storedItems.length > 0 ? [{
//                 courseId: storedItems[0].program_id || storedItems[0].id,
//                 courseName: storedItems[0].course || storedItems[0].name,
//                 plan: storedItems[0].plan,
//                 price: storedItems[0].price
//             }] : [];
//         }
//     }

//     const makePayment = async (price, name, email, phone) => {
//         if (!isFormValid()) {
//             alert("Please fill all fields correctly")
//             return
//         }

//         setIsProcessing(true)

//         // Get course information - UPDATED for multiple courses
//         const allCourses = getAllCourseDetails();
//         const isCustomPackPurchase = isCustomPack();
        
//         // For display purposes, use the first course or pack name
//         const displayCourseName = isCustomPackPurchase 
//             ? `Custom Pack (${allCourses.length} courses)`
//             : storedItems[0]?.isPack 
//                 ? storedItems[0].name 
//                 : storedItems[0]?.course || "Tech Starter Pack";
                
//         const displayPlan = storedItems[0]?.plan || "Mentor Plan";
//         const displayCourseId = isCustomPackPurchase 
//             ? "custom-pack" 
//             : storedItems[0]?.program_id || "tech-starter-pack";

//         // Get coupon information properly
//         console.log("Coupon Data received in makePayment:", getCouponDataForPopup());
        
//         const couponData = getCouponDataForPopup();
//         const originalAmount = couponData?.originalPrice || price;
//         const discountAmount = couponData?.discountAmount || 0;
//         const discountPercentageValue = couponData?.discountPercentage || 0;
//         const couponCode = couponData?.couponCode || null;
        
//         // Build comprehensive coupon details object
//         const couponDetailsObj = couponData && couponCode ? {
//             discount_type: couponData.discount_type || 'percentage',
//             discount_value: couponData.discount_value || discountPercentageValue,
//             coupon_name: couponData.coupon_name || couponCode,
//             valid_from: couponData.valid_from || null,
//             valid_until: couponData.valid_until || null,
//             min_purchase: couponData.min_purchase || null,
//             max_discount: couponData.max_discount || null,
//             original_price: originalAmount,
//             discount_amount: discountAmount,
//             discount_percentage: discountPercentageValue,
//             final_price: price
//         } : null;

//         console.log("Prepared payment data:", {
//             price,
//             originalAmount,
//             discountAmount,
//             discountPercentageValue,
//             couponCode,
//             couponDetailsObj,
//             isCustomPack: isCustomPackPurchase,
//             courses: allCourses
//         });

//         // Generate order ID
//         const orderId = generateOrderId();

//         try {
//             const orderCreationData = {
//                 price: price,
//                 id: orderId,
//                 course: displayCourseName,
//                 plan: displayPlan,
//                 studentData: { name, email, phone },
//                 courseId: displayCourseId,
//                 originalAmount: originalAmount,
//                 discountAmount: discountAmount,
//                 discountPercentage: discountPercentageValue,
//                 couponCode: couponCode,
//                 couponDetails: couponDetailsObj,
//                 // NEW: Add multiple courses data
//                 courses: allCourses,
//                 isCustomPack: isCustomPackPurchase
//             };

//             console.log("Creating order with data:", orderCreationData);

//             // Step 1: Create order on backend
//             const response = await fetch("/api/pro-packs/ordercreation", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(orderCreationData),
//             })

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 console.error("Order creation failed:", response.status, errorData);
//                 throw new Error(errorData.message || `Order creation failed: ${response.status}`)
//             }

//             const data = await response.json()
//             if (!data) {
//                 throw new Error("Invalid order response")
//             }

//             console.log("Order creation response:", data)

//             // Step 2: Open Razorpay checkout
//             const paymentObject = new window.Razorpay({
//                 key: razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//                 amount: data.amount,
//                 currency: data.currency || 'INR',
//                 name: "Innoknowvex",
//                 description: couponCode 
//                     ? `${displayCourseName} - ${displayPlan} (${couponCode} applied - ${discountPercentageValue}% off)`
//                     : `${displayCourseName} - ${displayPlan} Plan`,
//                 order_id: data.id,
//                 handler: async function (response) {
//                     try {
//                         console.log("Razorpay response received:", response);
                        
//                         // Send verification data with all details - UPDATED for multiple courses
//                         const verificationData = {
//                             razorpay_order_id: response.razorpay_order_id,
//                             razorpay_payment_id: response.razorpay_payment_id,
//                             razorpay_signature: response.razorpay_signature,
//                             studentData: { 
//                                 name: name, 
//                                 email: email, 
//                                 phone: phone 
//                             },
//                             course: displayCourseName,
//                             plan: displayPlan,
//                             amount: price,
//                             originalAmount: originalAmount,
//                             discountAmount: discountAmount,
//                             discountPercentage: discountPercentageValue,
//                             couponCode: couponCode,
//                             couponDetails: couponDetailsObj,
//                             courseId: displayCourseId,
//                             // NEW: Add multiple courses data for verification
//                             courses: allCourses,
//                             isCustomPack: isCustomPackPurchase
//                         };

//                         console.log("Sending verification data:", verificationData);

//                         // Step 3: Verify payment and save to Supabase
//                         const verifyResponse = await fetch("/api/pro-packs/verifypayment", {
//                             method: "POST",
//                             headers: { "Content-Type": "application/json" },
//                             body: JSON.stringify(verificationData),
//                         })

//                         const verifyData = await verifyResponse.json();
//                         console.log("Verification response:", verifyData);

//                         if (!verifyResponse.ok) {
//                             throw new Error(verifyData.message || `Payment verification failed: ${verifyResponse.status}`)
//                         }

//                         if (verifyData.success) {
//                             const discountInfo = couponCode 
//                                 ? `\n\nDiscount Applied:\n• Coupon Code: ${couponCode}\n• Original Amount: ₹${originalAmount.toLocaleString('en-IN')}\n• Discount: ₹${discountAmount.toLocaleString('en-IN')} (${discountPercentageValue}% off)\n• Final Amount: ₹${price.toLocaleString('en-IN')}`
//                                 : '';

//                             // UPDATED: Show course details for custom packs
//                             const courseDetails = isCustomPackPurchase 
//                                 ? `\n\nCourses Enrolled (${allCourses.length}):\n${allCourses.map((course, index) => `• ${course.courseName} - ${course.plan}`).join('\n')}`
//                                 : '';

//                             const successMessage = `Payment Successful! 
                            
// Welcome to ${displayCourseName} - ${displayPlan} Plan!${courseDetails}

// Your enrollment details have been recorded and you should receive a confirmation email shortly.${discountInfo}

// Transaction Details:
// • Payment ID: ${verifyData.paymentId}
// • Order ID: ${verifyData.orderId}
// • Total Courses: ${isCustomPackPurchase ? allCourses.length : 1}

// Thank you for choosing Innoknowvex!`;
                            
//                             alert(successMessage);
                            
//                             // Clear cart after successful payment
//                             sessionStorage.removeItem('cartItems');
//                             // Close the popup
//                             closeForm();
//                             // Refresh page
//                             window.location.reload();
//                         } else {
//                             alert("Payment verification failed: " + (verifyData.message || "Unknown error"))
//                         }
//                     } catch (err) {
//                         console.error("Verification error:", err)
//                         alert("Something went wrong during verification: " + err.message)
//                     } finally {
//                         setIsProcessing(false);
//                     }
//                 },
//                 prefill: {
//                     name,
//                     email,
//                     contact: phone,
//                 },
//                 notes: {
//                     coupon_code: couponCode || 'none',
//                     original_amount: originalAmount,
//                     discount_amount: discountAmount,
//                     is_custom_pack: isCustomPackPurchase ? 'true' : 'false',
//                     total_courses: allCourses.length.toString()
//                 },
//                 theme: {
//                     color: "#A38907"
//                 },
//                 modal: {
//                     ondismiss: function () {
//                         console.log("Payment popup closed by user")
//                         setIsProcessing(false);
//                     },
//                 }
//             })

//             paymentObject.on('payment.failed', function (response) {
//                 console.error('Payment failed:', response.error);
//                 alert(`Payment failed: ${response.error.description || 'Unknown error occurred'}`);
//                 setIsProcessing(false);
//             });

//             paymentObject.open()
//         } catch (error) {
//             console.error("Payment error:", error)
//             alert("Payment process failed. Please try again. Error: " + error.message)
//             setIsProcessing(false);
//         }
//     }

//     useEffect(() => {
//         loadScript("https://checkout.razorpay.com/v1/checkout.js").catch(err =>
//             console.error("Failed to load Razorpay script:", err)
//         )
//     }, [])

//     // Close on Escape key
//     useEffect(() => {
//         const handleKey = (e) => {
//             if (e.key === "Escape" && !isProcessing) closeForm()
//         }
//         window.addEventListener("keydown", handleKey)
//         return () => window.removeEventListener("keydown", handleKey)
//     }, [isProcessing])

//     // Reset form when popup closes
//     useEffect(() => {
//         if (!isFormOpen) {
//             setName("")
//             setEmail("")
//             setPhone("")
//             setIsProcessing(false)
//         }
//     }, [isFormOpen])

//     const handleDelete = (itemToBeDeleted) => {
//         const updatedItems = storedItems.filter((item) => {
//             if (itemToBeDeleted.isPack) {
//                 return item.id !== itemToBeDeleted.id;
//             } else {
//                 return item.course !== itemToBeDeleted.course;
//             }
//         });
        
//         setStoredItems(updatedItems)
//         sessionStorage.setItem("cartItems", JSON.stringify(updatedItems))
        
//         toast.success('Deleted !', {
//             position: "top-right",
//             autoClose: 500,
//             hideProgressBar: false,
//             closeOnClick: false,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "colored",
//             onClose: () => window.location.reload(),
//         });
//     }

//     const handleEnrollClick = () => {
//         if (total == 0) {
//             toast.warning('Add something to checkout', {
//                 position: "top-right",
//                 autoClose: 1000,
//                 hideProgressBar: false,
//                 closeOnClick: false,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//                 theme: "colored",
//             });
//             return;
//         }
//         setIsFormOpen(true);
//     };

//     const closeForm = () => {
//         setIsFormOpen(false);
//     };

//     const applyCoupon = async () => {
//         // Check if a coupon is already applied
//         if (appliedCoupon) {
//             toast.warning("You already have a coupon applied. Remove it first to apply a new one.", {
//                 position: "top-right",
//                 autoClose: 2000,
//                 theme: "colored",
//             });
//             return;
//         }

//         if (!coupon || coupon.trim() === "") {
//             toast.warning("Please enter a coupon code", {
//                 position: "top-right",
//                 autoClose: 2000,
//                 theme: "colored",
//             });
//             return;
//         }

//         try {
//             const response = await fetch("/api/pro-packs/coupon_validation", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     couponCode: coupon.trim(),
//                     price: originalTotal,
//                     courseId: "pro-packs",
//                 }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 const message = errorData.message || "Failed to apply coupon";
//                 toast.error(message, { position: "top-right", autoClose: 3000, theme: "colored" });
//                 return;
//             }

//             const data = await response.json();
//             console.log("Coupon validation response:", data);

//             if (data.success) {
//                 const discountAmount = originalTotal - data.finalPrice;
//                 const discountPercent = ((discountAmount / originalTotal) * 100).toFixed(2);
                
//                 setTotal(data.finalPrice);
//                 setDiscount(discountAmount);
//                 setDiscountPercentage(parseFloat(discountPercent));
//                 setAppliedCoupon(coupon.trim());
                
//                 // Store complete coupon details
//                 setCouponDetails({
//                     discount_type: data.discount_type || 'percentage',
//                     discount_value: data.discount_value || discountPercent,
//                     coupon_name: coupon.trim(),
//                     valid_from: data.valid_from || null,
//                     valid_until: data.valid_until || null,
//                     min_purchase: data.min_purchase || null,
//                     max_discount: data.max_discount || null,
//                     ...data
//                 });
                
//                 setCoupon("");
//                 toast.success(`Coupon applied! You saved ₹${discountAmount.toLocaleString('en-IN')}`, {
//                     position: "top-right",
//                     autoClose: 3000,
//                     theme: "colored",
//                 });
//             } else {
//                 const message = data.message || "Invalid coupon";
//                 setCoupon("")
//                 toast.error(message, { position: "top-right", autoClose: 3000, theme: "colored" });
//             }
//         } catch (err) {
//             console.error("Error applying coupon:", err);
//             toast.error("Something went wrong. Please try again later.", {
//                 position: "top-right",
//                 autoClose: 3000,
//                 theme: "colored",
//             });
//         }
//     };

//     const removeCoupon = () => {
//         setTotal(originalTotal);
//         setDiscount(0);
//         setDiscountPercentage(0);
//         setAppliedCoupon(null);
//         setCouponDetails(null);
//         toast.info('Coupon removed successfully!', {
//             position: "top-right",
//             autoClose: 2000,
//             theme: "colored",
//         });
//     };

//     useEffect(() => {
//         const cart = sessionStorage.getItem("cartItems");

//         if (cart) {
//             setStoredItems(JSON.parse(cart));
//         }
//         gsap.timeline()
//             .fromTo(
//                 star.current,
//                 { opacity: 0, scale: 0 },
//                 { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
//             )
//             .to(
//                 star.current,
//                 { rotate: 720, duration: 1, ease: "power2.inOut" }
//             )
//             .to(
//                 star.current,
//                 { rotate: "+=720", duration: 1, ease: "power2.inOut", delay: 0.1 }
//             );
//     }, [])

//     useEffect(() => {
//         const amount = storedItems.reduce((acc, item) => acc + item.price, 0);
//         setOriginalTotal(amount);
        
//         // Only update total if no coupon is applied
//         if (!appliedCoupon) {
//             setTotal(amount);
//         }
//     }, [storedItems, appliedCoupon]);

//     // Function to render item name based on whether it's a pack or regular course
//     const renderItemName = (item) => {
//         if (item.isPack) {
//             return (
//                 <div className={style.itemName}>
//                     {item.name}
//                     <span className={style.packBadge}>Pack ({item.courseCount} courses)</span>
//                 </div>
//             );
//         } else if (item.isCustomPack) {
//             return (
//                 <div className={style.itemName}>
//                     Custom Pack
//                     <span className={style.packBadge}>Your Selection ({item.courses?.length || 0} courses)</span>
//                 </div>
//             );
//         } else {
//             return <div className={style.itemName}>{item.course}</div>;
//         }
//     };

//     // Function to render item info/plan
//     const renderItemInfo = (item) => {
//         if (item.isPack) {
//             return <div className={style.itemInfo}>{item.plan} • {item.courseCount} courses</div>;
//         } else if (item.isCustomPack) {
//             return <div className={style.itemInfo}>{item.plan} • {item.courses?.length || 0} selected courses</div>;
//         } else {
//             return <div className={style.itemInfo}>{item.plan}</div>;
//         }
//     };

//     // Build coupon data object to pass to form
//     const getCouponDataForPopup = () => {
//         if (!appliedCoupon) return null;
        
//         return {
//             couponCode: appliedCoupon,
//             originalPrice: originalTotal,
//             discountAmount: discount,
//             discountPercentage: discountPercentage,
//             discount_type: couponDetails?.discount_type || 'percentage',
//             discount_value: couponDetails?.discount_value || discountPercentage,
//             coupon_name: appliedCoupon,
//             valid_from: couponDetails?.valid_from || null,
//             valid_until: couponDetails?.valid_until || null,
//             min_purchase: couponDetails?.min_purchase || null,
//             max_discount: couponDetails?.max_discount || null
//         };
//     };

//     // NEW: Display course list for custom packs in form
//     const renderCourseList = () => {
//         const allCourses = getAllCourseDetails();
//         if (allCourses.length <= 1) return null;

//         return (
//             <div className={style.courseList}>
//                 <p><strong>Selected Courses ({allCourses.length}):</strong></p>
//                 <ul>
//                     {allCourses.map((course, index) => (
//                         <li key={index}>
//                             {course.courseName} - {course.plan}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         );
//     };

//     const couponData = getCouponDataForPopup();

//     return (
//         <>
//             {/* Payment Form Modal */}
//             {isFormOpen && (
//                 <div className={style.formPage}>
//                     {/* Overlay */}
//                     <div className={style.overlay} onClick={isProcessing ? undefined : closeForm}></div>

//                     {/* Form Card */}
//                     <div className={style.formWrapper}>
//                         <div className={style.formHeaderContainer}>
//                             <h1>Checkout</h1>
//                             <button className={style.closeButton} onClick={closeForm} disabled={isProcessing}>
//                                 ✕
//                             </button>
//                         </div>

//                         <div className={style.courseInfo}>
//                             {couponData && couponData.couponCode && (
//                                 <div className={style.discountInfo}>
//                                     <p style={{ color: '#22c55e', fontWeight: '600', marginBottom: '8px' }}>
//                                         🎉 {couponData.couponCode} Applied - {couponData.discountPercentage}% OFF!
//                                     </p>
//                                     <p style={{ textDecoration: 'line-through', color: '#6b7280', fontSize: '0.9em' }}>
//                                         Original: ₹{couponData.originalPrice?.toLocaleString('en-IN')}
//                                     </p>
//                                     <p style={{ color: '#22c55e', fontSize: '0.9em' }}>
//                                         Discount: -₹{couponData.discountAmount?.toLocaleString('en-IN')}
//                                     </p>
//                                 </div>
//                             )}
//                             <p>
//                                 <strong>Total Amount:</strong> ₹{total?.toLocaleString('en-IN')}
//                             </p>
//                             {storedItems.length > 0 && (
//                                 <div className={style.courseDetails}>
//                                     <p><strong>Course:</strong> {isCustomPack() ? `Custom Pack (${getAllCourseDetails().length} courses)` : storedItems[0]?.isPack ? storedItems[0].name : storedItems[0]?.course}</p>
//                                     <p><strong>Plan:</strong> {storedItems[0]?.plan}</p>
//                                     {/* NEW: Show course list for custom packs */}
//                                     {renderCourseList()}
//                                 </div>
//                             )}
//                         </div>

//                         <div className={style.inputGroup}>
//                             <label className={style.formLabel}>Full Name</label>
//                             <input
//                                 type="text"
//                                 placeholder="Enter your full name"
//                                 className={style.formInput}
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 required
//                                 disabled={isProcessing}
//                             />
//                         </div>

//                         <div className={style.inputGroup}>
//                             <label className={style.formLabel}>Email Address</label>
//                             <input
//                                 type="email"
//                                 placeholder="Enter your email"
//                                 className={style.formInput}
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                                 disabled={isProcessing}
//                             />
//                             {email && !isValidEmail(email) && (
//                                 <span className={style.errorText}>Invalid email format</span>
//                             )}
//                         </div>

//                         <div className={style.inputGroup}>
//                             <label className={style.formLabel}>Phone Number</label>
//                             <input
//                                 type="tel"
//                                 placeholder="Enter your phone number"
//                                 className={style.formInput}
//                                 value={phone}
//                                 onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
//                                 maxLength={10}
//                                 required
//                                 disabled={isProcessing}
//                             />
//                             {phone && !isValidPhone(phone) && (
//                                 <span className={style.errorText}>Phone must be 10 digits</span>
//                             )}
//                         </div>

//                         {/* Checkout Button */}
//                         <div className={style.buttonGroup}>
//                             <button
//                                 onClick={() => makePayment(total, name, email, phone)}
//                                 className={style.checkoutBtn}
//                                 disabled={!isFormValid() || isProcessing || !razorpayKeyId}
//                                 style={{
//                                     opacity: (!isFormValid() || isProcessing || !razorpayKeyId) ? 0.5 : 1,
//                                     cursor: (!isFormValid() || isProcessing || !razorpayKeyId) ? "not-allowed" : "pointer"
//                                 }}
//                             >
//                                 {isProcessing ? "Processing Payment..." : 
//                                  !razorpayKeyId ? "Loading Payment Gateway..." : 
//                                  `Pay ₹${total?.toLocaleString('en-IN')}`}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className={style.head}>
//                 <svg ref={star} className={style.star} width="50" height="50" viewBox="0 0 136 148" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M66.0962 1.74792C66.3511 -0.582641 69.4658 -0.582641 69.7207 1.74792L71.8573 21.2992C74.6162 46.5452 92.9484 66.4498 116.2 69.4453L134.207 71.7651C136.354 72.0419 136.354 75.4237 134.207 75.7005L116.2 78.0203C92.9484 81.0159 74.6162 100.92 71.8573 126.166L69.7207 145.717C69.4658 148.048 66.3511 148.048 66.0962 145.717L63.9596 126.166C61.2007 100.92 42.8685 81.0159 19.6167 78.0203L1.60985 75.7005C-0.536616 75.4237 -0.536616 72.0419 1.60985 71.7651L19.6167 69.4453C42.8685 66.4498 61.2007 46.5452 63.9596 21.2992L66.0962 1.74792Z" fill="#9F8310" />
//                 </svg>

//                 <h1 className={style.heading}>Your Personalised <span>Cart</span></h1>
//             </div>

//             <div className={style.shoppingCartContainer}>
//                 <div className={style.cartContent}>
//                     <div className={style.cartItems}>
//                         <div className={style.cartItemsList}>
//                             {storedItems.length > 0 ? (
//                                 <>
//                                     {storedItems.map((item, index) => (
//                                         <div key={item.id || index} className={style.item} data-item="n2o">
//                                             <div>
//                                                 <Image
//                                                     className={style.itemImage}
//                                                     src={item.image}
//                                                     height={100}
//                                                     width={100}
//                                                     alt={item.isPack ? item.name : item.course}
//                                                 />
//                                             </div>

//                                             <div className={style.itemDetails}>
//                                                 {renderItemName(item)}
//                                                 {renderItemInfo(item)}
//                                             </div>

//                                             <div className={style.itemControls}>
//                                                 <div className={style.itemPrice}>₹{item.price.toLocaleString('en-IN')}</div>
//                                                 {item.originalPrice && item.originalPrice > item.price && (
//                                                     <div className={style.originalPrice}>₹{item.originalPrice.toLocaleString('en-IN')}</div>
//                                                 )}
//                                             </div>

//                                             <div>
//                                                 <svg
//                                                     className={style.deleteItem}
//                                                     onClick={() => handleDelete(item)}
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     width="24"
//                                                     height="24"
//                                                     viewBox="0 0 24 24"
//                                                 >
//                                                     <path
//                                                         fill="none"
//                                                         stroke="currentColor"
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                         strokeWidth="2"
//                                                         d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
//                                                     />
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </>
//                             ) : (
//                                 <div className={style.emptyCart}>Nothing in cart yet</div>
//                             )}
//                         </div>
//                     </div>

//                     <div className={style.orderSummary}>
//                         <h3 className={style.summaryTitle}>Order Summary</h3>
//                         <div className={style.line1}></div>
                        
//                         {/* Subtotal */}
//                         <div className={style.summaryLine}>
//                             <span>Subtotal</span>
//                             <span className={style.amount}>₹{originalTotal.toLocaleString('en-IN')}</span>
//                         </div>

//                         {/* Discount - Only show if coupon is applied */}
//                         {appliedCoupon && (
//                             <div className={`${style.summaryLine} ${style.discountLine}`}>
//                                 <span>Discount ({discountPercentage}%)</span>
//                                 <span className={style.discountAmount}>-₹{discount.toLocaleString('en-IN')}</span>
//                             </div>
//                         )}

//                         {/* Total */}
//                         <div className={`${style.summaryLine} ${style.summaryLineTotal}`}>
//                             <span>Total</span>
//                             <span className={style.amount} id="total">₹{total.toLocaleString('en-IN')}</span>
//                         </div>
                        
//                         <div className={style.line2}></div>

//                         {/* Applied Coupon Display */}
//                         {appliedCoupon && (
//                             <div className={style.appliedCouponBox}>
//                                 <div className={style.couponInfo}>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                         <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
//                                         <line x1="7" y1="7" x2="7.01" y2="7"/>
//                                     </svg>
//                                     <div>
//                                         <div className={style.couponLabel}>Applied Coupon</div>
//                                         <div className={style.couponCode}>{appliedCoupon}</div>
//                                     </div>
//                                 </div>
//                                 <button 
//                                     onClick={removeCoupon} 
//                                     className={style.removeCouponBtn}
//                                     title="Remove coupon"
//                                 >
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                         <line x1="18" y1="6" x2="6" y2="18"/>
//                                         <line x1="6" y1="6" x2="18" y2="18"/>
//                                     </svg>
//                                 </button>
//                             </div>
//                         )}

//                         {/* Coupon Input - Only show if no coupon is applied */}
//                         {!appliedCoupon && (
//                             <div className={style.couponSection}>
//                                 <div>
//                                     <input
//                                         type="text"
//                                         placeholder="Coupon Code"
//                                         id="couponInput"
//                                         className={style.couponInput}
//                                         value={coupon}
//                                         onChange={(e) => setCoupon(e.target.value.toUpperCase())}
//                                         onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
//                                     />
//                                 </div>
//                                 <div>
//                                     <button onClick={applyCoupon} className={style.couponBtn}>Apply</button>
//                                 </div>
//                             </div>
//                         )}

//                         <button className={style.checkoutBtn} onClick={() => handleEnrollClick()}>
//                             Go to Checkout
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default CartPage




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
    
    // Form fields
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [razorpayKeyId, setRazorpayKeyId] = useState(null)

    // Email validation regex
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    // Phone validation (10 digits)
    const isValidPhone = (phone) => {
        return /^[0-9]{10}$/.test(phone)
    }

    // Check if form is valid
    const isFormValid = () => {
        return (
            name.trim().length > 0 &&
            isValidEmail(email) &&
            isValidPhone(phone)
        )
    }

    // Generate unique ID for the order
    const generateOrderId = () => {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 9)
        return `techpack_${timestamp}_${random}`
    }

    // Fetch Razorpay key ID when component mounts
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

    // NEW: Check if cart contains a custom pack with multiple courses
    const isCustomPack = () => {
        return storedItems.length > 1 || (storedItems.length === 1 && storedItems[0].isCustomPack);
    }

    // NEW: Get all course details for custom pack
    const getAllCourseDetails = () => {
        if (storedItems.length === 1 && storedItems[0].isCustomPack) {
            // Single custom pack item containing multiple courses
            return storedItems[0].courses || [];
        } else if (storedItems.length > 1) {
            // Multiple individual courses selected
            return storedItems.map(item => ({
                courseId: item.program_id || item.id,
                courseName: item.course || item.name,
                plan: item.plan,
                price: item.price
            }));
        } else {
            // Single course or regular pack
            return storedItems.length > 0 ? [{
                courseId: storedItems[0].program_id || storedItems[0].id,
                courseName: storedItems[0].course || storedItems[0].name,
                plan: storedItems[0].plan,
                price: storedItems[0].price
            }] : [];
        }
    }

    const makePayment = async (price, name, email, phone) => {
        if (!isFormValid()) {
            alert("Please fill all fields correctly")
            return
        }

        setIsProcessing(true)

        // Get course information - UPDATED for multiple courses
        const allCourses = getAllCourseDetails();
        const isCustomPackPurchase = isCustomPack();
        
        // For display purposes, use the first course or pack name
        const displayCourseName = isCustomPackPurchase 
            ? `Custom Pack (${allCourses.length} courses)`
            : storedItems[0]?.isPack 
                ? storedItems[0].name 
                : storedItems[0]?.course || "Tech Starter Pack";
                
        const displayPlan = storedItems[0]?.plan || "Mentor Plan";
        const displayCourseId = isCustomPackPurchase 
            ? "custom-pack" 
            : storedItems[0]?.program_id || "tech-starter-pack";

        // Get coupon information properly
        console.log("Coupon Data received in makePayment:", getCouponDataForPopup());
        
        const couponData = getCouponDataForPopup();
        const originalAmount = couponData?.originalPrice || price;
        const discountAmount = couponData?.discountAmount || 0;
        const discountPercentageValue = couponData?.discountPercentage || 0;
        const couponCode = couponData?.couponCode || null;
        
        // Build comprehensive coupon details object
        const couponDetailsObj = couponData && couponCode ? {
            discount_type: couponData.discount_type || 'percentage',
            discount_value: couponData.discount_value || discountPercentageValue,
            coupon_name: couponData.coupon_name || couponCode,
            valid_from: couponData.valid_from || null,
            valid_until: couponData.valid_until || null,
            min_purchase: couponData.min_purchase || null,
            max_discount: couponData.max_discount || null,
            original_price: originalAmount,
            discount_amount: discountAmount,
            discount_percentage: discountPercentageValue,
            final_price: price
        } : null;

        console.log("Prepared payment data:", {
            price,
            originalAmount,
            discountAmount,
            discountPercentageValue,
            couponCode,
            couponDetailsObj,
            isCustomPack: isCustomPackPurchase,
            courses: allCourses
        });

        // Generate order ID
        const orderId = generateOrderId();

        try {
            const orderCreationData = {
                price: price,
                id: orderId,
                course: displayCourseName,
                plan: displayPlan,
                studentData: { name, email, phone },
                courseId: displayCourseId,
                originalAmount: originalAmount,
                discountAmount: discountAmount,
                discountPercentage: discountPercentageValue,
                couponCode: couponCode,
                couponDetails: couponDetailsObj,
                // NEW: Add multiple courses data
                courses: allCourses,
                isCustomPack: isCustomPackPurchase
            };

            console.log("Creating order with data:", orderCreationData);

            // Step 1: Create order on backend
            const response = await fetch("/api/pro-packs/ordercreation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderCreationData),
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Order creation failed:", response.status, errorData);
                throw new Error(errorData.message || `Order creation failed: ${response.status}`)
            }

            const data = await response.json()
            if (!data) {
                throw new Error("Invalid order response")
            }

            console.log("Order creation response:", data)

            // Step 2: Open Razorpay checkout
            const paymentObject = new window.Razorpay({
                key: razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency || 'INR',
                name: "Innoknowvex",
                description: couponCode 
                    ? `${displayCourseName} - ${displayPlan} (${couponCode} applied - ${discountPercentageValue}% off)`
                    : `${displayCourseName} - ${displayPlan} Plan`,
                order_id: data.id,
                handler: async function (response) {
                    try {
                        console.log("Razorpay response received:", response);
                        
                        // Send verification data with all details - UPDATED for multiple courses
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
                            amount: price,
                            originalAmount: originalAmount,
                            discountAmount: discountAmount,
                            discountPercentage: discountPercentageValue,
                            couponCode: couponCode,
                            couponDetails: couponDetailsObj,
                            courseId: displayCourseId,
                            // NEW: Add multiple courses data for verification
                            courses: allCourses,
                            isCustomPack: isCustomPackPurchase
                        };

                        console.log("Sending verification data:", verificationData);

                        // Step 3: Verify payment and save to Supabase
                        const verifyResponse = await fetch("/api/pro-packs/verifypayment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(verificationData),
                        })

                        const verifyData = await verifyResponse.json();
                        console.log("Verification response:", verifyData);

                        if (!verifyResponse.ok) {
                            throw new Error(verifyData.message || `Payment verification failed: ${verifyResponse.status}`)
                        }

                        if (verifyData.success) {
                            const discountInfo = couponCode 
                                ? `\n\nDiscount Applied:\n• Coupon Code: ${couponCode}\n• Original Amount: ₹${originalAmount.toLocaleString('en-IN')}\n• Discount: ₹${discountAmount.toLocaleString('en-IN')} (${discountPercentageValue}% off)\n• Final Amount: ₹${price.toLocaleString('en-IN')}`
                                : '';

                            // UPDATED: Show course details for custom packs
                            const courseDetails = isCustomPackPurchase 
                                ? `\n\nCourses Enrolled (${allCourses.length}):\n${allCourses.map((course, index) => `• ${course.courseName} - ${course.plan}`).join('\n')}`
                                : '';

                            const successMessage = `Payment Successful! 
                            
Welcome to ${displayCourseName} - ${displayPlan} Plan!${courseDetails}

Your enrollment details have been recorded and you should receive a confirmation email shortly.${discountInfo}

Transaction Details:
• Payment ID: ${verifyData.paymentId}
• Order ID: ${verifyData.orderId}
• Total Courses: ${isCustomPackPurchase ? allCourses.length : 1}

Thank you for choosing Innoknowvex!`;
                            
                            alert(successMessage);
                            
                            // Clear cart after successful payment
                            sessionStorage.removeItem('cartItems');
                            // Close the popup
                            closeForm();
                            // Refresh page
                            window.location.reload();
                        } else {
                            alert("Payment verification failed: " + (verifyData.message || "Unknown error"))
                        }
                    } catch (err) {
                        console.error("Verification error:", err)
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
                    coupon_code: couponCode || 'none',
                    original_amount: originalAmount,
                    discount_amount: discountAmount,
                    is_custom_pack: isCustomPackPurchase ? 'true' : 'false',
                    total_courses: allCourses.length.toString()
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
                console.error('Payment failed:', response.error);
                alert(`Payment failed: ${response.error.description || 'Unknown error occurred'}`);
                setIsProcessing(false);
            });

            paymentObject.open()
        } catch (error) {
            console.error("Payment error:", error)
            alert("Payment process failed. Please try again. Error: " + error.message)
            setIsProcessing(false);
        }
    }

    useEffect(() => {
        loadScript("https://checkout.razorpay.com/v1/checkout.js").catch(err =>
            console.error("Failed to load Razorpay script:", err)
        )
    }, [])

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape" && !isProcessing) closeForm()
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [isProcessing])

    // Reset form when popup closes
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
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    const applyCoupon = async () => {
        // Check if a coupon is already applied
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
            const response = await fetch("/api/pro-packs/coupon_validation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    couponCode: coupon.trim(),
                    price: originalTotal,
                    courseId: "pro-packs",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.message || "Failed to apply coupon";
                toast.error(message, { position: "top-right", autoClose: 3000, theme: "colored" });
                return;
            }

            const data = await response.json();
            console.log("Coupon validation response:", data);

            if (data.success) {
                const discountAmount = originalTotal - data.finalPrice;
                const discountPercent = ((discountAmount / originalTotal) * 100).toFixed(2);
                
                setTotal(data.finalPrice);
                setDiscount(discountAmount);
                setDiscountPercentage(parseFloat(discountPercent));
                setAppliedCoupon(coupon.trim());
                
                // Store complete coupon details
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
            console.error("Error applying coupon:", err);
            toast.error("Something went wrong. Please try again later.", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
        }
    };

    const removeCoupon = () => {
        setTotal(originalTotal);
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

    useEffect(() => {
        const cart = sessionStorage.getItem("cartItems");

        if (cart) {
            setStoredItems(JSON.parse(cart));
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

    useEffect(() => {
        const amount = storedItems.reduce((acc, item) => acc + item.price, 0);
        setOriginalTotal(amount);
        
        // Only update total if no coupon is applied
        if (!appliedCoupon) {
            setTotal(amount);
        }
    }, [storedItems, appliedCoupon]);

    // Function to render item name based on whether it's a pack or regular course
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
        } else {
            return <div className={style.itemName}>{item.course}</div>;
        }
    };

    // Function to render item info/plan
    const renderItemInfo = (item) => {
        if (item.isPack) {
            return <div className={style.itemInfo}>{item.plan} • {item.courseCount} courses</div>;
        } else if (item.isCustomPack) {
            return <div className={style.itemInfo}>{item.plan} • {item.courses?.length || 0} selected courses</div>;
        } else {
            return <div className={style.itemInfo}>{item.plan}</div>;
        }
    };

    // Build coupon data object to pass to form
    const getCouponDataForPopup = () => {
        if (!appliedCoupon) return null;
        
        return {
            couponCode: appliedCoupon,
            originalPrice: originalTotal,
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

    // NEW: Display course list for custom packs in form
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

    return (
        <>
            {/* Payment Form Modal */}
            {isFormOpen && (
                <div className={style.formPage}>
                    {/* Overlay */}
                    <div className={style.overlay} onClick={isProcessing ? undefined : closeForm}></div>

                    {/* Form Card */}
                    <div className={style.formWrapper}>
                        <div className={style.formHeaderContainer}>
                            <h1>Checkout</h1>
                            <button className={style.closeButton} onClick={closeForm} disabled={isProcessing}>
                                ✕
                            </button>
                        </div>

                        <div className={style.courseInfo}>
                            {couponData && couponData.couponCode && (
                                <div className={style.discountInfo}>
                                    <p style={{ color: '#22c55e', fontWeight: '600', marginBottom: '8px' }}>
                                        🎉 {couponData.couponCode} Applied - {couponData.discountPercentage}% OFF!
                                    </p>
                                    <p style={{ textDecoration: 'line-through', color: '#6b7280', fontSize: '0.9em' }}>
                                        Original: ₹{couponData.originalPrice?.toLocaleString('en-IN')}
                                    </p>
                                    <p style={{ color: '#22c55e', fontSize: '0.9em' }}>
                                        Discount: -₹{couponData.discountAmount?.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            )}
                            <p>
                                <strong>Total Amount:</strong> ₹{total?.toLocaleString('en-IN')}
                            </p>
                            {storedItems.length > 0 && (
                                <div className={style.courseDetails}>
                                    <p><strong>Course:</strong> {isCustomPack() ? `Custom Pack (${getAllCourseDetails().length} courses)` : storedItems[0]?.isPack ? storedItems[0].name : storedItems[0]?.course}</p>
                                    <p><strong>Plan:</strong> {storedItems[0]?.plan}</p>
                                    {/* NEW: Show course list for custom packs */}
                                    {renderCourseList()}
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

                        {/* Checkout Button */}
                        <div className={style.buttonGroup}>
                            <button
                                onClick={() => makePayment(total, name, email, phone)}
                                className={style.checkoutBtn}
                                disabled={!isFormValid() || isProcessing || !razorpayKeyId}
                                style={{
                                    opacity: (!isFormValid() || isProcessing || !razorpayKeyId) ? 0.5 : 1,
                                    cursor: (!isFormValid() || isProcessing || !razorpayKeyId) ? "not-allowed" : "pointer"
                                }}
                            >
                                {isProcessing ? "Processing Payment..." : 
                                 !razorpayKeyId ? "Loading Payment Gateway..." : 
                                 `Pay ₹${total?.toLocaleString('en-IN')}`}
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
                                                <div className={style.itemPrice}>₹{item.price.toLocaleString('en-IN')}</div>
                                                {item.originalPrice && item.originalPrice > item.price && (
                                                    <div className={style.originalPrice}>₹{item.originalPrice.toLocaleString('en-IN')}</div>
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
                        
                        {/* Subtotal */}
                        <div className={style.summaryLine}>
                            <span>Subtotal</span>
                            <span className={style.amount}>₹{originalTotal.toLocaleString('en-IN')}</span>
                        </div>

                        {/* Discount - Only show if coupon is applied */}
                        {appliedCoupon && (
                            <div className={`${style.summaryLine} ${style.discountLine}`}>
                                <span>Discount ({discountPercentage}%)</span>
                                <span className={style.discountAmount}>-₹{discount.toLocaleString('en-IN')}</span>
                            </div>
                        )}

                        {/* Total */}
                        <div className={`${style.summaryLine} ${style.summaryLineTotal}`}>
                            <span>Total</span>
                            <span className={style.amount} id="total">₹{total.toLocaleString('en-IN')}</span>
                        </div>
                        
                        <div className={style.line2}></div>

                        {/* Applied Coupon Display */}
                        {appliedCoupon && (
                            <div className={style.appliedCouponBox}>
                                <div className={style.couponInfo}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                                        <line x1="7" y1="7" x2="7.01" y2="7"/>
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
                                        <line x1="18" y1="6" x2="6" y2="18"/>
                                        <line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Coupon Input - Only show if no coupon is applied */}
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

                        <button className={style.checkoutBtn} onClick={() => handleEnrollClick()}>
                            Go to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartPage