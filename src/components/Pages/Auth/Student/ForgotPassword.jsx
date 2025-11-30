"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./styles/forgotPassword.module.scss";
import { requestPasswordReset } from "@/lib/supabase";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email({
    message: "Please enter a valid email address",
  }),
});

const StudentForgotPassword = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    console.log('🔄 [FORGOT] Form submitted');
    console.log('📧 [FORGOT] Email:', data.email);
    
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log('🔄 [FORGOT] Requesting password reset...');
      const result = await requestPasswordReset(data.email);
      
      console.log('📝 [FORGOT] Result:', {
        success: result.success,
        message: result.message,
        error: result.error
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log('✅ [FORGOT] Reset email sent successfully');
      setSuccessMessage(
        "Password reset link has been sent to your email. Please check your inbox and spam folder."
      );
      
      console.log('⏱️ [FORGOT] Setting redirect timer...');
      setTimeout(() => {
        console.log('🔄 [FORGOT] Redirecting to sign-in...');
        router.push("/auth/student/sign-in");
      }, 5000);
    } catch (error) {
      console.error('❌ [FORGOT] Error:', error);
      console.error('❌ [FORGOT] Error details:', {
        message: error.message,
        stack: error.stack
      });
      setErrorMessage(
        error.message || "Failed to send reset link. Please try again."
      );
    }
  };

  return (
    <div className={styles.forgotPasswordPageWrapper}>
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
          <h2>RESET PASSWORD</h2>
          <p className={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

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

        <div className={styles.buttonCell}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !!successMessage}
          >
            {isSubmitting ? "SENDING..." : "SEND RESET LINK"}
          </button>
        </div>

        <div className={styles.linkCell}>
          <p className={styles.backToSignInPrompt}>
            Remember your password?{" "}
            <Link href="/auth/student/sign-in" className={styles.backToSignInLink}>
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default StudentForgotPassword;
