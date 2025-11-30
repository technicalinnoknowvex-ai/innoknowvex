"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { supabase, updatePassword } from "@/lib/supabase";
import styles from "./styles/resetPassword.module.scss";

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

const ResetPasswordForm = ({ 
  userType = "student", // "admin" or "student"
  redirectDelay = 1500 
}) => {
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

  // Dynamic paths based on user type
  const paths = {
    admin: {
      forgotPath: '/auth/admin/forgot-password',
      signInPath: '/auth/admin/sign-in',
      label: 'ADMIN',
      role: 'admin'
    },
    student: {
      forgotPath: '/auth/student/forgot-password',
      signInPath: '/auth/student/sign-in',
      label: 'STUDENT',
      role: 'student'
    }
  };

  const currentPaths = paths[userType] || paths.student;

  useEffect(() => {
    let mounted = true;

    const verifyRecoveryToken = async () => {
      try {
        console.log(`✅ [${currentPaths.label} RESET] Checking for recovery session...`);
        
        // ✅ FIX: Try to restore session from cookies first
        const getCookie = (name) => {
          if (typeof document === 'undefined') return null;
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
          return null;
        };
        
        const accessToken = getCookie('sb-access-token');
        const refreshToken = getCookie('sb-refresh-token');
        
        console.log(`✅ [${currentPaths.label} RESET] Cookie check:`, {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          allCookies: document.cookie
        });
        
        // If we have tokens in cookies, set the session
        if (accessToken && refreshToken) {
          console.log(`✅ [${currentPaths.label} RESET] Restoring session from cookies...`);
          console.log(`🔑 [${currentPaths.label} RESET] Access token (first 20 chars):`, accessToken?.substring(0, 20));
          
          const { data, error: setError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (setError) {
            console.error(`❌ [${currentPaths.label} RESET] Error setting session:`, setError);
          } else {
            console.log(`✅ [${currentPaths.label} RESET] Session restored successfully`, {
              hasSession: !!data?.session,
              hasUser: !!data?.user
            });
          }
        } else {
          console.warn(`⚠️ [${currentPaths.label} RESET] No tokens found in cookies!`);
          console.log(`📋 [${currentPaths.label} RESET] All available cookies:`, document.cookie);
        }
        
        // Small delay to ensure session is set
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Now check for session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log(`✅ [${currentPaths.label} RESET] Session check:`, {
          hasSession: !!session,
          userRole: session?.user?.user_metadata?.role,
          userId: session?.user?.id,
          error: error?.message
        });

        if (error || !session) {
          console.error(`❌ [${currentPaths.label} RESET] No session found after restore attempt`);
          if (mounted) {
            setErrorMessage('No active session. Please click the reset link again.');
            setValidToken(false);
            setCheckingToken(false);
          }
          return;
        }

        // Verify user role matches expected type
        const userRole = session?.user?.user_metadata?.role;
        
        // ✅ REMOVED ROLE CHECK - Anyone with valid session can reset password
        console.log(`✅ [${currentPaths.label} RESET] User role:`, userRole, '(role check disabled)');

        if (mounted) {
          console.log(`✅ [${currentPaths.label} RESET] Valid session found!`);
          setValidToken(true);
          setCheckingToken(false);
        }
      } catch (error) {
        console.error(`❌ [${currentPaths.label} RESET] Error:`, error);
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
  }, [currentPaths.label, currentPaths.role, userType]);

  const onSubmit = async (data) => {
    console.log(`✅ [${currentPaths.label} RESET] Form submitted`);
    setErrorMessage("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Session expired. Please click the reset link again.');
      }

      console.log(`✅ [${currentPaths.label} RESET] Updating password...`);
      const result = await updatePassword(data.password);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log(`✅ [${currentPaths.label} RESET] Password updated successfully!`);
      alert('Password updated successfully! Redirecting to sign in...');
      
      await supabase.auth.signOut();
      
      setTimeout(() => {
        router.push(currentPaths.signInPath + '?message=' + encodeURIComponent('Password reset successful! Please sign in with your new password.'));
      }, redirectDelay);

    } catch (error) {
      console.error(`❌ [${currentPaths.label} RESET] Error:`, error);
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
              onClick={() => router.push(currentPaths.forgotPath)}
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
            Enter your new {userType} password below.
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
              onClick={() => router.push(currentPaths.signInPath)}
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
};

export default ResetPasswordForm;