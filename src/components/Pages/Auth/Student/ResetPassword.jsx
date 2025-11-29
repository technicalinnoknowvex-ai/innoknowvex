"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import styles from "../forgot-password/styles/forgotPassword.module.scss";
import { supabase, updatePassword, setSessionFromTokens } from "@/lib/supabase";

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
    const handlePasswordReset = async () => {
      try {
        console.log('🚀 [RESET PAGE] Component mounted');
        console.log('🌐 [RESET PAGE] Current URL:', window.location.href);
        console.log('🔗 [RESET PAGE] Hash:', window.location.hash);
        console.log('🔗 [RESET PAGE] Search:', window.location.search);
        console.log('🔗 [RESET PAGE] Pathname:', window.location.pathname);

        if (typeof window === 'undefined') {
          console.log('⚠️ [RESET PAGE] Window is undefined');
          return;
        }

        // Check for tokens in URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        console.log('🔍 [RESET PAGE] Hash parameters:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          type,
          error,
          errorDescription,
          accessTokenLength: accessToken?.length,
          refreshTokenLength: refreshToken?.length
        });

        // Check if there's an error in the URL
        if (error) {
          console.error('❌ [RESET PAGE] Error in URL:', error, errorDescription);
          setErrorMessage(errorDescription || error);
          setValidToken(false);
          setCheckingToken(false);
          return;
        }

        // Validate token presence and type
        if (!accessToken || type !== 'recovery') {
          console.error('❌ [RESET PAGE] Invalid parameters:', {
            hasAccessToken: !!accessToken,
            type,
            expectedType: 'recovery'
          });
          setErrorMessage('Invalid or missing reset token. Please request a new reset link.');
          setValidToken(false);
          setCheckingToken(false);
          return;
        }

        console.log('✅ [RESET PAGE] Valid tokens found, setting session...');

        // Set the session using the tokens
        const result = await setSessionFromTokens(accessToken, refreshToken || '');

        console.log('📝 [RESET PAGE] Set session result:', {
          success: result.success,
          hasSession: !!result.session,
          hasUser: !!result.user,
          error: result.error
        });

        if (!result.success) {
          console.error('❌ [RESET PAGE] Failed to set session:', result.error);
          throw new Error(result.error || 'Failed to establish session');
        }

        console.log('✅ [RESET PAGE] Session established successfully');
        console.log('👤 [RESET PAGE] User:', result.user?.email);
        
        setValidToken(true);
        
        // Clean the URL hash for security
        console.log('🧹 [RESET PAGE] Cleaning URL hash...');
        window.history.replaceState(null, '', window.location.pathname);
        console.log('✅ [RESET PAGE] URL cleaned');

      } catch (error) {
        console.error('❌ [RESET PAGE] Fatal error:', error);
        console.error('❌ [RESET PAGE] Error stack:', error.stack);
        setErrorMessage('An error occurred while verifying your reset link.');
        setValidToken(false);
      } finally {
        console.log('🏁 [RESET PAGE] Token check complete');
        setCheckingToken(false);
      }
    };

    const timer = setTimeout(handlePasswordReset, 300);
    return () => {
      console.log('🧹 [RESET PAGE] Cleanup');
      clearTimeout(timer);
    };
  }, []);

  const onSubmit = async (data) => {
    console.log('🔄 [FORM] Form submitted');
    setErrorMessage("");

    try {
      console.log('🔄 [FORM] Calling updatePassword...');
      const result = await updatePassword(data.password);

      console.log('📝 [FORM] Update result:', {
        success: result.success,
        error: result.error
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('✅ [FORM] Password updated successfully');
      alert('Password updated successfully! Redirecting to sign in...');
      
      console.log('🔄 [FORM] Signing out...');
      await supabase.auth.signOut();
      console.log('✅ [FORM] Signed out');
      
      console.log('🔄 [FORM] Redirecting to sign in...');
      setTimeout(() => {
        router.push('/auth/student/sign-in');
      }, 1500);

    } catch (error) {
      console.error('❌ [FORM] Error:', error);
      console.error('❌ [FORM] Error details:', {
        message: error.message,
        stack: error.stack
      });
      setErrorMessage(
        error.message || "Failed to update password. Please try again."
      );
    }
  };

  // Loading state
  if (checkingToken) {
    console.log('⏳ [RENDER] Showing loading state');
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
    console.log('❌ [RENDER] Showing invalid token state');
    return (
      <div className={styles.forgotPasswordPageWrapper}>
        <div className={styles.formWrapper}>
          <div className={styles.errorMessageCell} role="alert">
            <p>{errorMessage}</p>
          </div>
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
  console.log('✅ [RENDER] Showing password reset form');
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
};

export default StudentResetPassword;