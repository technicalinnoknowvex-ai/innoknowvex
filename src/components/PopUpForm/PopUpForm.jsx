"use client";
import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { sendEnquiry } from "@/services/user/userServices";
import Sparkle from "../Common/Icons/Sparkle";
import styles from "./styles/popupForm.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePopupForm } from "@/context/PopupFormContext";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  program: z.string().min(1, "Program is required"),
});

const PopUpForm = () => {
  const { isFormOpen, closeForm } = usePopupForm();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      program: "",
    },
  });

  const sparkleRef = useRef(null);

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

  const onSubmit = async (data) => {
    const payload = { ...data, timestamp: new Date().toISOString() };
    try {
      await sendEnquiry(payload);
      alert("✅ Thank you! Your enquiry has been submitted.");
    } catch (error) {
      console.error("Failed to send enquiry:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  if (!isFormOpen) {
    return null;
  }
  return (
    <div className={styles.formPage}>
      <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formHeaderContainer}>
          <h1>
            Level Up Your
            <br />
            <span>Skills Today.</span>
          </h1>
          <button
            type="button"
            className={styles.closeButton}
            onClick={closeForm}
          >
            <Icon
              icon="icon-park-solid:close-one"
              style={{ width: "100%", height: "100%", color: "#9c7f16" }}
            />
          </button>
        </div>

        {/* inputs */}
        <fieldset
          className={`${styles.inputGroup} ${styles["inputGroup--name"]}`}
        >
          <label className={styles.formLabel}>Name</label>
          <input className={styles.formInput} {...register("name")} />
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
          <input className={styles.formInput} {...register("email")} />
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
          <input className={styles.formInput} {...register("phone")} />
          <div className={styles.errorDiv}>
            {errors.phone && (
              <p className={styles.error}>{errors.phone.message}</p>
            )}
          </div>
        </fieldset>

        <fieldset
          className={`${styles.inputGroup} ${styles["inputGroup--program"]}`}
        >
          <label className={styles.formLabel}>Program</label>
          <input className={styles.formInput} {...register("program")} />
          <div className={styles.errorDiv}>
            {errors.program && (
              <p className={styles.error}>{errors.program.message}</p>
            )}
          </div>
        </fieldset>

        <div className={styles.buttonGroup} ref={sparkleRef}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
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
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopUpForm;
