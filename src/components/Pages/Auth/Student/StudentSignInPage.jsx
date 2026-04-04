"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { studentSignIn, validateUserRole } from "@/actions/authActions";
import styles from "./styles/signIn.module.scss";
import { ROLES } from "@/constants/roles";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, "Password is required"),
});

const StudentSignInPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  // Check for verification success message on component mount
  useEffect(() => {
    const verified = searchParams.get("verified");
    const message = searchParams.get("message");
    const error = searchParams.get("error");

    if (verified === "true" && message) {
      setSuccessMessage(decodeURIComponent(message));
    } else if (error) {
      const errorMsg = searchParams.get("message");
      setErrorMessage(
        errorMsg 
          ? decodeURIComponent(errorMsg) 
          : "Verification failed. Please try again."
      );
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });



const onSubmit = async (data) => {
  setErrorMessage("");
  setSuccessMessage("");

  try {
    const result = await studentSignIn(data);

    // Get redirect URL
    const redirectUrl = searchParams.get("redirect");

    // Redirect back to where they came from OR dashboard
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push(`/student/${result.userId}/dashboard`);
    }
    
    router.refresh();
  } catch (error) {
    setErrorMessage(error.message || "Sign in failed. Please try again.");
  }
};

  return (
    <div className={styles.signInContainer}>
      <div className={styles.signInCard}>
        <form className={styles.signInForm} onSubmit={handleSubmit(onSubmit)}>
          {successMessage && (
            <div className={styles.successAlert} role="alert">
              <span className={styles.successIcon}>✓</span>
              <p className={styles.successText}>{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className={styles.errorAlert} role="alert">
              <span className={styles.errorIcon}>!</span>
              <p className={styles.errorText}>{errorMessage}</p>
            </div>
          )}
          
          <div className={styles.signInHeader}>
            <h2 className={styles.signInTitle}>STUDENT SIGN IN</h2>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>EMAIL ADDRESS</label>
            <input
              type="email"
              className={styles.formInput}
              {...register("email")}
              placeholder="Enter your email"
              autoComplete="email"
            />
            <div className={styles.errorGroup}>
              {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>PASSWORD</label>
            <input
              type="password"
              className={styles.formInput}
              {...register("password")}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <div className={styles.errorGroup}>
              {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
            </div>
            <div className={styles.forgotPasswordWrapper}>
              <Link href="/auth/student/forgot-password" className={styles.forgotPasswordLink}>
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                SIGNING IN...
              </>
            ) : (
              "SIGN IN"
            )}
          </button>

          <div className={styles.signInFooter}>
            <p className={styles.footerText}>
              Don't have an account?{" "}
              <Link href="/auth/student/sign-up" className={styles.footerLink}>
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentSignInPage;