"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./styles/signIn.module.scss";

// Zod validation schema
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const AdminSignInPage = () => {
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
      // const response = await fetch('/api/admin/signin', {
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
      </form>
    </div>
  );
};

export default AdminSignInPage;
