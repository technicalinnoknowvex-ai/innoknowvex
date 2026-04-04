"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { adminSignIn } from "@/actions/authActions";
import styles from "./styles/signIn.module.scss";
import { ROLES } from "@/constants/roles";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, "Password is required"),
});

const AdminSignInPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

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
      const result = await adminSignIn(data);

      const redirectPath = redirect || `/admin/${result.userId}/dashboard`;
      router.push(redirectPath);
      router.refresh();
    } catch (error) {
      setErrorMessage(error.message || "Sign in failed. Please try again.");
    }
  };

  return (
    <div className={styles.signInPageWrapper}>
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
          <h2>ADMIN SIGN IN</h2>
        </div>

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
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          <div className={styles.errorGroup}>
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <div className={styles.forgotPasswordWrapper}>
            <Link href="/auth/admin/forgot-password" className={styles.forgotPasswordLink}>
              Forgot Password?
            </Link>
          </div>
        </fieldset>

        <div className={styles.buttonCell}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </div>

        <div className={styles.linkCell}>
          <p className={styles.signUpPrompt}>
            Don't have an account?{" "}
            <Link href="/auth/admin/sign-up" className={styles.signUpLink}>
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminSignInPage;