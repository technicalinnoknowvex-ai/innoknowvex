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

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
});

const PopUpForm = ({ isOpen, onClose, plan, course, price }) => {
  const formRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

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
    }
  }, [isOpen, reset]);

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

      // Create order
      const orderResponse = await fetch(`/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price * 100, // Convert to paise
          currency: 'INR',
          course,
          plan,
          studentData: data
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Razorpay options
      const options = {
        key: razorpayKeyId, // Use the fetched key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Innoknowvex",
        description: `${course} - ${plan} Plan`,
        order_id: orderData.id,
        handler: async function(response) {
          try {
            // Verify payment
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
                course,
                plan,
                amount: price
              }),
            });

            if (verificationResponse.ok) {
              const verificationData = await verificationResponse.json();
              alert("Payment successful! You are now enrolled.");
              reset(); // Reset form
              onClose();
            } else {
              const errorData = await verificationResponse.json();
              throw new Error(errorData.message || "Payment verification failed");
            }
          } catch (verificationError) {
            console.error('Payment verification error:', verificationError);
            alert("Payment verification failed. Please contact support.");
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
        alert(`Payment failed: ${response.error.description}`);
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
    await initiatePayment(data);
  };

  if (!isOpen) {
    return null;
  }

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
            Enroll in {course}
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
          <p><strong>Course:</strong> {course}</p>
          <p><strong>Plan:</strong> {plan}</p>
          <p><strong>Amount:</strong> ₹{price}</p>
        </div>

        <fieldset className={`${styles.inputGroup} ${styles["inputGroup--name"]}`}>
          <label className={styles.formLabel}>Name</label>
          <input className={styles.formInput} {...register("name")} />
          <div className={styles.errorDiv}>
            {errors.name && <p className={styles.error}>{errors.name.message}</p>}
          </div>
        </fieldset>

        <fieldset className={`${styles.inputGroup} ${styles["inputGroup--email"]}`}>
          <label className={styles.formLabel}>Email</label>
          <input className={styles.formInput} {...register("email")} />
          <div className={styles.errorDiv}>
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          </div>
        </fieldset>

        <fieldset className={`${styles.inputGroup} ${styles["inputGroup--phone"]}`}>
          <label className={styles.formLabel}>Phone</label>
          <input className={styles.formInput} {...register("phone")} />
          <div className={styles.errorDiv}>
            {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
          </div>
        </fieldset>

        <div className={styles.buttonGroup} ref={sparkleRef}>
          <button type="submit" disabled={isSubmitting || isProcessing || !razorpayKeyId}>
            {isSubmitting || isProcessing ? (
              <>
                <div className={styles.sparkleDiv}><Sparkle color="white" /></div>
                <div className={styles.sparkleDiv}><Sparkle color="white" /></div>
                <div className={styles.sparkleDiv}><Sparkle color="white" /></div>
                Processing...
              </>
            ) : !razorpayKeyId ? (
              "Loading..."
            ) : (
              `Pay ₹${price}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopUpForm;