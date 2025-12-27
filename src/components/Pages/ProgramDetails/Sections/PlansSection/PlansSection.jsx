"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./styles/plansSection.module.scss";
import Image from "next/image";
import PopUpForm from "../PaymentPopUp/PopUpForm";
import { useRouter } from "next/navigation";

import useUserSession from "@/hooks/useUserSession";

export default function PlansSection() {
  const searchParams = useSearchParams();
  const courseName = searchParams.get("course") || "web-development";
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(false);

  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(0);

  useEffect(() => {
    async function fetchPricingData() {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching pricing data for course:", courseName);

        const response = await fetch(`/api/pricing/${courseName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Pricing data received:", data);

        setPricingData(data);
      } catch (err) {
        console.error("Error fetching pricing:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (courseName) {
      fetchPricingData();
    }
  }, [courseName]);

  // Check for auto-open popup on mount (after login redirect)
  useEffect(() => {
    const autoOpen = searchParams.get("autoOpenPopup");
    const plan = searchParams.get("plan");
    const price = searchParams.get("price");

    if (autoOpen === "true" && plan && price) {
      console.log("Auto-opening popup after login:", { plan, price });
      setSelectedPlan(plan);
      setSelectedPlanPrice(Number(price));
      setIsFormOpen(true);

      // Clean URL params
      const newUrl = window.location.pathname + `?course=${courseName}`;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, courseName]);

  const { session, isSessionLoading } = useUserSession();

  // Fixed handleEnrollClick with correct price passing
  const handleEnrollClick = (plan, price) => {
    console.log("🔵 [ENROLL] Button clicked:", { plan, price });

    // Don't check auth if session is still loading
    if (isSessionLoading) {
      console.log("⏳ [ENROLL] Session still loading...");
      return;
    }

    setCheckingAuth(true);

    try {
      console.log("🔍 [ENROLL] Session check:", {
        hasSession: !!session,
        userId: session?.user_id,
      });

      // If user is logged in → open popup
      if (session) {
        console.log("✅ [ENROLL] User authenticated, opening popup");
        setSelectedPlan(plan);
        setSelectedPlanPrice(price); // Pass the actual price
        setIsFormOpen(true);
      } else {
        // If NOT logged in → redirect to sign-in
        console.log("❌ [ENROLL] Not authenticated, redirecting");
        const currentUrl = window.location.pathname + window.location.search;
        router.push(
          `/auth/student/sign-in?redirect=${encodeURIComponent(currentUrl)}`
        );
      }
    } catch (error) {
      console.error("❌ [ENROLL] Error:", error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedPlan(null);
    setSelectedPlanPrice(0);
  };

  const formatCourseName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toLocaleString("en-IN") : price;
  };

  if (loading) {
    return (
      <div id="plans-section" className={styles.plansContainer}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading pricing information...</p>
        </div>
      </div>
    );
  }

  if (error || !pricingData) {
    return (
      <div id="plans-section" className={styles.plansContainer}>
        <div className={styles.error}>
          <h2>Error Loading Pricing</h2>
          <p>{error || "No pricing data available"}</p>
          <p>Course: {formatCourseName(courseName)}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="plans-section" className={styles.plansContainer}>
      <PopUpForm
        isOpen={isFormOpen}
        onClose={closeForm}
        plan={selectedPlan}
        course={formatCourseName(courseName)}
        price={selectedPlanPrice}
        courseId={pricingData.course_name || courseName}
      />

      <div className={styles.Plans}>
        <div className={styles.alignHeading}>
          <svg
            width="500"
            height="500"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.starOrange}
          >
            <path
              d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z"
              fill="#FF6432"
            />
          </svg>

          <h1>Plans to fit your Learning needs</h1>
        </div>
        <p>CHOOSE THAT FITS YOU</p>
      </div>

      <div className={styles.pricingCardLayout}>
        <svg
          width="767"
          height="767"
          viewBox="0 0 767 767"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.ellipse}
        >
          <g filter="url(#filter0_f_37_12)">
            <circle
              cx="383.5"
              cy="383.5"
              r="138.5"
              fill="#FA9805"
              fillOpacity="0.74"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_37_12"
              x="0.566696"
              y="0.566696"
              width="765.867"
              height="765.867"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="122.217"
                result="effect1_foregroundBlur_37_12"
              />
            </filter>
          </defs>
        </svg>

        {/* Self Plan */}
        <div className={styles.pricingCards}>
          <div className={styles.heading}>
            <svg
              width="52"
              height="56"
              viewBox="0 0 52 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.cardStar}
            >
              <path
                d="M25.3195 0.652346C25.4152 -0.217449 26.5848 -0.217449 26.6805 0.652346L27.4828 7.94913C28.5188 17.3712 35.4026 24.7999 44.1337 25.9178L50.8954 26.7836C51.7015 26.8869 51.7015 28.1491 50.8954 28.2523L44.1337 29.1181C35.4026 30.2361 28.5188 37.6647 27.4828 47.0868L26.6805 54.3835C26.5848 55.2534 25.4152 55.2534 25.3195 54.3835L24.5172 47.0868C23.4812 37.6647 16.5974 30.2361 7.86619 29.1181L1.10451 28.2523C0.298497 28.1491 0.298497 26.8869 1.10451 26.7836L7.86619 25.9178C16.5974 24.7999 23.4812 17.3712 24.5172 7.94913L25.3195 0.652346Z"
                fill="#9C7F16"
              />
            </svg>

            <h2>Self</h2>
          </div>

          <p className={styles.price}>
            ₹{formatPrice(pricingData.self_current_price)}
            <span className={styles.originalPrice}>
              ₹{formatPrice(pricingData.self_actual_price)}
            </span>
          </p>
          <p className={styles.planDesc}>
            Learn at your own pace with all the resources you need to succeed
            independently.
          </p>

          <button
            onClick={() =>
              handleEnrollClick("Self", pricingData.self_current_price)
            }
            className={styles.enrollButton}
            disabled={checkingAuth || isSessionLoading}
          >
            {checkingAuth || isSessionLoading ? "Checking..." : "Enroll Now"}
          </button>

          <div className={styles.plancontent}>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Recorded session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hand-on internship
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Certification
            </div>
            <div className={styles.features}>
              <svg
                width="9"
                height="10"
                viewBox="0 0 9 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.featureimg}
              >
                <g clipPath="url(#clip0_938_1077)">
                  <path
                    d="M4.38382 5.85737L1.23615 9.00505C1.11838 9.12282 0.968487 9.1817 0.786479 9.1817C0.60447 9.1817 0.454581 9.12282 0.336811 9.00505C0.219041 8.88728 0.160156 8.73739 0.160156 8.55538C0.160156 8.37337 0.219041 8.22348 0.336811 8.10571L3.48449 4.95804L0.336811 1.81037C0.219041 1.6926 0.160156 1.54271 0.160156 1.3607C0.160156 1.17869 0.219041 1.0288 0.336811 0.91103C0.454581 0.79326 0.60447 0.734375 0.786479 0.734375C0.968487 0.734375 1.11838 0.79326 1.23615 0.91103L4.38382 4.0587L7.5315 0.91103C7.64927 0.79326 7.79916 0.734375 7.98116 0.734375C8.16317 0.734375 8.31306 0.79326 8.43083 0.91103C8.5486 1.0288 8.60749 1.17869 8.60749 1.3607C8.60749 1.54271 8.5486 1.6926 8.43083 1.81037L5.28316 4.95804L8.43083 8.10571C8.5486 8.22348 8.60749 8.37337 8.60749 8.55538C8.60749 8.73739 8.5486 8.88728 8.43083 9.00505C8.31306 9.12282 8.16317 9.1817 7.98116 9.1817C7.79916 9.1817 7.64927 9.12282 7.5315 9.00505L4.38382 5.85737Z"
                    fill="#D92D20"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_938_1077">
                    <rect width="9" height="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Doubt Clearing
            </div>
            <div className={styles.features}>
              <svg
                width="9"
                height="10"
                viewBox="0 0 9 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.featureimg}
              >
                <g clipPath="url(#clip0_938_1077)">
                  <path
                    d="M4.38382 5.85737L1.23615 9.00505C1.11838 9.12282 0.968487 9.1817 0.786479 9.1817C0.60447 9.1817 0.454581 9.12282 0.336811 9.00505C0.219041 8.88728 0.160156 8.73739 0.160156 8.55538C0.160156 8.37337 0.219041 8.22348 0.336811 8.10571L3.48449 4.95804L0.336811 1.81037C0.219041 1.6926 0.160156 1.54271 0.160156 1.3607C0.160156 1.17869 0.219041 1.0288 0.336811 0.91103C0.454581 0.79326 0.60447 0.734375 0.786479 0.734375C0.968487 0.734375 1.11838 0.79326 1.23615 0.91103L4.38382 4.0587L7.5315 0.91103C7.64927 0.79326 7.79916 0.734375 7.98116 0.734375C8.16317 0.734375 8.31306 0.79326 8.43083 0.91103C8.5486 1.0288 8.60749 1.17869 8.60749 1.3607C8.60749 1.54271 8.5486 1.6926 8.43083 1.81037L5.28316 4.95804L8.43083 8.10571C8.5486 8.22348 8.60749 8.37337 8.60749 8.55538C8.60749 8.73739 8.5486 8.88728 8.43083 9.00505C8.31306 9.12282 8.16317 9.1817 7.98116 9.1817C7.79916 9.1817 7.64927 9.12282 7.5315 9.00505L4.38382 5.85737Z"
                    fill="#D92D20"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_938_1077">
                    <rect width="9" height="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Live Session
            </div>
            <div className={styles.features}>
              <svg
                width="9"
                height="10"
                viewBox="0 0 9 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.featureimg}
              >
                <g clipPath="url(#clip0_938_1077)">
                  <path
                    d="M4.38382 5.85737L1.23615 9.00505C1.11838 9.12282 0.968487 9.1817 0.786479 9.1817C0.60447 9.1817 0.454581 9.12282 0.336811 9.00505C0.219041 8.88728 0.160156 8.73739 0.160156 8.55538C0.160156 8.37337 0.219041 8.22348 0.336811 8.10571L3.48449 4.95804L0.336811 1.81037C0.219041 1.6926 0.160156 1.54271 0.160156 1.3607C0.160156 1.17869 0.219041 1.0288 0.336811 0.91103C0.454581 0.79326 0.60447 0.734375 0.786479 0.734375C0.968487 0.734375 1.11838 0.79326 1.23615 0.91103L4.38382 4.0587L7.5315 0.91103C7.64927 0.79326 7.79916 0.734375 7.98116 0.734375C8.16317 0.734375 8.31306 0.79326 8.43083 0.91103C8.5486 1.0288 8.60749 1.17869 8.60749 1.3607C8.60749 1.54271 8.5486 1.6926 8.43083 1.81037L5.28316 4.95804L8.43083 8.10571C8.5486 8.22348 8.60749 8.37337 8.60749 8.55538C8.60749 8.73739 8.5486 8.88728 8.43083 9.00505C8.31306 9.12282 8.16317 9.1817 7.98116 9.1817C7.79916 9.1817 7.64927 9.12282 7.5315 9.00505L4.38382 5.85737Z"
                    fill="#D92D20"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_938_1077">
                    <rect width="9" height="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Mentor Guidance
            </div>
            <div className={styles.features}>
              <svg
                width="9"
                height="10"
                viewBox="0 0 9 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.featureimg}
              >
                <g clipPath="url(#clip0_938_1077)">
                  <path
                    d="M4.38382 5.85737L1.23615 9.00505C1.11838 9.12282 0.968487 9.1817 0.786479 9.1817C0.60447 9.1817 0.454581 9.12282 0.336811 9.00505C0.219041 8.88728 0.160156 8.73739 0.160156 8.55538C0.160156 8.37337 0.219041 8.22348 0.336811 8.10571L3.48449 4.95804L0.336811 1.81037C0.219041 1.6926 0.160156 1.54271 0.160156 1.3607C0.160156 1.17869 0.219041 1.0288 0.336811 0.91103C0.454581 0.79326 0.60447 0.734375 0.786479 0.734375C0.968487 0.734375 1.11838 0.79326 1.23615 0.91103L4.38382 4.0587L7.5315 0.91103C7.64927 0.79326 7.79916 0.734375 7.98116 0.734375C8.16317 0.734375 8.31306 0.79326 8.43083 0.91103C8.5486 1.0288 8.60749 1.17869 8.60749 1.3607C8.60749 1.54271 8.5486 1.6926 8.43083 1.81037L5.28316 4.95804L8.43083 8.10571C8.5486 8.22348 8.60749 8.37337 8.60749 8.55538C8.60749 8.73739 8.5486 8.88728 8.43083 9.00505C8.31306 9.12282 8.16317 9.1817 7.98116 9.1817C7.79916 9.1817 7.64927 9.12282 7.5315 9.00505L4.38382 5.85737Z"
                    fill="#D92D20"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_938_1077">
                    <rect width="9" height="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Placement
            </div>
            <div className={styles.features}>
              <svg
                width="9"
                height="10"
                viewBox="0 0 9 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.featureimg}
              >
                <g clipPath="url(#clip0_938_1077)">
                  <path
                    d="M4.38382 5.85737L1.23615 9.00505C1.11838 9.12282 0.968487 9.1817 0.786479 9.1817C0.60447 9.1817 0.454581 9.12282 0.336811 9.00505C0.219041 8.88728 0.160156 8.73739 0.160156 8.55538C0.160156 8.37337 0.219041 8.22348 0.336811 8.10571L3.48449 4.95804L0.336811 1.81037C0.219041 1.6926 0.160156 1.54271 0.160156 1.3607C0.160156 1.17869 0.219041 1.0288 0.336811 0.91103C0.454581 0.79326 0.60447 0.734375 0.786479 0.734375C0.968487 0.734375 1.11838 0.79326 1.23615 0.91103L4.38382 4.0587L7.5315 0.91103C7.64927 0.79326 7.79916 0.734375 7.98116 0.734375C8.16317 0.734375 8.31306 0.79326 8.43083 0.91103C8.5486 1.0288 8.60749 1.17869 8.60749 1.3607C8.60749 1.54271 8.5486 1.6926 8.43083 1.81037L5.28316 4.95804L8.43083 8.10571C8.5486 8.22348 8.60749 8.37337 8.60749 8.55538C8.60749 8.73739 8.5486 8.88728 8.43083 9.00505C8.31306 9.12282 8.16317 9.1817 7.98116 9.1817C7.79916 9.1817 7.64927 9.12282 7.5315 9.00505L4.38382 5.85737Z"
                    fill="#D92D20"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_938_1077">
                    <rect width="9" height="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Mock Interview
            </div>
          </div>
        </div>

        {/* Mentor Plan */}
        <div className={styles.pricingCards}>
          <div className={styles.heading}>
            <svg
              width="52"
              height="56"
              viewBox="0 0 52 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.cardStar}
            >
              <path
                d="M25.3195 0.652346C25.4152 -0.217449 26.5848 -0.217449 26.6805 0.652346L27.4828 7.94913C28.5188 17.3712 35.4026 24.7999 44.1337 25.9178L50.8954 26.7836C51.7015 26.8869 51.7015 28.1491 50.8954 28.2523L44.1337 29.1181C35.4026 30.2361 28.5188 37.6647 27.4828 47.0868L26.6805 54.3835C26.5848 55.2534 25.4152 55.2534 25.3195 54.3835L24.5172 47.0868C23.4812 37.6647 16.5974 30.2361 7.86619 29.1181L1.10451 28.2523C0.298497 28.1491 0.298497 26.8869 1.10451 26.7836L7.86619 25.9178C16.5974 24.7999 23.4812 17.3712 24.5172 7.94913L25.3195 0.652346Z"
                fill="#9C7F16"
              />
            </svg>
            <h2>Mentor</h2>
          </div>

          <p className={styles.price}>
            ₹{formatPrice(pricingData.mentor_current_price)}
            <span className={styles.originalPrice}>
              ₹{formatPrice(pricingData.mentor_actual_price)}
            </span>
          </p>
          <p className={styles.planDesc}>
            Get personalized guidance with mentor support and live sessions for
            accelerated learning.
          </p>

          <button
            onClick={() =>
              handleEnrollClick("Mentor", pricingData.mentor_current_price)
            }
            className={styles.enrollButton}
            disabled={checkingAuth || isSessionLoading}
          >
            {checkingAuth || isSessionLoading ? "Checking..." : "Enroll Now"}
          </button>

          <div className={styles.plancontent}>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Recorded session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hand-on internship
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Certification
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Doubt Clearing
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Live Session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Mentor Guidance
            </div>
            <div className={styles.features}>
              <svg
                width="9"
                height="10"
                viewBox="0 0 9 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.featureimg}
              >
                <g clipPath="url(#clip0_938_1077)">
                  <path
                    d="M4.38382 5.85737L1.23615 9.00505C1.11838 9.12282 0.968487 9.1817 0.786479 9.1817C0.60447 9.1817 0.454581 9.12282 0.336811 9.00505C0.219041 8.88728 0.160156 8.73739 0.160156 8.55538C0.160156 8.37337 0.219041 8.22348 0.336811 8.10571L3.48449 4.95804L0.336811 1.81037C0.219041 1.6926 0.160156 1.54271 0.160156 1.3607C0.160156 1.17869 0.219041 1.0288 0.336811 0.91103C0.454581 0.79326 0.60447 0.734375 0.786479 0.734375C0.968487 0.734375 1.11838 0.79326 1.23615 0.91103L4.38382 4.0587L7.5315 0.91103C7.64927 0.79326 7.79916 0.734375 7.98116 0.734375C8.16317 0.734375 8.31306 0.79326 8.43083 0.91103C8.5486 1.0288 8.60749 1.17869 8.60749 1.3607C8.60749 1.54271 8.5486 1.6926 8.43083 1.81037L5.28316 4.95804L8.43083 8.10571C8.5486 8.22348 8.60749 8.37337 8.60749 8.55538C8.60749 8.73739 8.5486 8.88728 8.43083 9.00505C8.31306 9.12282 8.16317 9.1817 7.98116 9.1817C7.79916 9.1817 7.64927 9.12282 7.5315 9.00505L4.38382 5.85737Z"
                    fill="#D92D20"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_938_1077">
                    <rect width="9" height="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Placement
            </div>
            <div className={styles.features}>
              <svg
                width="9"
                height="10"
                viewBox="0 0 9 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.featureimg}
              >
                <g clipPath="url(#clip0_938_1077)">
                  <path
                    d="M4.38382 5.85737L1.23615 9.00505C1.11838 9.12282 0.968487 9.1817 0.786479 9.1817C0.60447 9.1817 0.454581 9.12282 0.336811 9.00505C0.219041 8.88728 0.160156 8.73739 0.160156 8.55538C0.160156 8.37337 0.219041 8.22348 0.336811 8.10571L3.48449 4.95804L0.336811 1.81037C0.219041 1.6926 0.160156 1.54271 0.160156 1.3607C0.160156 1.17869 0.219041 1.0288 0.336811 0.91103C0.454581 0.79326 0.60447 0.734375 0.786479 0.734375C0.968487 0.734375 1.11838 0.79326 1.23615 0.91103L4.38382 4.0587L7.5315 0.91103C7.64927 0.79326 7.79916 0.734375 7.98116 0.734375C8.16317 0.734375 8.31306 0.79326 8.43083 0.91103C8.5486 1.0288 8.60749 1.17869 8.60749 1.3607C8.60749 1.54271 8.5486 1.6926 8.43083 1.81037L5.28316 4.95804L8.43083 8.10571C8.5486 8.22348 8.60749 8.37337 8.60749 8.55538C8.60749 8.73739 8.5486 8.88728 8.43083 9.00505C8.31306 9.12282 8.16317 9.1817 7.98116 9.1817C7.79916 9.1817 7.64927 9.12282 7.5315 9.00505L4.38382 5.85737Z"
                    fill="#D92D20"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_938_1077">
                    <rect width="9" height="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Mock Interview
            </div>
          </div>
        </div>

        {/* Professional Plan */}
        <div className={styles.pricingCards}>
          <div className={styles.heading}>
            <svg
              width="52"
              height="56"
              viewBox="0 0 52 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.cardStar}
            >
              <path
                d="M25.3195 0.652346C25.4152 -0.217449 26.5848 -0.217449 26.6805 0.652346L27.4828 7.94913C28.5188 17.3712 35.4026 24.7999 44.1337 25.9178L50.8954 26.7836C51.7015 26.8869 51.7015 28.1491 50.8954 28.2523L44.1337 29.1181C35.4026 30.2361 28.5188 37.6647 27.4828 47.0868L26.6805 54.3835C26.5848 55.2534 25.4152 55.2534 25.3195 54.3835L24.5172 47.0868C23.4812 37.6647 16.5974 30.2361 7.86619 29.1181L1.10451 28.2523C0.298497 28.1491 0.298497 26.8869 1.10451 26.7836L7.86619 25.9178C16.5974 24.7999 23.4812 17.3712 24.5172 7.94913L25.3195 0.652346Z"
                fill="#9C7F16"
              />
            </svg>
            <h2>Professional</h2>
          </div>

          <p className={styles.price}>
            ₹{formatPrice(pricingData.professional_current_price)}
            <span className={styles.originalPrice}>
              ₹{formatPrice(pricingData.professional_actual_price)}
            </span>
          </p>
          <p className={styles.planDesc}>
            Complete career transformation with placement support, mock
            interviews, and comprehensive mentorship.
          </p>

          <button
            onClick={() =>
              handleEnrollClick(
                "Professional",
                pricingData.professional_current_price
              )
            }
            className={styles.enrollButton}
            disabled={checkingAuth || isSessionLoading}
          >
            {checkingAuth || isSessionLoading ? "Checking..." : "Enroll Now"}
          </button>

          <div className={styles.plancontent}>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Recorded session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hand-on internship
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Certification
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Doubt Clearing
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Live Session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Mentor Guidance
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Placement
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Mock Interview
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}