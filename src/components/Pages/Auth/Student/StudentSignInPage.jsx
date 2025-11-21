"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import styles from "./styles/signIn.module.scss";

// Zod validation schema
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const StudentSignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      console.log("Sign in submitted:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Your API call here
      // const response = await fetch('/api/student/signin', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });

      alert("Sign in successful!");
      reset();
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed. Please try again.");
    }
  };

  return (
    <div className={styles.signInPageWrapper}>
      <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.headerCell}>
          <h2>STUDENT SIGN IN</h2>
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
            <Link href="/auth/student/sign-up" className={styles.signUpLink}>
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default StudentSignInPage;
