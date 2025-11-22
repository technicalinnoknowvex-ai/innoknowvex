"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles/signIn.module.scss";
import { adminSignIn, validateUserRole } from "@/actions/authActions";
import { ROLES } from "@/constants/roles";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, "Password is required"),
});

const AdminSignInPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

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

    try {
      // Step 1: Validate user exists and has correct role
      const validation = await validateUserRole({
        email: data.email,
        expectedRole: ROLES.ADMIN,
      });

      if (!validation.isValid) {
        setErrorMessage(validation.error);
        return;
      }

      // Step 2: Attempt sign in only if validation passed
      const result = await adminSignIn(data);

      // Step 3: Redirect to original page or default admin dashboard
      const redirectPath = redirect || "/admin/dashboard";
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
