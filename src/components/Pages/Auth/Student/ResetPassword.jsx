"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles/resetPassword.module.scss";
import { supabase, updatePassword } from "@/lib/supabase";

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

export default function StudentResetPassword() {
  const [errorMessage, setErrorMessage] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    let mounted = true;

const verifyRecoveryToken = async () => {
  try {
    console.log('✅ CHECKPOINT 1: Checking for recovery session...');
    
    // Just check if we have a session (callback already verified it)
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log('✅ CHECKPOINT 2: Session check:', {
      hasSession: !!session,
      error: error?.message
    });

    if (error || !session) {
      if (mounted) {
        setErrorMessage('No active session. Please click the reset link again.');
        setValidToken(false);
        setCheckingToken(false);
      }
      return;
    }

    if (mounted) {
      console.log('✅ CHECKPOINT 3: Valid session found!');
      setValidToken(true);
      setCheckingToken(false);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    if (mounted) {
      setErrorMessage('An error occurred.');
      setValidToken(false);
      setCheckingToken(false);
    }
  }
};
    // Small delay to ensure everything is ready
    const timer = setTimeout(verifyRecoveryToken, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [searchParams]);

  const onSubmit = async (data) => {
    console.log('✅ CHECKPOINT 15: Password update form submitted');
    setErrorMessage("");

    try {
      // Double-check we still have a valid session
      console.log('✅ CHECKPOINT 16: Checking current session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('✅ CHECKPOINT 17: Session check:', {
        hasSession: !!session,
        error: sessionError?.message
      });

      if (sessionError || !session) {
        console.error('❌ CHECKPOINT 18: No valid session');
        throw new Error('Session expired. Please click the reset link again.');
      }

      console.log('✅ CHECKPOINT 19: Updating password...');
      const result = await updatePassword(data.password);

      console.log('✅ CHECKPOINT 20: Update result:', {
        success: result.success,
        error: result.error
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('✅ CHECKPOINT 21: Password updated successfully!');
      alert('Password updated successfully! Redirecting to sign in...');
      
      console.log('✅ CHECKPOINT 22: Signing out...');
      await supabase.auth.signOut();
      
      console.log('✅ CHECKPOINT 23: Redirecting to sign in...');
      setTimeout(() => {
        router.push('/auth/student/sign-in?message=' + encodeURIComponent('Password reset successful! Please sign in with your new password.'));
      }, 1500);

    } catch (error) {
      console.error('❌ CHECKPOINT 24: Password update failed:', error);
      setErrorMessage(
        error.message || "Failed to update password. Please try again."
      );
    }
  };

  // Loading state
  if (checkingToken) {
    return (
      <div className={styles.forgotPasswordPageWrapper}>
        <div className={styles.formWrapper}>
          <div className={styles.headerCell}>
            <h2>VERIFYING LINK...</h2>
            <p className={styles.subtitle}>Please wait while we verify your reset link.</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!validToken) {
    return (
      <div className={styles.forgotPasswordPageWrapper}>
        <div className={styles.formWrapper}>
          {errorMessage && (
            <div className={styles.errorMessageCell} role="alert">
              <p>{errorMessage}</p>
            </div>
          )}
          <div className={styles.headerCell}>
            <h2>INVALID LINK</h2>
            <p className={styles.subtitle}>
              This reset link is invalid or has expired.
            </p>
          </div>
          <div className={styles.buttonCell}>
            <button
              onClick={() => router.push('/auth/student/forgot-password')}
              className={styles.submitButton}
            >
              REQUEST NEW LINK
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show form
  return (
    <div className={styles.forgotPasswordPageWrapper}>
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

        <fieldset className={`${styles.fieldSet} ${styles.emailCell}`}>
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

        <fieldset className={`${styles.fieldSet} ${styles.emailCell}`}>
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
              style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}