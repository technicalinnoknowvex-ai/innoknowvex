"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import styles from "./styles/ResetPassword.module.scss";
import { updatePassword } from "@/lib/supabase";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const StudentResetPassword = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    // Check if we have a valid recovery token in the URL
    const checkToken = () => {
      if (typeof window === 'undefined') return;

      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (type === 'recovery' && accessToken) {
        setValidToken(true);
      } else {
        setErrorMessage('Invalid or expired reset link. Please request a new one.');
      }
      setCheckingToken(false);
    };

    // Small delay to ensure component is mounted
    const timer = setTimeout(checkToken, 300);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data) => {
    setErrorMessage("");

    try {
      // Update password using Supabase
      const result = await updatePassword(data.password);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Show success and redirect
      alert('Password updated successfully! Redirecting to sign in...');
      
      setTimeout(() => {
        router.push('/auth/student/sign-in');
      }, 1500);

    } catch (error) {
      setErrorMessage(
        error.message || "Failed to update password. Please try again."
      );
    }
  };

  // Loading state while checking token
  if (checkingToken) {
    return (
      <div className={styles.resetPasswordPageWrapper}>
        <div className={styles.loadingCard}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!validToken) {
    return (
      <div className={styles.resetPasswordPageWrapper}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>✕</div>
          <h2 className={styles.errorTitle}>Invalid Reset Link</h2>
          <p className={styles.errorText}>{errorMessage}</p>
          <button
            onClick={() => router.push('/auth/student/forgot-password')}
            className={styles.requestNewLinkBtn}
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  // Valid token - show reset password form
  return (
    <div className={styles.resetPasswordPageWrapper}>
      <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
          <div className={styles.errorMessageCell} role="alert">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className={styles.headerCell}>
          <h2>CREATE NEW PASSWORD</h2>
          <p className={styles.subtitle}>
            Enter your new password below.
          </p>
        </div>

        <fieldset className={`${styles.fieldSet} ${styles.passwordCell}`}>
          <span>NEW PASSWORD</span>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter new password (min. 6 characters)"
            autoComplete="new-password"
          />
          <div className={styles.errorGroup}>
            {errors.password && <p>{errors.password.message}</p>}
          </div>
        </fieldset>

        <fieldset className={`${styles.fieldSet} ${styles.confirmPasswordCell}`}>
          <span>CONFIRM PASSWORD</span>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Re-enter your password"
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
            {isSubmitting ? "UPDATING..." : "RESET PASSWORD"}
          </button>
        </div>

        <div className={styles.linkCell}>
          <p className={styles.backToSignInPrompt}>
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => router.push('/auth/student/sign-in')}
              className={styles.backToSignInLink}
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default StudentResetPassword;