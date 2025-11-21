"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import styles from "./styles/signUp.module.scss";

// Zod validation schema
const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const StudentSignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      console.log("Form submitted:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Your API call here
      // const response = await fetch('/api/student/signup', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });

      alert("Sign up successful!");
      reset();
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <div className={styles.signUpPageWrapper}>
      <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.headerCell}>
          <h2>STUDENT SIGNUP</h2>
        </div>

        <fieldset className={`${styles.fieldSet} ${styles.fullnameCell}`}>
          <span>FULL NAME</span>
          <input
            type="text"
            {...register("fullName")}
            placeholder="Enter your full name"
            autoComplete="name"
          />
          <div className={styles.errorGroup}>
            {errors.fullName && <p>{errors.fullName.message}</p>}
          </div>
        </fieldset>

        <fieldset className={`${styles.fieldSet} ${styles.emailCell}`}>
          <span>EMAIL ADDRESS</span>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            autoComplete="email"
          />
          <div className={styles.errorGroup}>
            {errors.email && <p>{errors.email.message}</p>}
          </div>
        </fieldset>

        <fieldset className={`${styles.fieldSet} ${styles.passwordCell}`}>
          <span>PASSWORD</span>
          <input
            type="password"
            {...register("password")}
            placeholder="Create password"
            autoComplete="new-password"
          />
          <div className={styles.errorGroup}>
            {errors.password && <p>{errors.password.message}</p>}
          </div>
        </fieldset>

        <fieldset
          className={`${styles.fieldSet} ${styles.confirmPasswordCell}`}
        >
          <span>CONFIRM PASSWORD</span>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm password"
            autoComplete="new-password"
          />
          <div className={styles.errorGroup}>
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>
        </fieldset>

        <div className={styles.buttonCell}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "SIGNING UP..." : "SIGN UP"}
          </button>
        </div>

        <div className={styles.linkCell}>
          <p className={styles.signInPrompt}>
            Already have an account?{" "}
            <Link href="/auth/student/sign-in" className={styles.signInLink}>
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default StudentSignUpPage;
