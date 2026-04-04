"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./styles/signUp.module.scss";
import { signUpWithEmail } from "@/lib/supabase";

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
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const AdminSignUpPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

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
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const redirectUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin}/api/auth/callback`;
      
      // console.log('🔵 ADMIN SIGNUP CHECKPOINT 1: Starting signup process');
      // console.log('🔵 ADMIN SIGNUP CHECKPOINT 2: Redirect URL:', redirectUrl);

      const result = await signUpWithEmail(
        data.email,
        data.password,
        redirectUrl,
        {
          full_name: data.fullName,
          user_type: 'admin',
          role: 'admin'
        }
      );

      // console.log('🔵 ADMIN SIGNUP CHECKPOINT 3: Signup result:', result);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (result.emailConfirmationRequired) {
        // console.log('🔵 ADMIN SIGNUP CHECKPOINT 4: Email confirmation required');
        
        setSuccessMessage(
          `Registration successful! We've sent a verification email to ${data.email}. Please check your inbox and click the verification link. Note: Admin accounts require approval before you can access the system.`
        );
        
        reset();

        setTimeout(() => {
          router.push('/auth/admin/sign-in');
        }, 7000);
      } else {
        // console.log('🔵 ADMIN SIGNUP CHECKPOINT 5: No email confirmation needed');
        
        setSuccessMessage("Registration successful! Redirecting...");
        setTimeout(() => {
          router.push('/admin/profile');
        }, 2000);
      }

    } catch (error) {
      console.error("❌ Admin sign up error:", error);
      setErrorMessage(error.message || "Sign up failed. Please try again.");
    }
  };

  return (
    <div className={styles.signUpPageWrapper}>
      <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
          <div className={styles.errorMessageCell} role="alert">
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className={styles.successMessageCell} role="alert">
            <p>{successMessage}</p>
          </div>
        )}

        <div className={styles.headerCell}>
          <h2>ADMIN SIGNUP</h2>
        </div>

        <fieldset className={`${styles.fieldSet} ${styles.fullnameCell}`}>
          <span>FULL NAME</span>
          <input
            type="text"
            {...register("fullName")}
            placeholder="Enter your full name"
            autoComplete="name"
            disabled={isSubmitting || !!successMessage}
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
            disabled={isSubmitting || !!successMessage}
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
            placeholder="Create password (min. 6 characters)"
            autoComplete="new-password"
            disabled={isSubmitting || !!successMessage}
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
            disabled={isSubmitting || !!successMessage}
          />
          <div className={styles.errorGroup}>
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>
        </fieldset>

        <div className={styles.buttonCell}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !!successMessage}
          >
            {isSubmitting ? "SIGNING UP..." : "SIGN UP"}
          </button>
        </div>

        <div className={styles.linkCell}>
          <p className={styles.signInPrompt}>
            Already have an account?{" "}
            <Link href="/auth/admin/sign-in" className={styles.signInLink}>
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminSignUpPage;