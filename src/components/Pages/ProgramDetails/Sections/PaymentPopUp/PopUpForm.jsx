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

// Import your programs object
import { programs } from "@/data/programs"; // Update this path accordingly

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  couponCode: z.string().optional(),
});

const PopUpForm = ({ isOpen, onClose, plan, course, price, courseId: propCourseId }) => {
  const formRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState(null);
  const [couponValidating, setCouponValidating] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponDiscountPercentage, setCouponDiscountPercentage] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [finalPrice, setFinalPrice] = useState(price);
  const [courseId, setCourseId] = useState(null);
  const [actualCourseName, setActualCourseName] = useState(course); // Add state for actual course name

  // Enhanced course ID extraction using programs object
  useEffect(() => {
    const extractCourseId = () => {
      console.log('Starting enhanced course ID extraction...');
      console.log('Available programs:', Object.keys(programs));
      
      // Method 1: Use prop if provided and valid
      if (propCourseId && propCourseId.trim() && propCourseId !== 'programs') {
        console.log('Using courseId from props:', propCourseId);
        // Validate against programs object
        if (programs[propCourseId]) {
          return propCourseId;
        }
      }

      // Method 2: Extract from current URL with programs validation
      if (typeof window !== 'undefined') {
        const currentUrl = window.location.href;
        console.log('Current URL:', currentUrl);

        const url = new URL(currentUrl);
        const urlParams = url.searchParams;
        
        // Check common parameter names first
        const paramNames = ['courseId', 'course_id', 'id', 'cid', 'courseID', 'course'];
        for (const param of paramNames) {
          const value = urlParams.get(param);
          if (value && value.trim() && value.toLowerCase() !== 'programs') {
            // Check if this value exists in programs
            if (programs[value.trim()]) {
              console.log(`Found valid courseId in URL param '${param}':`, value);
              return value.trim();
            }
          }
        }

        // Extract from pathname with programs validation
        const pathname = url.pathname;
        console.log('Pathname:', pathname);
        
        const pathParts = pathname.split('/').filter(part => part && part.trim());
        console.log('Path parts:', pathParts);
        
        // Look for exact matches in programs object
        for (const part of pathParts) {
          if (programs[part]) {
            console.log('Found exact program match in path:', part);
            return part;
          }
        }

        // Try hash parameters
        if (url.hash) {
          const hashParams = new URLSearchParams(url.hash.substring(1));
          for (const param of paramNames) {
            const value = hashParams.get(param);
            if (value && value.trim() && programs[value.trim()]) {
              console.log(`Found valid courseId in hash param '${param}':`, value);
              return value.trim();
            }
          }
        }
      }

      // Method 3: Map course name to program ID using enhanced mapping
      if (course && typeof course === 'string') {
        console.log('Mapping course name to program ID:', course);
        
        const courseLower = course.toLowerCase().trim();
        
        // Direct title matching
        for (const [programId, programData] of Object.entries(programs)) {
          if (programData.title && programData.title.toLowerCase() === courseLower) {
            console.log('Found direct title match:', programId);
            return programId;
          }
        }
        
        // Enhanced course name to program ID mapping
        const courseNameMappings = {
          // Direct program matches
          'web development': 'web-development',
          'python programming': 'python-programming', 
          'python': 'python-programming',
          'java': 'java',
          'java + dsa': 'java-dsa',
          'java dsa': 'java-dsa',
          'machine learning': 'machine-learning',
          'ml': 'machine-learning',
          'artificial intelligence': 'artificial-intelligence',
          'ai': 'artificial-intelligence',
          'cloud computing': 'cloud-computing',
          'cyber security': 'cyber-security',
          'cybersecurity': 'cyber-security',
          'data science': 'data-science',
          'vlsi': 'vlsi',
          'very large scale integration': 'vlsi',
          'nanotechnology': 'nanotechnology',
          'nano technology': 'nanotechnology',
          'embedded systems': 'embedded-systems',
          'iot': 'iot',
          'internet of things': 'iot',
          'hybrid electric vehicles': 'hev',
          'hev': 'hev',
          'mern stack': 'mern-stack',
          'mern': 'mern-stack',
          'android development': 'android-development',
          'business management': 'business-management',
          'business analytics': 'business-analytics',
          'digital marketing': 'digital-marketing',
          'finance': 'finance',
          'stock trading': 'stock-trading',
          'human resources': 'human-resources',
          'hr': 'human-resources',
          'corporate law': 'corporate-law',
          'ui/ux design': 'ui-ux-design',
          'ui ux design': 'ui-ux-design',
          'ux design': 'ui-ux-design',
          'ui design': 'ui-ux-design',
          'fashion designing': 'fashion-designing',
          'fashion design': 'fashion-designing',
          'psychology': 'psychology',
          'medical coding': 'medical-coding',
          'advanced data science': 'advanced-data-science',
          'advanced web development': 'advanced-web-development',
          'c & c++': 'c-cpp',
          'c and c++': 'c-cpp',
          'c++': 'c-cpp',
          'c programming': 'c-cpp',
          'autocad': 'autocad',
          'auto cad': 'autocad',
          'automobile design': 'automobile-design',
          'data structures & algorithms': 'dsa',
          'data structures and algorithms': 'dsa',
          'dsa': 'dsa',
          'algorithms': 'dsa',
          'clinical data management': 'clinical-data-management',
          'cdm': 'clinical-data-management',
          'clinical trials and research': 'clinical-trials-and-research',
          'clinical trials': 'clinical-trials-and-research',
          'ctr': 'clinical-trials-and-research',
          
          // Alternative names and variations
          'full stack web development': 'web-development',
          'fullstack': 'web-development',
          'frontend development': 'web-development',
          'backend development': 'web-development',
          'react': 'web-development',
          'node.js': 'web-development',
          'nodejs': 'web-development',
          'javascript': 'web-development',
          'html css': 'web-development',
          'responsive design': 'web-development',
        };

        // Check for exact matches first
        if (courseNameMappings[courseLower]) {
          const mappedId = courseNameMappings[courseLower];
          console.log('Found exact course name mapping:', mappedId);
          // Verify the mapped ID exists in programs
          if (programs[mappedId]) {
            return mappedId;
          }
        }
        
        // Check for partial matches
        for (const [key, value] of Object.entries(courseNameMappings)) {
          if (courseLower.includes(key) || key.includes(courseLower)) {
            console.log('Found partial course name mapping:', value);
            if (programs[value]) {
              return value;
            }
          }
        }
        
        // Check if course name matches any program title partially
        for (const [programId, programData] of Object.entries(programs)) {
          const programTitle = programData.title.toLowerCase();
          if (programTitle.includes(courseLower) || courseLower.includes(programTitle)) {
            console.log('Found partial title match:', programId);
            return programId;
          }
        }
      }

      // Method 4: Try to extract from document title or meta tags
      if (typeof document !== 'undefined') {
        const title = document.title.toLowerCase();
        const metaDescription = document.querySelector('meta[name="description"]')?.content?.toLowerCase() || '';
        
        // Look for program IDs in title and meta description
        const combinedText = `${title} ${metaDescription}`;
        
        // Check for any program ID mentioned in the document
        for (const programId of Object.keys(programs)) {
          if (combinedText.includes(programId) || combinedText.includes(programId.replace('-', ' '))) {
            console.log('Found program ID in document content:', programId);
            return programId;
          }
        }
      }

      // Fallback: use first available program or create timestamp-based ID
      const programKeys = Object.keys(programs);
      if (programKeys.length > 0) {
        // If we have a course name, try to create a meaningful fallback
        if (course && typeof course === 'string') {
          const fallbackId = course
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          
          if (fallbackId && fallbackId.length > 1) {
            console.log('Using course-based fallback courseId:', fallbackId);
            return fallbackId;
          }
        }
        
        // Use first available program as fallback
        const fallbackId = programKeys[0];
        console.log('Using first available program as fallback:', fallbackId);
        return fallbackId;
      }

      // Final fallback
      const finalFallback = `course-${Date.now()}`;
      console.log('Using final timestamp fallback courseId:', finalFallback);
      return finalFallback;
    };

    const extractedId = extractCourseId();
    
    // Final validation - ensure we have a valid courseId
    if (extractedId && extractedId.toLowerCase() !== 'programs') {
      setCourseId(extractedId);
      console.log('Final courseId set:', extractedId);
      
      // FIXED: Set the actual course name from programs data
      if (programs[extractedId] && programs[extractedId].title) {
        setActualCourseName(programs[extractedId].title);
        console.log('Actual course name set from programs:', programs[extractedId].title);
      } else {
        // Fallback to the course prop if program data not found
        setActualCourseName(course || 'Course');
      }
      
      // Log the matched program details if available
      if (programs[extractedId]) {
        console.log('Matched program details:', programs[extractedId]);
      }
    } else {
      const finalFallback = Object.keys(programs)[0] || `course-${Date.now()}`;
      setCourseId(finalFallback);
      
      // Set course name for fallback
      if (programs[finalFallback] && programs[finalFallback].title) {
        setActualCourseName(programs[finalFallback].title);
      } else {
        setActualCourseName(course || 'Course');
      }
      
      console.log('Used final fallback courseId:', finalFallback);
    }
  }, [propCourseId, course]);

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
  const sparkleRef = useRef(null);

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

  // Enhanced coupon validation with Excel sheet integration
  const validateCouponFromSheet = async (couponCode, courseId, originalPrice) => {
    try {
      console.log('Validating coupon from sheet:', { couponCode, courseId, originalPrice });
      
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: couponCode.trim().toUpperCase(),
          courseId: courseId,
          originalPrice: originalPrice,
          course: actualCourseName,
          plan: plan
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to validate coupon');
      }

      const result = await response.json();
      console.log('Coupon validation result:', result);

      return result;
    } catch (error) {
      console.error('Error validating coupon from sheet:', error);
      throw error;
    }
  };

  // Validate coupon when coupon code changes
  useEffect(() => {
    if (couponCode && couponCode.trim().length > 0 && courseId && price > 0) {
      const validateCoupon = async () => {
        setCouponValidating(true);
        setCouponError("");
        setCouponDiscount(0);
        setCouponDiscountPercentage(0);
        setAppliedCoupon(null);
        setFinalPrice(price);
        
        try {
          const result = await validateCouponFromSheet(couponCode, courseId, price);

          if (result.success && result.coupon) {
            // Use the pricing data returned from the API, with robust checks for null/undefined
            const discountAmount = typeof result.pricing.discountAmount === 'number' ? result.pricing.discountAmount : 0;
            const savingsPercentage = typeof result.pricing.savingsPercentage === 'number' ? result.pricing.savingsPercentage : 0;
            const finalAmount = typeof result.pricing.finalAmount === 'number' ? result.pricing.finalAmount : price;
            
            setCouponDiscount(discountAmount);
            setCouponDiscountPercentage(savingsPercentage);
            setAppliedCoupon(result.coupon);
            setFinalPrice(finalAmount);
            setCouponError("");

            console.log('Coupon applied successfully:', {
              originalPrice: price,
              discountPercentage: savingsPercentage,
              discountAmount: discountAmount,
              finalPrice: finalAmount
            });
          } else {
            setCouponDiscount(0);
            setCouponDiscountPercentage(0);
            setAppliedCoupon(null);
            setFinalPrice(price);
            setCouponError(result.message || "Invalid coupon code");
          }
        } catch (error) {
          console.error('Error validating coupon:', error);
          setCouponError(error.message || "Failed to validate coupon. Please try again.");
          setCouponDiscount(0);
          setCouponDiscountPercentage(0);
          setAppliedCoupon(null);
          setFinalPrice(price);
        } finally {
          setCouponValidating(false);
        }
      };

      // Debounce the validation
      const timeoutId = setTimeout(validateCoupon, 800);
      return () => clearTimeout(timeoutId);
    } else {
      // Reset when coupon code is empty
      setCouponDiscount(0);
      setCouponDiscountPercentage(0);
      setAppliedCoupon(null);
      setFinalPrice(price);
      setCouponError("");
      setCouponValidating(false);
    }
  }, [couponCode, actualCourseName, price, courseId, plan]); // Use actualCourseName

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

  useEffect(() => {
    if (!isOpen) {
      reset();
      setCouponDiscount(0);
      setCouponDiscountPercentage(0);
      setAppliedCoupon(null);
      setFinalPrice(price);
      setCouponError("");
    }
  }, [isOpen, reset, price]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (data) => {
    if (!courseId) {
      alert("Course ID is missing. Please refresh the page and try again.");
      setIsProcessing(false);
      return;
    }
    
    console.log('Initiating payment with courseId:', courseId);
    console.log('Payment details:', {
      originalPrice: price,
      finalPrice: finalPrice,
      couponDiscount: couponDiscount,
      couponCode: appliedCoupon?.code,
      discountPercentage: couponDiscountPercentage
    });
    
    setIsProcessing(true);
    
    try {
      // Check if Razorpay key is available
      if (!razorpayKeyId) {
        throw new Error('Razorpay configuration not loaded');
      }

      // Load Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create order with enhanced coupon information
      const orderResponse = await fetch(`/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalPrice * 100, // Convert to paise
          currency: 'INR',
          course: actualCourseName, // Use actual course name
          plan,
          studentData: data,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          originalAmount: price,
          discountAmount: couponDiscount,
          discountPercentage: couponDiscountPercentage,
          courseId: courseId,
          appliedCoupon: appliedCoupon,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Enhanced description for Razorpay
      let description = `${actualCourseName} - ${plan} Plan`; // Use actual course name
      if (appliedCoupon) {
        description += ` (${appliedCoupon.code} - ${couponDiscountPercentage}% OFF)`;
      }

      // Razorpay options
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Innoknowvex",
        description: description,
        order_id: orderData.id,
        handler: async function(response) {
          try {
            // Verify payment and save to Google Sheets with enhanced coupon data
            const verificationResponse = await fetch(`/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                studentData: data,
                course: actualCourseName, // Use actual course name
                plan,
                amount: finalPrice,
                originalAmount: price,
                discountAmount: couponDiscount,
                discountPercentage: couponDiscountPercentage,
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                appliedCoupon: appliedCoupon,
                courseId: courseId,
              }),
            });

            if (verificationResponse.ok) {
              const verificationData = await verificationResponse.json();
              
              // Enhanced success message with coupon details
              let successMessage = `🎉 Payment successful! 
              
Welcome to ${actualCourseName} - ${plan} Plan!`; // Use actual course name

              if (appliedCoupon) {
                successMessage += `

💰 Coupon Details:
• Code: ${appliedCoupon.code}
• Discount: ${couponDiscountPercentage}% (₹${couponDiscount} saved)
• Original Price: ₹${price}
• Final Price: ₹${finalPrice}`;
              }

              successMessage += `

📧 Your enrollment details have been recorded and you should receive a confirmation email shortly.

🆔 Transaction Details:
• Payment ID: ${verificationData.paymentId}
• Course ID: ${courseId}
• Order ID: ${response.razorpay_order_id}

Thank you for choosing Innoknowvex! 🚀`;
              
              alert(successMessage);
              
              reset();
              onClose();
            } else {
              const errorData = await verificationResponse.json();
              throw new Error(errorData.message || "Payment verification failed");
            }
          } catch (verificationError) {
            console.error('Payment verification error:', verificationError);
            alert(`Payment completed but verification failed. 
            
Please contact support with your payment details:
• Payment ID: ${response.razorpay_payment_id}
• Order ID: ${response.razorpay_order_id}
• Course ID: ${courseId}
${appliedCoupon ? `• Coupon Applied: ${appliedCoupon.code}` : ''}

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
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description || response.error.reason || 'Unknown error occurred'}`);
        setIsProcessing(false);
      });
      
      rzp.open();
      
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert(`Failed to initiate payment: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const onSubmit = async (data) => {
    if (!courseId) {
      alert("Course ID is missing. Please refresh the page and try again.");
      return;
    }

    // Validate final price
    if (isNaN(finalPrice) || finalPrice < 0) {
      alert("Invalid final price. Please refresh and try again.");
      return;
    }

    console.log('Submitting form with courseId:', courseId);
    console.log('Final submission data:', {
      ...data,
      courseId,
      originalPrice: price,
      finalPrice,
      couponApplied: !!appliedCoupon,
      couponCode: appliedCoupon?.code,
      discountAmount: couponDiscount,
      discountPercentage: couponDiscountPercentage
    });

    await initiatePayment(data);
  };

  if (!isOpen) {
    return null;
  }

  // Get program details if available
  const programDetails = programs[courseId];

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
            Enroll in {actualCourseName} {/* FIXED: Use actualCourseName instead of course */}
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

        <div className={styles.courseInfo}>
          <p><strong>Plan:</strong> {plan}</p>
          {programDetails && (
            <p><strong>Program:</strong> {programDetails.title}</p>
          )}
          <p><strong>Original Price:</strong> ₹{price}</p>
          {couponDiscount > 0 && (
            <>
              <p 
              // style={{ color: '#22c55e' }}
              >
                <strong>Discount ({couponDiscountPercentage}%):</strong> -₹{couponDiscount}
              </p>
              <p 
              // style={{ color: '#3b82f6', fontSize: '1.1em', fontWeight: 'bold' }}
              >
                <strong>Final Amount:</strong> ₹{finalPrice}
              </p>
            </>
          )}
          {couponDiscount === 0 && (
            <p><strong>Amount:</strong> ₹{finalPrice}</p>
          )}
        </div>

        <fieldset className={`${styles.inputGroup} ${styles["inputGroup--name"]}`}>
          <label className={styles.formLabel}>Name</label>
          <input 
            className={styles.formInput} 
            {...register("name")} 
            placeholder="Enter your full name"
          />
          <div className={styles.errorDiv}>
            {errors.name && <p className={styles.error}>{errors.name.message}</p>}
          </div>
        </fieldset>

        <fieldset className={`${styles.inputGroup} ${styles["inputGroup--email"]}`}>
          <label className={styles.formLabel}>Email</label>
          <input 
            className={styles.formInput} 
            {...register("email")} 
            placeholder="Enter your email address"
            type="email"
          />
          <div className={styles.errorDiv}>
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          </div>
        </fieldset>

        <fieldset className={`${styles.inputGroup} ${styles["inputGroup--phone"]}`}>
          <label className={styles.formLabel}>Phone</label>
          <input 
            className={styles.formInput} 
            {...register("phone")} 
            placeholder="Enter 10-digit phone number"
            type="tel"
          />
          <div className={styles.errorDiv}>
            {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
          </div>
        </fieldset>

        <fieldset className={`${styles.inputGroup} ${styles["inputGroup--coupon"]}`}>
          <label className={styles.formLabel}>Coupon Code (Optional)</label>
          <input 
            className={styles.formInput} 
            {...register("couponCode")} 
            placeholder="Enter coupon code"
            type="text"
            // style={{
            //   borderColor: appliedCoupon ? '#22c55e' : couponError ? '#ef4444' : undefined
            // }}
          />
          <div className={styles.errorDiv}>
            {couponValidating && (
              <p 
              style={{ color: '#3b82f6' }}
              >
                🔍 Validating coupon...
              </p>
            )}
            {couponError && (
              <p className={styles.error}>
                ❌ {couponError}
              </p>
            )}
            {appliedCoupon && !couponValidating && (
              <p 
              // style={{ color: '#22c55e' }}
              >
                ✅ Coupon applied! {couponDiscountPercentage}% discount (₹{couponDiscount} saved)
                {/* {appliedCoupon.validUntil && (
                  <span style={{ display: 'block', fontSize: '0.9em', opacity: 0.8 }}>
                    Valid until: {new Date(appliedCoupon.validUntil).toLocaleDateString()}
                  </span>
                )} */}
              </p>
            )}
          </div>
        </fieldset>

        <div className={styles.buttonGroup} ref={sparkleRef}>
          <button type="submit" disabled={isSubmitting || isProcessing || !razorpayKeyId || couponValidating}>
            {isSubmitting || isProcessing ? (
              <>
                <div className={styles.sparkleDiv}><Sparkle color="white" /></div>
                <div className={styles.sparkleDiv}><Sparkle color="white" /></div>
                <div className={styles.sparkleDiv}><Sparkle color="white" /></div>
                Processing Payment...
              </>
            ) : !razorpayKeyId ? (
              "Loading Payment Gateway..."
            ) : couponValidating ? (
              "Validating Coupon..."
            ) : (
              <>
                {couponDiscount > 0 ? (
                  <>
                    Pay ₹{finalPrice} 
                    <span style={{ 
                      textDecoration: 'line-through', 
                      opacity: 0.7, 
                      marginLeft: '8px',
                      fontSize: '0.9em' 
                    }}>
                      ₹{price}
                    </span>
                  </>
                ) : (
                  `Pay ₹${finalPrice}`
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
