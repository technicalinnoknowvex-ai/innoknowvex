// "use client";
// import React, { useRef, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Icon } from "@iconify/react";
// import Sparkle from "../../../../Common/Icons/Sparkle";
// import styles from "./styles/popupForm.module.scss";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";

// // Import your API functions
// import {
//   getProgramById,
//   getPrograms,
// } from "@/app/(backend)/api/programs/programs";

// const FormSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email"),
//   phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
//   couponCode: z.string().optional(),
// });

// const PopUpForm = ({
//   isOpen,
//   onClose,
//   plan,
//   course,
//   price: propPrice,
//   courseId: propCourseId,
// }) => {
//   console.log("🟢 [POPUP] Render state:", { isOpen, plan, course, price: propPrice });

//   const formRef = useRef(null);
//   const sparkleRef = useRef(null);

//   // Form state
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [razorpayKeyId, setRazorpayKeyId] = useState(null);

//   // Coupon state
//   const [couponValidating, setCouponValidating] = useState(false);
//   const [couponDiscount, setCouponDiscount] = useState(0);
//   const [couponDiscountPercentage, setCouponDiscountPercentage] = useState(0);
//   const [couponError, setCouponError] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);

//   // Course/Program state
//   const [courseId, setCourseId] = useState(null);
//   const [actualCourseName, setActualCourseName] = useState(course);
//   const [programDetails, setProgramDetails] = useState(null);
//   const [programs, setPrograms] = useState([]);
//   const [programsLoading, setProgramsLoading] = useState(true);

//   // Pricing state
//   const [pricing, setPricing] = useState(null);
//   const [pricingLoading, setPricingLoading] = useState(true);
//   const [pricingError, setPricingError] = useState(null);
//   const [originalPrice, setOriginalPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [finalPrice, setFinalPrice] = useState(0);

//   // Form setup
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//     watch,
//   } = useForm({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//       couponCode: "",
//     },
//   });

//   const couponCode = watch("couponCode");

//   // Fetch all programs with pricing on mount
//   useEffect(() => {
//     const fetchAllPrograms = async () => {
//       try {
//         setProgramsLoading(true);
//         const allPrograms = await getPrograms();
//         setPrograms(allPrograms);
//         console.log(
//           "Fetched programs with pricing from database:",
//           allPrograms
//         );
//       } catch (error) {
//         console.error("Error fetching programs:", error);
//       } finally {
//         setProgramsLoading(false);
//       }
//     };

//     fetchAllPrograms();
//   }, []);

//   // Enhanced course ID extraction
//   useEffect(() => {
//     if (programsLoading || programs.length === 0) {
//       return;
//     }

//     const extractCourseId = async () => {
//       console.log("Starting enhanced course ID extraction...");
//       console.log(
//         "Available programs:",
//         programs.map((p) => p.id)
//       );

//       // Method 1: Use prop if provided and valid
//       if (propCourseId && propCourseId.trim() && propCourseId !== "programs") {
//         console.log("Using courseId from props:", propCourseId);
//         const program = programs.find((p) => p.id === propCourseId);
//         if (program) {
//           setCourseId(propCourseId);
//           setProgramDetails(program);
//           setActualCourseName(program.title);
//           console.log("Found program in database:", program);
//           return;
//         }
//       }

//       // Method 2: Extract from current URL
//       if (typeof window !== "undefined") {
//         const currentUrl = window.location.href;
//         console.log("Current URL:", currentUrl);

//         const url = new URL(currentUrl);
//         const urlParams = url.searchParams;

//         const paramNames = [
//           "courseId",
//           "course_id",
//           "id",
//           "cid",
//           "courseID",
//           "course",
//         ];
//         for (const param of paramNames) {
//           const value = urlParams.get(param);
//           if (value && value.trim() && value.toLowerCase() !== "programs") {
//             const program = programs.find((p) => p.id === value.trim());
//             if (program) {
//               console.log(
//                 `Found valid courseId in URL param '${param}':`,
//                 value
//               );
//               setCourseId(value.trim());
//               setProgramDetails(program);
//               setActualCourseName(program.title);
//               return;
//             }
//           }
//         }

//         const pathname = url.pathname;
//         console.log("Pathname:", pathname);

//         const pathParts = pathname
//           .split("/")
//           .filter((part) => part && part.trim());
//         console.log("Path parts:", pathParts);

//         for (const part of pathParts) {
//           const program = programs.find((p) => p.id === part);
//           if (program) {
//             console.log("Found exact program match in path:", part);
//             setCourseId(part);
//             setProgramDetails(program);
//             setActualCourseName(program.title);
//             return;
//           }
//         }

//         if (url.hash) {
//           const hashParams = new URLSearchParams(url.hash.substring(1));
//           for (const param of paramNames) {
//             const value = hashParams.get(param);
//             if (value && value.trim()) {
//               const program = programs.find((p) => p.id === value.trim());
//               if (program) {
//                 console.log(
//                   `Found valid courseId in hash param '${param}':`,
//                   value
//                 );
//                 setCourseId(value.trim());
//                 setProgramDetails(program);
//                 setActualCourseName(program.title);
//                 return;
//               }
//             }
//           }
//         }
//       }

//       // Method 3: Map course name to program ID
//       if (course && typeof course === "string") {
//         console.log("Mapping course name to program ID:", course);

//         const courseLower = course.toLowerCase().trim();

//         const directMatch = programs.find(
//           (p) => p.title && p.title.toLowerCase() === courseLower
//         );

//         if (directMatch) {
//           console.log("Found direct title match:", directMatch.id);
//           setCourseId(directMatch.id);
//           setProgramDetails(directMatch);
//           setActualCourseName(directMatch.title);
//           return;
//         }

//         const partialMatch = programs.find((p) => {
//           const programTitle = p.title.toLowerCase();
//           return (
//             programTitle.includes(courseLower) ||
//             courseLower.includes(programTitle)
//           );
//         });

//         if (partialMatch) {
//           console.log("Found partial title match:", partialMatch.id);
//           setCourseId(partialMatch.id);
//           setProgramDetails(partialMatch);
//           setActualCourseName(partialMatch.title);
//           return;
//         }
//       }

//       // Fallback
//       if (programs.length > 0) {
//         const fallbackProgram = programs[0];
//         console.log(
//           "Using first available program as fallback:",
//           fallbackProgram.id
//         );
//         setCourseId(fallbackProgram.id);
//         setProgramDetails(fallbackProgram);
//         setActualCourseName(fallbackProgram.title);
//         return;
//       }

//       const finalFallback = `course-${Date.now()}`;
//       console.log("Using final timestamp fallback courseId:", finalFallback);
//       setCourseId(finalFallback);
//       setActualCourseName(course || "Course");
//     };

//     extractCourseId();
//   }, [propCourseId, course, programs, programsLoading]);

//   // Fetch program with pricing data when courseId is available
//   useEffect(() => {
//     if (!courseId) return;

//     const fetchProgramWithPricing = async () => {
//       try {
//         setPricingLoading(true);
//         setPricingError(null);

//         console.log(
//           "Fetching program with pricing for courseId:",
//           courseId,
//           "Plan:",
//           plan
//         );

//         // Get program with combined pricing data
//         const programData = await getProgramById(courseId);

//         if (!programData) {
//           throw new Error("Program not found");
//         }

//         console.log("Fetched program data:", programData);

//         setProgramDetails(programData);
//         setActualCourseName(programData.title);

//         // Extract pricing based on plan
//         let actualPrice = 0;
//         let discountedPrice = 0;

//         if (programData.pricing) {
//           const planLower = plan.toLowerCase();

//           if (planLower === "self" || planLower === "self-paced") {
//             actualPrice = programData.pricing.self_actual_price || 0;
//             discountedPrice = programData.pricing.self_current_price || 0;
//           } else if (planLower === "mentor" || planLower === "mentor-led") {
//             actualPrice = programData.pricing.mentor_actual_price || 0;
//             discountedPrice = programData.pricing.mentor_current_price || 0;
//           } else if (planLower === "professional") {
//             actualPrice = programData.pricing.professional_actual_price || 0;
//             discountedPrice =
//               programData.pricing.professional_current_price || 0;
//           }
//         }

//         // Use prop price as fallback
//         if (actualPrice === 0 && propPrice) {
//           actualPrice = propPrice;
//           discountedPrice = propPrice;
//           console.log("Using prop price as fallback:", propPrice);
//         }

//         setOriginalPrice(actualPrice);
//         setCurrentPrice(discountedPrice);
//         setFinalPrice(discountedPrice);

//         // Store the full pricing object for reference
//         setPricing({
//           ...programData.pricing,
//           success: true,
//           course_name: programData.title,
//           course_id: programData.id,
//           currency: programData.pricing?.currency || "INR",
//         });

//         console.log("Prices set:", {
//           plan,
//           originalPrice: actualPrice,
//           currentPrice: discountedPrice,
//           finalPrice: discountedPrice,
//           programTitle: programData.title,
//         });
//       } catch (error) {
//         console.error("Error fetching program with pricing:", error);
//         setPricingError(error.message);

//         // Fallback to prop price
//         if (propPrice) {
//           setOriginalPrice(propPrice);
//           setCurrentPrice(propPrice);
//           setFinalPrice(propPrice);
//           console.log("Using prop price due to error:", propPrice);
//         }
//       } finally {
//         setPricingLoading(false);
//       }
//     };

//     fetchProgramWithPricing();
//   }, [courseId, plan, propPrice]);

//   // Fetch Razorpay key ID
//   useEffect(() => {
//     const fetchRazorpayConfig = async () => {
//       try {
//         const response = await fetch("/api/config");
//         if (response.ok) {
//           const config = await response.json();
//           setRazorpayKeyId(config.razorpayKeyId);
//         }
//       } catch (error) {
//         console.error("Failed to fetch Razorpay config:", error);
//       }
//     };

//     fetchRazorpayConfig();
//   }, []);

//   // Coupon validation
//   const validateCouponFromSheet = async (
//     couponCode,
//     courseId,
//     originalPrice
//   ) => {
//     try {
//       console.log("Validating coupon from sheet:", {
//         couponCode,
//         courseId,
//         originalPrice,
//       });

//       const response = await fetch("/api/validate-coupon", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           couponCode: couponCode.trim().toUpperCase(),
//           courseId: courseId,
//           originalPrice: originalPrice,
//           course: actualCourseName,
//           plan: plan,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to validate coupon");
//       }

//       const result = await response.json();
//       console.log("Coupon validation result:", result);

//       return result;
//     } catch (error) {
//       console.error("Error validating coupon from sheet:", error);
//       throw error;
//     }
//   };

//   // Validate coupon when coupon code changes
//   useEffect(() => {
//     if (
//       couponCode &&
//       couponCode.trim().length > 0 &&
//       courseId &&
//       currentPrice > 0
//     ) {
//       const validateCoupon = async () => {
//         setCouponValidating(true);
//         setCouponError("");
//         setCouponDiscount(0);
//         setCouponDiscountPercentage(0);
//         setAppliedCoupon(null);
//         setFinalPrice(currentPrice);

//         try {
//           const result = await validateCouponFromSheet(
//             couponCode,
//             courseId,
//             currentPrice
//           );

//           if (result.success && result.coupon) {
//             const discountAmount =
//               typeof result.pricing.discountAmount === "number"
//                 ? result.pricing.discountAmount
//                 : 0;
//             const savingsPercentage =
//               typeof result.pricing.savingsPercentage === "number"
//                 ? result.pricing.savingsPercentage
//                 : 0;
//             const finalAmount =
//               typeof result.pricing.finalAmount === "number"
//                 ? result.pricing.finalAmount
//                 : currentPrice;

//             setCouponDiscount(discountAmount);
//             setCouponDiscountPercentage(savingsPercentage);
//             setAppliedCoupon(result.coupon);
//             setFinalPrice(finalAmount);
//             setCouponError("");

//             console.log("Coupon applied successfully:", {
//               originalPrice: currentPrice,
//               discountPercentage: savingsPercentage,
//               discountAmount: discountAmount,
//               finalPrice: finalAmount,
//             });
//           } else {
//             setCouponDiscount(0);
//             setCouponDiscountPercentage(0);
//             setAppliedCoupon(null);
//             setFinalPrice(currentPrice);
//             setCouponError(result.message || "Invalid coupon code");
//           }
//         } catch (error) {
//           console.error("Error validating coupon:", error);
//           setCouponError(
//             error.message || "Failed to validate coupon. Please try again."
//           );
//           setCouponDiscount(0);
//           setCouponDiscountPercentage(0);
//           setAppliedCoupon(null);
//           setFinalPrice(currentPrice);
//         } finally {
//           setCouponValidating(false);
//         }
//       };

//       const timeoutId = setTimeout(validateCoupon, 800);
//       return () => clearTimeout(timeoutId);
//     } else {
//       setCouponDiscount(0);
//       setCouponDiscountPercentage(0);
//       setAppliedCoupon(null);
//       setFinalPrice(currentPrice);
//       setCouponError("");
//       setCouponValidating(false);
//     }
//   }, [couponCode, actualCourseName, currentPrice, courseId, plan]);

//   // GSAP animations
//   useGSAP(() => {
//     if (!isSubmitting || !sparkleRef.current) return;

//     const sparkles = sparkleRef.current.querySelectorAll(
//       `.${styles.sparkleDiv}`
//     );

//     sparkles.forEach((sparkle, index) => {
//       const randomX = gsap.utils.random(-5, 5);
//       const randomY = gsap.utils.random(-10, 10);
//       const randomDelay = index * 0.2;
//       const randomDuration = gsap.utils.random(0.6, 1.2);

//       gsap.fromTo(
//         sparkle,
//         {
//           scale: 0.6,
//           opacity: 0,
//           y: 0,
//         },
//         {
//           scale: 1.4,
//           opacity: 1,
//           y: randomY,
//           x: randomX,
//           duration: randomDuration,
//           delay: randomDelay,
//           ease: "sine.inOut",
//           repeat: -1,
//           yoyo: true,
//         }
//       );
//     });
//   }, [isSubmitting]);

//   useGSAP(() => {
//     if (isOpen && formRef.current) {
//       gsap.fromTo(
//         formRef.current,
//         {
//           y: -80,
//           opacity: 0,
//           scale: 0.95,
//         },
//         {
//           y: 0,
//           opacity: 1,
//           scale: 1,
//           duration: 0.7,
//           ease: "back.out(1.7)",
//         }
//       );
//     }
//   }, [isOpen]);

//   // Reset form when closed
//   useEffect(() => {
//     if (!isOpen) {
//       reset();
//       setCouponDiscount(0);
//       setCouponDiscountPercentage(0);
//       setAppliedCoupon(null);
//       setFinalPrice(currentPrice);
//       setCouponError("");
//     }
//   }, [isOpen, reset, currentPrice]);

//   // Load Razorpay SDK
//   const loadRazorpay = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   // Initiate payment
// //   const initiatePayment = async (data) => {
// //     if (!courseId) {
// //       alert("Course ID is missing. Please refresh the page and try again.");
// //       setIsProcessing(false);
// //       return;
// //     }

// //     console.log("Initiating payment with courseId:", courseId);
// //     console.log("Payment details:", {
// //       originalPrice: originalPrice,
// //       currentPrice: currentPrice,
// //       finalPrice: finalPrice,
// //       couponDiscount: couponDiscount,
// //       couponCode: appliedCoupon?.code,
// //       discountPercentage: couponDiscountPercentage,
// //     });

// //     setIsProcessing(true);

// //     try {
// //       if (!razorpayKeyId) {
// //         throw new Error("Razorpay configuration not loaded");
// //       }

// //       const loaded = await loadRazorpay();
// //       if (!loaded) {
// //         throw new Error("Razorpay SDK failed to load");
// //       }

// //       // const orderResponse = await fetch(`/api/create-order`, {
// //       //   method: "POST",
// //       //   headers: {
// //       //     "Content-Type": "application/json",
// //       //   },
// //       //   body: JSON.stringify({
// //       //     amount: finalPrice * 100,
// //       //     currency: pricing?.currency || "INR",
// //       //     course: actualCourseName,
// //       //     plan,
// //       //     studentData: data,
// //       //     couponCode: appliedCoupon ? appliedCoupon.code : null,
// //       //     originalAmount: originalPrice,
// //       //     discountAmount: couponDiscount,
// //       //     discountPercentage: couponDiscountPercentage,
// //       //     courseId: courseId,
// //       //     appliedCoupon: appliedCoupon,
// //       //   }),
// //       // });

// //       // ✅ NEW CODE (Secure):
// // const orderResponse = await fetch(`/api/single-course/create-order`, {
// //   method: "POST",
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// //   body: JSON.stringify({
// //     courseId: courseId,                              // ✅ Only identifier
// //     plan: plan,                                      // ✅ Only identifier
// //     couponCode: appliedCoupon ? appliedCoupon.code : null,  // ✅ Only coupon code
// //     studentData: data,                               // ✅ User data
// //     // ❌ NO amount, NO originalAmount, NO discountAmount
// //   }),
// // });

// //       if (!orderResponse.ok) {
// //         const errorData = await orderResponse.json();
// //         throw new Error(errorData.message || "Failed to create order");
// //       }

// //       const orderData = await orderResponse.json();

// //       let description = `${actualCourseName} - ${plan} Plan`;
// //       if (appliedCoupon) {
// //         description += ` (${appliedCoupon.code} - ${couponDiscountPercentage}% OFF)`;
// //       }

// //       const options = {
// //         key: razorpayKeyId,
// //         amount: orderData.amount,
// //         currency: orderData.currency,
// //         name: "Innoknowvex",
// //         description: description,
// //         order_id: orderData.id,
// //         handler: async function (response) {
// //           try {
// //             const verificationResponse = await fetch(`/api/single-course/verify`, {
// //               method: "POST",
// //               headers: {
// //                 "Content-Type": "application/json",
// //               },
// //               body: JSON.stringify({
// //                 razorpay_order_id: response.razorpay_order_id,
// //                 razorpay_payment_id: response.razorpay_payment_id,
// //                 razorpay_signature: response.razorpay_signature,
// //                 studentData: data,
// //                 course: actualCourseName,
// //                 plan,
// //                 amount: finalPrice,
// //                 originalAmount: originalPrice,
// //                 discountAmount: couponDiscount,
// //                 discountPercentage: couponDiscountPercentage,
// //                 couponCode: appliedCoupon ? appliedCoupon.code : null,
// //                 appliedCoupon: appliedCoupon,
// //                 courseId: courseId,
// //               }),
// //             });

// //             if (verificationResponse.ok) {
// //               const verificationData = await verificationResponse.json();

// //               let successMessage = `🎉 Payment successful! 

// // Welcome to ${actualCourseName} - ${plan} Plan!`;

// //               if (appliedCoupon) {
// //                 successMessage += `

// // 💰 Coupon Details:
// // - Code: ${appliedCoupon.code}
// // - Discount: ${couponDiscountPercentage}% (₹${couponDiscount} saved)
// // - Original Price: ₹${originalPrice}
// // - Final Price: ₹${finalPrice}`;
// //               } else if (originalPrice > currentPrice) {
// //                 const platformDiscount = originalPrice - currentPrice;
// //                 const platformDiscountPercent = Math.round(
// //                   (platformDiscount / originalPrice) * 100
// //                 );
// //                 successMessage += `

// // 💰 Pricing Details:
// // - Original Price: ₹${originalPrice}
// // - Platform Discount: ${platformDiscountPercent}% (₹${platformDiscount} saved)
// // - Final Price: ₹${finalPrice}`;
// //               }

// //               successMessage += `

// // 📧 Your enrollment details have been recorded and you should receive a confirmation email shortly.

// // 🆔 Transaction Details:
// // - Payment ID: ${verificationData.paymentId}
// // - Course ID: ${courseId}
// // - Order ID: ${response.razorpay_order_id}

// // Thank you for choosing Innoknowvex! 🚀`;

// //               alert(successMessage);

// //               reset();
// //               onClose();
// //             } else {
// //               const errorData = await verificationResponse.json();
// //               throw new Error(
// //                 errorData.message || "Payment verification failed"
// //               );
// //             }
// //           } catch (verificationError) {
// //             console.error("Payment verification error:", verificationError);
// //             alert(`Payment completed but verification failed. 

// // Please contact support with your payment details:
// // - Payment ID: ${response.razorpay_payment_id}
// // - Order ID: ${response.razorpay_order_id}
// // - Course ID: ${courseId}
// // ${appliedCoupon ? `• Coupon Applied: ${appliedCoupon.code}` : ""}

// // We will resolve this issue promptly.`);
// //           } finally {
// //             setIsProcessing(false);
// //           }
// //         },
// //         prefill: {
// //           name: data.name,
// //           email: data.email,
// //           contact: data.phone,
// //         },
// //         theme: {
// //           color: "#F37254",
// //         },
// //         modal: {
// //           ondismiss: function () {
// //             setIsProcessing(false);
// //           },
// //         },
// //       };

// //       const rzp = new window.Razorpay(options);
// //       rzp.on("payment.failed", function (response) {
// //         console.error("Payment failed:", response.error);
// //         alert(
// //           `Payment failed: ${response.error.description ||
// //           response.error.reason ||
// //           "Unknown error occurred"
// //           }`
// //         );
// //         setIsProcessing(false);
// //       });

// //       rzp.open();
// //     } catch (error) {
// //       console.error("Payment initiation failed:", error);
// //       alert(`Failed to initiate payment: ${error.message}`);
// //       setIsProcessing(false);
// //     }
// //   };


// // Initiate payment
// const initiatePayment = async (data) => {
//   if (!courseId) {
//     alert("Course ID is missing. Please refresh the page and try again.");
//     setIsProcessing(false);
//     return;
//   }

//   console.log("🚀 Initiating payment with courseId:", courseId);
//   console.log("📦 Sending to backend:", {
//     courseId,
//     plan,
//     couponCode: appliedCoupon ? appliedCoupon.code : null,
//     studentData: data,
//   });

//   setIsProcessing(true);

//   try {
//     if (!razorpayKeyId) {
//       throw new Error("Razorpay configuration not loaded");
//     }

//     const loaded = await loadRazorpay();
//     if (!loaded) {
//       throw new Error("Razorpay SDK failed to load");
//     }

//     // ============================================
//     // STEP 1: Create order (BACKEND CALCULATES PRICE)
//     // ============================================
//     console.log("📡 Calling create-order API...");

//     const orderResponse = await fetch(`/api/single-course/create-order`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         courseId: courseId,           // ✅ Backend will fetch pricing
//         plan: plan,                   // ✅ Backend will determine plan price
//         couponCode: appliedCoupon ? appliedCoupon.code : null, // ✅ Backend will validate
//         studentData: {
//           name: data.name,
//           email: data.email,
//           phone: data.phone,
//         },
//       }),
//     });

//     if (!orderResponse.ok) {
//       const errorData = await orderResponse.json();
//       throw new Error(errorData.message || "Failed to create order");
//     }

//     const orderData = await orderResponse.json();

//     console.log("✅ Order created successfully:", orderData);

//     // Check if order creation was successful
//     if (!orderData.success) {
//       throw new Error(orderData.message || "Order creation failed");
//     }

//     // ============================================
//     // STEP 2: Update UI with backend-calculated prices
//     // ============================================
//     // Update local state with prices from backend (for display only)
//     if (orderData.pricing) {
//       setOriginalPrice(orderData.pricing.originalPrice || 0);
//       setCurrentPrice(orderData.pricing.currentPrice || 0);
//       setFinalPrice(orderData.pricing.finalPrice || 0);
//       setCouponDiscount(orderData.pricing.couponDiscount || 0);
//       setCouponDiscountPercentage(orderData.pricing.couponDiscountPercentage || 0);

//       console.log("💰 Prices updated from backend:", {
//         original: orderData.pricing.originalPrice,
//         current: orderData.pricing.currentPrice,
//         final: orderData.pricing.finalPrice,
//         couponDiscount: orderData.pricing.couponDiscount,
//       });
//     }

//     // ============================================
//     // STEP 3: Build payment description
//     // ============================================
//     let description = `${orderData.courseDetails?.title || actualCourseName} - ${plan} Plan`;
//     if (orderData.appliedCoupon) {
//       description += ` (${orderData.appliedCoupon.code} - ${orderData.pricing.couponDiscountPercentage}% OFF)`;
//     }

//     // ============================================
//     // STEP 4: Initialize Razorpay with backend order
//     // ============================================
//     const options = {
//       key: razorpayKeyId,
//       amount: orderData.amount,      // ✅ Backend-calculated amount
//       currency: orderData.currency,   // ✅ Backend-set currency
//       name: "Innoknowvex",
//       description: description,
//       order_id: orderData.orderId,    // ✅ Backend-generated order ID

//       // ============================================
//       // STEP 5: Payment success handler
//       // ============================================
//       handler: async function (response) {
//         try {
//           console.log("💳 Payment completed, verifying...");

//           // Verify payment with backend
//           const verificationResponse = await fetch(`/api/single-course/verify`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               studentData: data,
//               course: orderData.courseDetails?.title || actualCourseName,
//               plan: plan,
//               amount: orderData.pricing?.finalPrice || finalPrice,
//               originalAmount: orderData.pricing?.originalPrice || originalPrice,
//               discountAmount: orderData.pricing?.couponDiscount || couponDiscount,
//               discountPercentage: orderData.pricing?.couponDiscountPercentage || couponDiscountPercentage,
//               couponCode: orderData.appliedCoupon ? orderData.appliedCoupon.code : null,
//               appliedCoupon: orderData.appliedCoupon,
//               courseId: courseId,
//             }),
//           });

//           if (verificationResponse.ok) {
//             const verificationData = await verificationResponse.json();

//             console.log("✅ Payment verified successfully:", verificationData);

//             // Build success message
//             let successMessage = `🎉 Payment successful! 

// Welcome to ${orderData.courseDetails?.title || actualCourseName} - ${plan} Plan!`;

//             if (orderData.appliedCoupon) {
//               successMessage += `

// 💰 Coupon Details:
// - Code: ${orderData.appliedCoupon.code}
// - Discount: ${orderData.pricing.couponDiscountPercentage}% (₹${orderData.pricing.couponDiscount} saved)
// - Original Price: ₹${orderData.pricing.originalPrice}
// - Final Price: ₹${orderData.pricing.finalPrice}`;
//             } else if (orderData.pricing.platformDiscount > 0) {
//               successMessage += `

// 💰 Pricing Details:
// - Original Price: ₹${orderData.pricing.originalPrice}
// - Platform Discount: ${orderData.pricing.platformDiscountPercentage}% (₹${orderData.pricing.platformDiscount} saved)
// - Final Price: ₹${orderData.pricing.finalPrice}`;
//             }

//             if (orderData.pricing.totalSavings > 0) {
//               successMessage += `

// 💸 Total Savings: ₹${orderData.pricing.totalSavings} (${orderData.pricing.totalSavingsPercentage}% off)`;
//             }

//             successMessage += `

// 📧 Your enrollment details have been recorded and you should receive a confirmation email shortly.

// 🆔 Transaction Details:
// - Payment ID: ${verificationData.data?.paymentId || response.razorpay_payment_id}
// - Course ID: ${courseId}
// - Order ID: ${response.razorpay_order_id}

// Thank you for choosing Innoknowvex! 🚀`;

//             alert(successMessage);

//             reset();
//             onClose();
//           } else {
//             const errorData = await verificationResponse.json();
//             throw new Error(
//               errorData.message || "Payment verification failed"
//             );
//           }
//         } catch (verificationError) {
//           console.error("❌ Payment verification error:", verificationError);
//           alert(`Payment completed but verification failed. 

// Please contact support with your payment details:
// - Payment ID: ${response.razorpay_payment_id}
// - Order ID: ${response.razorpay_order_id}
// - Course ID: ${courseId}
// ${orderData.appliedCoupon ? `• Coupon Applied: ${orderData.appliedCoupon.code}` : ""}

// We will resolve this issue promptly.`);
//         } finally {
//           setIsProcessing(false);
//         }
//       },

//       // Pre-fill user data
//       prefill: {
//         name: data.name,
//         email: data.email,
//         contact: data.phone,
//       },

//       // Theme
//       theme: {
//         color: "#F37254",
//       },

//       // Modal dismiss handler
//       modal: {
//         ondismiss: function () {
//           console.log("⚠️ Payment modal closed by user");
//           setIsProcessing(false);
//         },
//       },
//     };

//     // ============================================
//     // STEP 6: Open Razorpay checkout
//     // ============================================
//     const rzp = new window.Razorpay(options);

//     rzp.on("payment.failed", function (response) {
//       console.error("❌ Payment failed:", response.error);
//       alert(
//         `Payment failed: ${
//           response.error.description ||
//           response.error.reason ||
//           "Unknown error occurred"
//         }`
//       );
//       setIsProcessing(false);
//     });

//     console.log("🎬 Opening Razorpay modal...");
//     rzp.open();

//   } catch (error) {
//     console.error("❌ Payment initiation failed:", error);
//     alert(`Failed to initiate payment: ${error.message}`);
//     setIsProcessing(false);
//   }
// };

//   // Form submit handler
//   const onSubmit = async (data) => {
//     if (!courseId) {
//       alert("Course ID is missing. Please refresh the page and try again.");
//       return;
//     }

//     if (isNaN(finalPrice) || finalPrice < 0) {
//       alert("Invalid final price. Please refresh and try again.");
//       return;
//     }

//     console.log("Submitting form with courseId:", courseId);
//     console.log("Final submission data:", {
//       ...data,
//       courseId,
//       originalPrice,
//       currentPrice,
//       finalPrice,
//       couponApplied: !!appliedCoupon,
//       couponCode: appliedCoupon?.code,
//       discountAmount: couponDiscount,
//       discountPercentage: couponDiscountPercentage,
//     });

//     await initiatePayment(data);
//   };

//   if (!isOpen) {
//     return null;
//   }

//   // Calculate platform discount if exists
//   const platformDiscount =
//     originalPrice > currentPrice ? originalPrice - currentPrice : 0;
//   const platformDiscountPercent =
//     originalPrice > 0
//       ? Math.round((platformDiscount / originalPrice) * 100)
//       : 0;

//   return (
//     <div className={styles.formPage}>
//       <div className={styles.overlay} onClick={onClose}></div>
//       <form
//         className={styles.formWrapper}
//         onSubmit={handleSubmit(onSubmit)}
//         ref={formRef}
//       >
//         <div className={styles.formHeaderContainer}>
//           <h1>
//             Enroll in {actualCourseName}
//             <br />
//             <span>{plan} Plan</span>
//           </h1>
//           <button
//             type="button"
//             className={styles.closeButton}
//             onClick={onClose}
//           >
//             <Icon
//               icon="icon-park-solid:close-one"
//               style={{ width: "100%", height: "100%", color: "#9c7f16" }}
//             />
//           </button>
//         </div>

//         {pricingLoading ? (
//           <div className={styles.courseInfo}>
//             <p>Loading pricing information...</p>
//           </div>
//         ) : pricingError ? (
//           <div className={styles.courseInfo}>
//             <p style={{ color: "#ef4444" }}>⚠️ {pricingError}</p>
//             {originalPrice > 0 && (
//               <p>
//                 <strong>Amount:</strong> ₹{originalPrice}
//               </p>
//             )}
//           </div>
//         ) : (
//           <div className={styles.courseInfo}>
//             <p>
//               <strong>Plan:</strong> {plan}
//             </p>
//             {programDetails && (
//               <>
//                 <p>
//                   <strong>Program:</strong> {programDetails.title}
//                 </p>
//                 {programDetails.category && (
//                   <p>
//                     <strong>Category:</strong> {programDetails.category}
//                   </p>
//                 )}
//               </>
//             )}

//             {originalPrice > currentPrice && (
//               <p>
//                 <strong>List Price:</strong>{" "}
//                 <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
//                   ₹{originalPrice}
//                 </span>
//               </p>
//             )}

//             {platformDiscount > 0 && !appliedCoupon && (
//               <>
//                 <p style={{ color: "#22c55e" }}>
//                   <strong>
//                     Platform Discount ({platformDiscountPercent}%):
//                   </strong>{" "}
//                   -₹{platformDiscount}
//                 </p>
//                 <p>
//                   <strong>Price:</strong> ₹{currentPrice}
//                 </p>
//               </>
//             )}

//             {platformDiscount === 0 && !appliedCoupon && (
//               <p>
//                 <strong>Price:</strong> ₹{currentPrice}
//               </p>
//             )}

//             {couponDiscount > 0 && (
//               <>
//                 <p>
//                   <strong>Base Price:</strong> ₹{currentPrice}
//                 </p>
//                 <p style={{ color: "#22c55e" }}>
//                   <strong>
//                     Coupon Discount ({couponDiscountPercentage}%):
//                   </strong>{" "}
//                   -₹{couponDiscount}
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "1.1em",
//                     fontWeight: "bold",
//                     color: "#3b82f6",
//                   }}
//                 >
//                   <strong>Final Amount:</strong> ₹{finalPrice}
//                 </p>
//                 {originalPrice > finalPrice && (
//                   <p style={{ color: "#22c55e", fontSize: "0.9em" }}>
//                     💰 Total Savings: ₹{originalPrice - finalPrice} (
//                     {Math.round(
//                       ((originalPrice - finalPrice) / originalPrice) * 100
//                     )}
//                     %)
//                   </p>
//                 )}
//               </>
//             )}

//             {couponDiscount === 0 && platformDiscount > 0 && (
//               <p style={{ fontSize: "1.1em", fontWeight: "bold" }}>
//                 <strong>Final Amount:</strong> ₹{finalPrice}
//               </p>
//             )}
//           </div>
//         )}

//         <fieldset
//           className={`${styles.inputGroup} ${styles["inputGroup--name"]}`}
//         >
//           <label className={styles.formLabel}>Name</label>
//           <input
//             className={styles.formInput}
//             {...register("name")}
//             placeholder="Enter your full name"
//           />
//           <div className={styles.errorDiv}>
//             {errors.name && (
//               <p className={styles.error}>{errors.name.message}</p>
//             )}
//           </div>
//         </fieldset>

//         <fieldset
//           className={`${styles.inputGroup} ${styles["inputGroup--email"]}`}
//         >
//           <label className={styles.formLabel}>Email</label>
//           <input
//             className={styles.formInput}
//             {...register("email")}
//             placeholder="Enter your email address"
//             type="email"
//           />
//           <div className={styles.errorDiv}>
//             {errors.email && (
//               <p className={styles.error}>{errors.email.message}</p>
//             )}
//           </div>
//         </fieldset>

//         <fieldset
//           className={`${styles.inputGroup} ${styles["inputGroup--phone"]}`}
//         >
//           <label className={styles.formLabel}>Phone</label>
//           <input
//             className={styles.formInput}
//             {...register("phone")}
//             placeholder="Enter 10-digit phone number"
//             type="tel"
//           />
//           <div className={styles.errorDiv}>
//             {errors.phone && (
//               <p className={styles.error}>{errors.phone.message}</p>
//             )}
//           </div>
//         </fieldset>

//         <fieldset
//           className={`${styles.inputGroup} ${styles["inputGroup--coupon"]}`}
//         >
//           <label className={styles.formLabel}>Coupon Code (Optional)</label>
//           <input
//             className={styles.formInput}
//             {...register("couponCode")}
//             placeholder="Enter coupon code"
//             type="text"
//           />
//           <div className={styles.errorDiv}>
//             {couponValidating && (
//               <p style={{ color: "#3b82f6" }}>🔍 Validating coupon...</p>
//             )}
//             {couponError && <p className={styles.error}>❌ {couponError}</p>}
//             {appliedCoupon && !couponValidating && (
//               <p style={{ color: "#22c55e" }}>
//                 ✅ Coupon applied! {couponDiscountPercentage}% discount (₹
//                 {couponDiscount} saved)
//               </p>
//             )}
//           </div>
//         </fieldset>

//         <div className={styles.buttonGroup} ref={sparkleRef}>
//           <button
//             type="submit"
//             disabled={
//               isSubmitting ||
//               isProcessing ||
//               !razorpayKeyId ||
//               couponValidating ||
//               programsLoading ||
//               pricingLoading ||
//               finalPrice <= 0
//             }
//           >
//             {isSubmitting || isProcessing ? (
//               <>
//                 <div className={styles.sparkleDiv}>
//                   <Sparkle color="white" />
//                 </div>
//                 <div className={styles.sparkleDiv}>
//                   <Sparkle color="white" />
//                 </div>
//                 <div className={styles.sparkleDiv}>
//                   <Sparkle color="white" />
//                 </div>
//                 Processing Payment...
//               </>
//             ) : !razorpayKeyId ? (
//               "Loading Payment Gateway..."
//             ) : programsLoading ? (
//               "Loading Programs..."
//             ) : pricingLoading ? (
//               "Loading Pricing..."
//             ) : couponValidating ? (
//               "Validating Coupon..."
//             ) : finalPrice <= 0 ? (
//               "Invalid Price"
//             ) : (
//               <>
//                 {couponDiscount > 0 || platformDiscount > 0 ? (
//                   <>
//                     Pay ₹{finalPrice}
//                     <span
//                       style={{
//                         textDecoration: "line-through",
//                         opacity: 0.7,
//                         marginLeft: "8px",
//                         fontSize: "0.9em",
//                       }}
//                     >
//                       ₹{originalPrice}
//                     </span>
//                   </>
//                 ) : (
//                   `Pay ₹${finalPrice}`
//                 )}
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PopUpForm;



"use client";
import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Sparkle from "../../../../Common/Icons/Sparkle";
import styles from "./styles/popupForm.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Import your API functions
import {
  getProgramById,
  getPrograms,
} from "@/app/(backend)/api/programs/programs";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  couponCode: z.string().optional(),
});

const PopUpForm = ({
  isOpen,
  onClose,
  plan,
  course,
  price: propPrice,
  courseId: propCourseId,
}) => {
  console.log("🟢 [POPUP] Render state:", { isOpen, plan, course, price: propPrice });

  const formRef = useRef(null);
  const sparkleRef = useRef(null);

  // Form state
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState(null);

  // Coupon state
  const [couponValidating, setCouponValidating] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponDiscountPercentage, setCouponDiscountPercentage] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Course/Program state
  const [courseId, setCourseId] = useState(null);
  const [actualCourseName, setActualCourseName] = useState(course);
  const [programDetails, setProgramDetails] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);

  // Pricing state
  const [pricing, setPricing] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [pricingError, setPricingError] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      couponCode: "",
    },
  });

  const couponCode = watch("couponCode");

  // Fetch all programs with pricing on mount
  useEffect(() => {
    const fetchAllPrograms = async () => {
      try {
        setProgramsLoading(true);
        const allPrograms = await getPrograms();
        setPrograms(allPrograms);
        console.log(
          "Fetched programs with pricing from database:",
          allPrograms
        );
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setProgramsLoading(false);
      }
    };

    fetchAllPrograms();
  }, []);

  // Enhanced course ID extraction
  useEffect(() => {
    if (programsLoading || programs.length === 0) {
      return;
    }

    const extractCourseId = async () => {
      console.log("Starting enhanced course ID extraction...");
      console.log(
        "Available programs:",
        programs.map((p) => p.id)
      );

      // Method 1: Use prop if provided and valid
      if (propCourseId && propCourseId.trim() && propCourseId !== "programs") {
        console.log("Using courseId from props:", propCourseId);
        const program = programs.find((p) => p.id === propCourseId);
        if (program) {
          setCourseId(propCourseId);
          setProgramDetails(program);
          setActualCourseName(program.title);
          console.log("Found program in database:", program);
          return;
        }
      }

      // Method 2: Extract from current URL
      if (typeof window !== "undefined") {
        const currentUrl = window.location.href;
        console.log("Current URL:", currentUrl);

        const url = new URL(currentUrl);
        const urlParams = url.searchParams;

        const paramNames = [
          "courseId",
          "course_id",
          "id",
          "cid",
          "courseID",
          "course",
        ];
        for (const param of paramNames) {
          const value = urlParams.get(param);
          if (value && value.trim() && value.toLowerCase() !== "programs") {
            const program = programs.find((p) => p.id === value.trim());
            if (program) {
              console.log(
                `Found valid courseId in URL param '${param}':`,
                value
              );
              setCourseId(value.trim());
              setProgramDetails(program);
              setActualCourseName(program.title);
              return;
            }
          }
        }

        const pathname = url.pathname;
        console.log("Pathname:", pathname);

        const pathParts = pathname
          .split("/")
          .filter((part) => part && part.trim());
        console.log("Path parts:", pathParts);

        for (const part of pathParts) {
          const program = programs.find((p) => p.id === part);
          if (program) {
            console.log("Found exact program match in path:", part);
            setCourseId(part);
            setProgramDetails(program);
            setActualCourseName(program.title);
            return;
          }
        }

        if (url.hash) {
          const hashParams = new URLSearchParams(url.hash.substring(1));
          for (const param of paramNames) {
            const value = hashParams.get(param);
            if (value && value.trim()) {
              const program = programs.find((p) => p.id === value.trim());
              if (program) {
                console.log(
                  `Found valid courseId in hash param '${param}':`,
                  value
                );
                setCourseId(value.trim());
                setProgramDetails(program);
                setActualCourseName(program.title);
                return;
              }
            }
          }
        }
      }

      // Method 3: Map course name to program ID
      if (course && typeof course === "string") {
        console.log("Mapping course name to program ID:", course);

        const courseLower = course.toLowerCase().trim();

        const directMatch = programs.find(
          (p) => p.title && p.title.toLowerCase() === courseLower
        );

        if (directMatch) {
          console.log("Found direct title match:", directMatch.id);
          setCourseId(directMatch.id);
          setProgramDetails(directMatch);
          setActualCourseName(directMatch.title);
          return;
        }

        const partialMatch = programs.find((p) => {
          const programTitle = p.title.toLowerCase();
          return (
            programTitle.includes(courseLower) ||
            courseLower.includes(programTitle)
          );
        });

        if (partialMatch) {
          console.log("Found partial title match:", partialMatch.id);
          setCourseId(partialMatch.id);
          setProgramDetails(partialMatch);
          setActualCourseName(partialMatch.title);
          return;
        }
      }

      // Fallback
      if (programs.length > 0) {
        const fallbackProgram = programs[0];
        console.log(
          "Using first available program as fallback:",
          fallbackProgram.id
        );
        setCourseId(fallbackProgram.id);
        setProgramDetails(fallbackProgram);
        setActualCourseName(fallbackProgram.title);
        return;
      }

      const finalFallback = `course-${Date.now()}`;
      console.log("Using final timestamp fallback courseId:", finalFallback);
      setCourseId(finalFallback);
      setActualCourseName(course || "Course");
    };

    extractCourseId();
  }, [propCourseId, course, programs, programsLoading]);

  // Fetch program with pricing data when courseId is available
  useEffect(() => {
    if (!courseId) return;

    const fetchProgramWithPricing = async () => {
      try {
        setPricingLoading(true);
        setPricingError(null);

        console.log(
          "Fetching program with pricing for courseId:",
          courseId,
          "Plan:",
          plan
        );

        // Get program with combined pricing data
        const programData = await getProgramById(courseId);

        if (!programData) {
          throw new Error("Program not found");
        }

        console.log("Fetched program data:", programData);

        setProgramDetails(programData);
        setActualCourseName(programData.title);

        // Extract pricing based on plan
        let actualPrice = 0;
        let discountedPrice = 0;

        if (programData.pricing) {
          const planLower = plan.toLowerCase();

          console.log("🔍 Extracting prices for plan:", planLower);

          if (planLower === "self" || planLower === "self-paced") {
            actualPrice = programData.pricing.self_actual_price || 0;
            discountedPrice = programData.pricing.self_current_price || 0;
            console.log("💰 Self-Paced prices:", { actualPrice, discountedPrice });
          } else if (planLower === "mentor" || planLower === "mentor-led") {
            actualPrice = programData.pricing.mentor_actual_price || 0;
            discountedPrice = programData.pricing.mentor_current_price || 0;
            console.log("💰 Mentor-Led prices:", { actualPrice, discountedPrice });
          } else if (planLower === "professional") {
            actualPrice = programData.pricing.professional_actual_price || 0;
            discountedPrice =
              programData.pricing.professional_current_price || 0;
            console.log("💰 Professional prices:", { actualPrice, discountedPrice });
          } else {
            console.warn("⚠️ Unknown plan type:", plan);
          }
        }

        // Use prop price as fallback
        if (actualPrice === 0 && propPrice) {
          actualPrice = propPrice;
          discountedPrice = propPrice;
          console.log("Using prop price as fallback:", propPrice);
        }

        setOriginalPrice(actualPrice);
        setCurrentPrice(discountedPrice);
        setFinalPrice(discountedPrice);

        // Store the full pricing object for reference
        setPricing({
          ...programData.pricing,
          success: true,
          course_name: programData.title,
          course_id: programData.id,
          currency: programData.pricing?.currency || "INR",
        });

        console.log("✅ Prices set:", {
          plan,
          originalPrice: actualPrice,
          currentPrice: discountedPrice,
          finalPrice: discountedPrice,
          programTitle: programData.title,
        });
      } catch (error) {
        console.error("Error fetching program with pricing:", error);
        setPricingError(error.message);

        // Fallback to prop price
        if (propPrice) {
          setOriginalPrice(propPrice);
          setCurrentPrice(propPrice);
          setFinalPrice(propPrice);
          console.log("Using prop price due to error:", propPrice);
        }
      } finally {
        setPricingLoading(false);
      }
    };

    fetchProgramWithPricing();
  }, [courseId, plan, propPrice]);

  // Fetch Razorpay key ID
  useEffect(() => {
    const fetchRazorpayConfig = async () => {
      try {
        const response = await fetch("/api/config");
        if (response.ok) {
          const config = await response.json();
          setRazorpayKeyId(config.razorpayKeyId);
        }
      } catch (error) {
        console.error("Failed to fetch Razorpay config:", error);
      }
    };

    fetchRazorpayConfig();
  }, []);

  // Coupon validation
  const validateCouponFromSheet = async (
    couponCode,
    courseId,
    originalPrice
  ) => {
    try {
      console.log("Validating coupon from sheet:", {
        couponCode,
        courseId,
        originalPrice,
      });

      const response = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          couponCode: couponCode.trim().toUpperCase(),
          courseId: courseId,
          originalPrice: originalPrice,
          course: actualCourseName,
          plan: plan,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to validate coupon");
      }

      const result = await response.json();
      console.log("Coupon validation result:", result);

      return result;
    } catch (error) {
      console.error("Error validating coupon from sheet:", error);
      throw error;
    }
  };

  // Validate coupon when coupon code changes
  useEffect(() => {
    if (
      couponCode &&
      couponCode.trim().length > 0 &&
      courseId &&
      currentPrice > 0
    ) {
      const validateCoupon = async () => {
        setCouponValidating(true);
        setCouponError("");
        setCouponDiscount(0);
        setCouponDiscountPercentage(0);
        setAppliedCoupon(null);
        setFinalPrice(currentPrice);

        try {
          const result = await validateCouponFromSheet(
            couponCode,
            courseId,
            currentPrice
          );

          if (result.success && result.coupon) {
            const discountAmount =
              typeof result.pricing.discountAmount === "number"
                ? result.pricing.discountAmount
                : 0;
            const savingsPercentage =
              typeof result.pricing.savingsPercentage === "number"
                ? result.pricing.savingsPercentage
                : 0;
            const finalAmount =
              typeof result.pricing.finalAmount === "number"
                ? result.pricing.finalAmount
                : currentPrice;

            setCouponDiscount(discountAmount);
            setCouponDiscountPercentage(savingsPercentage);
            setAppliedCoupon(result.coupon);
            setFinalPrice(finalAmount);
            setCouponError("");

            console.log("Coupon applied successfully:", {
              originalPrice: currentPrice,
              discountPercentage: savingsPercentage,
              discountAmount: discountAmount,
              finalPrice: finalAmount,
            });
          } else {
            setCouponDiscount(0);
            setCouponDiscountPercentage(0);
            setAppliedCoupon(null);
            setFinalPrice(currentPrice);
            setCouponError(result.message || "Invalid coupon code");
          }
        } catch (error) {
          console.error("Error validating coupon:", error);
          setCouponError(
            error.message || "Failed to validate coupon. Please try again."
          );
          setCouponDiscount(0);
          setCouponDiscountPercentage(0);
          setAppliedCoupon(null);
          setFinalPrice(currentPrice);
        } finally {
          setCouponValidating(false);
        }
      };

      const timeoutId = setTimeout(validateCoupon, 800);
      return () => clearTimeout(timeoutId);
    } else {
      setCouponDiscount(0);
      setCouponDiscountPercentage(0);
      setAppliedCoupon(null);
      setFinalPrice(currentPrice);
      setCouponError("");
      setCouponValidating(false);
    }
  }, [couponCode, actualCourseName, currentPrice, courseId, plan]);

  // GSAP animations
  useGSAP(() => {
    if (!isSubmitting || !sparkleRef.current) return;

    const sparkles = sparkleRef.current.querySelectorAll(
      `.${styles.sparkleDiv}`
    );

    sparkles.forEach((sparkle, index) => {
      const randomX = gsap.utils.random(-5, 5);
      const randomY = gsap.utils.random(-10, 10);
      const randomDelay = index * 0.2;
      const randomDuration = gsap.utils.random(0.6, 1.2);

      gsap.fromTo(
        sparkle,
        {
          scale: 0.6,
          opacity: 0,
          y: 0,
        },
        {
          scale: 1.4,
          opacity: 1,
          y: randomY,
          x: randomX,
          duration: randomDuration,
          delay: randomDelay,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      );
    });
  }, [isSubmitting]);

  useGSAP(() => {
    if (isOpen && formRef.current) {
      gsap.fromTo(
        formRef.current,
        {
          y: -80,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [isOpen]);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      reset();
      setCouponDiscount(0);
      setCouponDiscountPercentage(0);
      setAppliedCoupon(null);
      setFinalPrice(currentPrice);
      setCouponError("");
    }
  }, [isOpen, reset, currentPrice]);

  // Load Razorpay SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initiate payment
  const initiatePayment = async (data) => {
    if (!courseId) {
      alert("Course ID is missing. Please refresh the page and try again.");
      setIsProcessing(false);
      return;
    }

    console.log("🚀 Initiating payment with courseId:", courseId);
    console.log("📦 Sending to backend:", {
      courseId,
      plan,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      studentData: data,
    });

    setIsProcessing(true);

    try {
      if (!razorpayKeyId) {
        throw new Error("Razorpay configuration not loaded");
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // ============================================
      // STEP 1: Create order (BACKEND CALCULATES PRICE)
      // ============================================
      console.log("📡 Calling create-order API...");

      const orderResponse = await fetch(`/api/single-course/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          plan: plan,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          studentData: {
            name: data.name,
            email: data.email,
            phone: data.phone,
          },
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const orderData = await orderResponse.json();

      console.log("✅ Order created successfully:", orderData);

      if (!orderData.success) {
        throw new Error(orderData.message || "Order creation failed");
      }

      // ============================================
      // STEP 2: Update UI with backend-calculated prices
      // ============================================
      if (orderData.pricing) {
        setOriginalPrice(orderData.pricing.originalPrice || 0);
        setCurrentPrice(orderData.pricing.currentPrice || 0);
        setFinalPrice(orderData.pricing.finalPrice || 0);
        setCouponDiscount(orderData.pricing.couponDiscount || 0);
        setCouponDiscountPercentage(orderData.pricing.couponDiscountPercentage || 0);

        console.log("💰 Prices updated from backend:", {
          original: orderData.pricing.originalPrice,
          current: orderData.pricing.currentPrice,
          final: orderData.pricing.finalPrice,
          couponDiscount: orderData.pricing.couponDiscount,
        });
      }

      // ============================================
      // STEP 3: Build payment description
      // ============================================
      let description = `${orderData.courseDetails?.title || actualCourseName} - ${plan} Plan`;
      if (orderData.appliedCoupon) {
        description += ` (${orderData.appliedCoupon.code} - ${orderData.pricing.couponDiscountPercentage}% OFF)`;
      }

      // ============================================
      // STEP 4: Initialize Razorpay
      // ============================================
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Innoknowvex",
        description: description,
        order_id: orderData.orderId,

        handler: async function (response) {
          try {
            console.log("💳 Payment completed, verifying...");

            const verificationResponse = await fetch(`/api/single-course/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                studentData: data,
                course: orderData.courseDetails?.title || actualCourseName,
                plan: plan,
                amount: orderData.pricing?.finalPrice || finalPrice,
                originalAmount: orderData.pricing?.originalPrice || originalPrice,
                discountAmount: orderData.pricing?.couponDiscount || couponDiscount,
                discountPercentage: orderData.pricing?.couponDiscountPercentage || couponDiscountPercentage,
                couponCode: orderData.appliedCoupon ? orderData.appliedCoupon.code : null,
                appliedCoupon: orderData.appliedCoupon,
                courseId: courseId,
              }),
            });

            if (verificationResponse.ok) {
              const verificationData = await verificationResponse.json();

              console.log("✅ Payment verified successfully:", verificationData);

              let successMessage = `🎉 Payment successful! 
              
Welcome to ${orderData.courseDetails?.title || actualCourseName} - ${plan} Plan!`;

              if (orderData.appliedCoupon) {
                successMessage += `

💰 Coupon Details:
- Code: ${orderData.appliedCoupon.code}
- Discount: ${orderData.pricing.couponDiscountPercentage}% (₹${orderData.pricing.couponDiscount.toFixed(2)} saved)
- Original Price: ₹${orderData.pricing.originalPrice.toFixed(2)}
- Final Price: ₹${orderData.pricing.finalPrice.toFixed(2)}`;
              } else if (orderData.pricing.platformDiscount > 0) {
                successMessage += `

💰 Pricing Details:
- Original Price: ₹${orderData.pricing.originalPrice.toFixed(2)}
- Platform Discount: ${orderData.pricing.platformDiscountPercentage}% (₹${orderData.pricing.platformDiscount.toFixed(2)} saved)
- Final Price: ₹${orderData.pricing.finalPrice.toFixed(2)}`;
              }

              if (orderData.pricing.totalSavings > 0) {
                successMessage += `

💸 Total Savings: ₹${orderData.pricing.totalSavings.toFixed(2)} (${orderData.pricing.totalSavingsPercentage}% off)`;
              }

              successMessage += `

📧 Your enrollment details have been recorded and you should receive a confirmation email shortly.

🆔 Transaction Details:
- Payment ID: ${verificationData.data?.paymentId || response.razorpay_payment_id}
- Course ID: ${courseId}
- Order ID: ${response.razorpay_order_id}

Thank you for choosing Innoknowvex! 🚀`;

              alert(successMessage);
              reset();
              onClose();
            } else {
              const errorData = await verificationResponse.json();
              throw new Error(errorData.message || "Payment verification failed");
            }
          } catch (verificationError) {
            console.error("❌ Payment verification error:", verificationError);
            alert(`Payment completed but verification failed. 
            
Please contact support with your payment details:
- Payment ID: ${response.razorpay_payment_id}
- Order ID: ${response.razorpay_order_id}
- Course ID: ${courseId}
${orderData.appliedCoupon ? `• Coupon Applied: ${orderData.appliedCoupon.code}` : ""}

We will resolve this issue promptly.`);
          } finally {
            setIsProcessing(false);
          }
        },

        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },

        theme: {
          color: "#F37254",
        },

        modal: {
          ondismiss: function () {
            console.log("⚠️ Payment modal closed by user");
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("❌ Payment failed:", response.error);
        alert(
          `Payment failed: ${response.error.description ||
          response.error.reason ||
          "Unknown error occurred"
          }`
        );
        setIsProcessing(false);
      });

      console.log("🎬 Opening Razorpay modal...");
      rzp.open();

    } catch (error) {
      console.error("❌ Payment initiation failed:", error);
      alert(`Failed to initiate payment: ${error.message}`);
      setIsProcessing(false);
    }
  };

  // Form submit handler
  const onSubmit = async (data) => {
    if (!courseId) {
      alert("Course ID is missing. Please refresh the page and try again.");
      return;
    }

    if (isNaN(finalPrice) || finalPrice < 0) {
      alert("Invalid final price. Please refresh and try again.");
      return;
    }

    console.log("Submitting form with courseId:", courseId);
    console.log("Final submission data:", {
      ...data,
      courseId,
      originalPrice,
      currentPrice,
      finalPrice,
      couponApplied: !!appliedCoupon,
      couponCode: appliedCoupon?.code,
      discountAmount: couponDiscount,
      discountPercentage: couponDiscountPercentage,
    });

    await initiatePayment(data);
  };

  if (!isOpen) {
    return null;
  }

  // Calculate platform discount
  const platformDiscount =
    originalPrice > currentPrice ? originalPrice - currentPrice : 0;
  const platformDiscountPercent =
    originalPrice > 0
      ? Math.round((platformDiscount / originalPrice) * 100)
      : 0;

  return (
    <div className={styles.formPage}>
      <div className={styles.overlay} onClick={onClose}></div>
      <form
        className={styles.formWrapper}
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
      >
        <div className={styles.formHeaderContainer}>
          <h1>
            Enroll in {actualCourseName}
            <br />
            <span>{plan} Plan</span>
          </h1>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <Icon
              icon="icon-park-solid:close-one"
              style={{ width: "100%", height: "100%", color: "#9c7f16" }}
            />
          </button>
        </div>

        {pricingLoading ? (
          <div className={styles.courseInfo}>
            <p>Loading pricing information...</p>
          </div>
        ) : pricingError ? (
          <div className={styles.courseInfo}>
            <p style={{ color: "#ef4444" }}>⚠️ {pricingError}</p>
            {originalPrice > 0 && (
              <p>
                <strong>Amount:</strong> ₹{originalPrice.toFixed(2)}
              </p>
            )}
          </div>
        ) : (
          <div className={styles.courseInfo}>
            <p>
              <strong>Plan:</strong> {plan}
            </p>
            {programDetails && (
              <>
                <p>
                  <strong>Program:</strong> {programDetails.title}
                </p>
                {programDetails.category && (
                  <p>
                    <strong>Category:</strong> {programDetails.category}
                  </p>
                )}
              </>
            )}

            {originalPrice > currentPrice && (
              <p>
                <strong>List Price:</strong>{" "}
                <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
                  ₹{originalPrice.toFixed(2)}
                </span>
              </p>
            )}

            {platformDiscount > 0 && !appliedCoupon && (
              <>
                <p style={{ color: "#22c55e" }}>
                  <strong>
                    Platform Discount ({platformDiscountPercent}%):
                  </strong>{" "}
                  -₹{platformDiscount.toFixed(2)}
                </p>
                <p>
                  <strong>Price:</strong> ₹{currentPrice.toFixed(2)}
                </p>
              </>
            )}

            {platformDiscount === 0 && !appliedCoupon && (
              <p>
                <strong>Price:</strong> ₹{currentPrice.toFixed(2)}
              </p>
            )}

            {couponDiscount > 0 && (
              <>
                <p>
                  <strong>Base Price:</strong> ₹{currentPrice.toFixed(2)}
                </p>
                <p style={{ color: "#22c55e" }}>
                  <strong>
                    Coupon Discount ({couponDiscountPercentage}%):
                  </strong>{" "}
                  -₹{couponDiscount.toFixed(2)}
                </p>
                <p
                  style={{
                    fontSize: "1.1em",
                    fontWeight: "bold",
                    color: "#3b82f6",
                  }}
                >
                  <strong>Final Amount:</strong> ₹{finalPrice.toFixed(2)}
                </p>
                {originalPrice > finalPrice && (
                  <p style={{ color: "#22c55e", fontSize: "0.9em" }}>
                    💰 Total Savings: ₹{(originalPrice - finalPrice).toFixed(2)} (
                    {Math.round(
                      ((originalPrice - finalPrice) / originalPrice) * 100
                    )}
                    %)
                  </p>
                )}
              </>
            )}

            {couponDiscount === 0 && platformDiscount > 0 && (
              <p style={{ fontSize: "1.1em", fontWeight: "bold" }}>
                <strong>Final Amount:</strong> ₹{finalPrice.toFixed(2)}
              </p>
            )}
          </div>
        )}

        <fieldset
          className={`${styles.inputGroup} ${styles["inputGroup--name"]}`}
        >
          <label className={styles.formLabel}>Name</label>
          <input
            className={styles.formInput}
            {...register("name")}
            placeholder="Enter your full name"
          />
          <div className={styles.errorDiv}>
            {errors.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </div>
        </fieldset>

        <fieldset
          className={`${styles.inputGroup} ${styles["inputGroup--email"]}`}
        >
          <label className={styles.formLabel}>Email</label>
          <input
            className={styles.formInput}
            {...register("email")}
            placeholder="Enter your email address"
            type="email"
          />
          <div className={styles.errorDiv}>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>
        </fieldset>

        <fieldset
          className={`${styles.inputGroup} ${styles["inputGroup--phone"]}`}
        >
          <label className={styles.formLabel}>Phone</label>
          <input
            className={styles.formInput}
            {...register("phone")}
            placeholder="Enter 10-digit phone number"
            type="tel"
          />
          <div className={styles.errorDiv}>
            {errors.phone && (
              <p className={styles.error}>{errors.phone.message}</p>
            )}
          </div>
        </fieldset>

        <fieldset
          className={`${styles.inputGroup} ${styles["inputGroup--coupon"]}`}
        >
          <label className={styles.formLabel}>Coupon Code (Optional)</label>
          <input
            className={styles.formInput}
            {...register("couponCode")}
            placeholder="Enter coupon code"
            type="text"
          />
          <div className={styles.errorDiv}>
            {couponValidating && (
              <p style={{ color: "#3b82f6" }}>🔍 Validating coupon...</p>
            )}
            {couponError && <p className={styles.error}>❌ {couponError}</p>}
            {appliedCoupon && !couponValidating && (
              <p style={{ color: "#22c55e" }}>
                ✅ Coupon applied! {couponDiscountPercentage}% discount (₹
                {couponDiscount.toFixed(2)} saved)
              </p>
            )}
          </div>
        </fieldset>

        <div className={styles.buttonGroup} ref={sparkleRef}>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              isProcessing ||
              !razorpayKeyId ||
              couponValidating ||
              programsLoading ||
              pricingLoading ||
              finalPrice <= 0
            }
          >
            {isSubmitting || isProcessing ? (
              <>
                <div className={styles.sparkleDiv}>
                  <Sparkle color="white" />
                </div>
                <div className={styles.sparkleDiv}>
                  <Sparkle color="white" />
                </div>
                <div className={styles.sparkleDiv}>
                  <Sparkle color="white" />
                </div>
                Processing Payment...
              </>
            ) : !razorpayKeyId ? (
              "Loading Payment Gateway..."
            ) : programsLoading ? (
              "Loading Programs..."
            ) : pricingLoading ? (
              "Loading Pricing..."
            ) : couponValidating ? (
              "Validating Coupon..."
            ) : finalPrice <= 0 ? (
              "Invalid Price"
            ) : (
              <>
                {couponDiscount > 0 || platformDiscount > 0 ? (
                  <>
                    Pay ₹{finalPrice.toFixed(2)}
                    <span
                      style={{
                        textDecoration: "line-through",
                        opacity: 0.7,
                        marginLeft: "8px",
                        fontSize: "0.9em",
                      }}
                    >
                      ₹{originalPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  `Pay ₹${finalPrice.toFixed(2)}`
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopUpForm;