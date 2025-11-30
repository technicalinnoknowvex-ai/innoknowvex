"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import styles from "../../student/forgot-password/styles/forgotPassword.module.scss";
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

export default function AdminResetPassword() {
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
    let mounted = true;

    const verifyRecoveryToken = async () => {
      try {
        console.log('✅ [ADMIN RESET] Checking for recovery session...');
        
        // Check if we have a session (callback already verified it)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('✅ [ADMIN RESET] Session check:', {
          hasSession: !!session,
          userRole: session?.user?.user_metadata?.role,
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

        // Verify this is an admin user
        const userRole = session?.user?.user_metadata?.role;
        if (userRole !== 'admin') {
          console.error('❌ [ADMIN RESET] Not an admin user:', userRole);
          if (mounted) {
            setErrorMessage('This reset link is for admin accounts only.');
            setValidToken(false);
            setCheckingToken(false);
          }
          return;
        }

        if (mounted) {
          console.log('✅ [ADMIN RESET] Valid admin session found!');
          setValidToken(true);
          setCheckingToken(false);
        }
      } catch (error) {
        console.error('❌ [ADMIN RESET] Error:', error);
        if (mounted) {
          setErrorMessage('An error occurred.');
          setValidToken(false);
          setCheckingToken(false);
        }
      }
    };

    const timer = setTimeout(verifyRecoveryToken, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const onSubmit = async (data) => {
    console.log('✅ [ADMIN RESET] Form submitted');
    setErrorMessage("");

    try {
      // Double-check we still have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Session expired. Please click the reset link again.');
      }

      console.log('✅ [ADMIN RESET] Updating password...');
      const result = await updatePassword(data.password);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('✅ [ADMIN RESET] Password updated successfully!');
      alert('Password updated successfully! Redirecting to sign in...');
      
      await supabase.auth.signOut();
      
      setTimeout(() => {
        router.push('/auth/admin/sign-in?message=' + encodeURIComponent('Password reset successful! Please sign in with your new password.'));
      }, 1500);

    } catch (error) {
      console.error('❌ [ADMIN RESET] Error:', error);
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
              onClick={() => router.push('/auth/admin/forgot-password')}
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
            Enter your new admin password below.
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
              onClick={() => router.push('/auth/admin/sign-in')}
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