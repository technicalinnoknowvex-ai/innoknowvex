"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import style from "./style/tech.module.scss";
import Image from "next/image";
import { getPrograms } from "@/app/(backend)/api/pricing/[course]/route"; // Import the Supabase function
import { toast } from "react-toastify";
import TechPackCartWindow from "../ChooseYourOwnPacks/CartWindow";

const PLAN_TYPES = {
  SELF: "Self",
  MENTOR: "Mentor",
  PROFESSIONAL: "Professional",
};

const MAX_COURSES = 4;
const MIN_MENTOR_PLANS = 2;
const FIXED_PACKAGE_PRICE = 25000;

const TechStarter = () => {
  const [selectedPlans, setSelectedPlans] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [programsPrice, setProgramsPrice] = useState({});
  const [priceLoadingStates, setPriceLoadingStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]); // New state for programs from Supabase

  // Fetch programs from Supabase on component mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const fetchedPrograms = await getPrograms();
        console.log("Fetched programs from Supabase:", fetchedPrograms);
        setPrograms(fetchedPrograms);
      } catch (error) {
        console.error("Error loading programs:", error);
        toast.error("Failed to load programs", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    };

    fetchPrograms();
  }, []);

  // Filter tech courses based on category
  const techCourses = useMemo(() => {
    if (!programs || programs.length === 0) return [];

    return programs.filter(
      (program) =>
        program.category === "technology-programming" ||
        program.category === "ai-data"
    );
  }, [programs]);

  // Fetch pricing for all tech courses
  useEffect(() => {
    const fetchAllPrices = async () => {
      if (techCourses.length === 0) return;

      setLoading(true);
      const pricePromises = techCourses.map(async (program) => {
        const searchTag = program.price_search_tag;

        setPriceLoadingStates((prev) => ({
          ...prev,
          [searchTag]: true,
        }));

        try {
          const apiUrl = `/api/pricing/${searchTag}`;
          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          return {
            searchTag,
            data: {
              self_current_price: data.self_current_price,
              self_actual_price: data.self_actual_price,
              mentor_current_price: data.mentor_current_price,
              mentor_actual_price: data.mentor_actual_price,
              professional_current_price: data.professional_current_price,
              professional_actual_price: data.professional_actual_price,
            },
          };
        } catch (err) {
          console.error(`Error fetching pricing for ${searchTag}:`, err);
          return {
            searchTag,
            data: {
              self_current_price: 5000,
              self_actual_price: 8000,
              mentor_current_price: 8000,
              mentor_actual_price: 12000,
              professional_current_price: 12000,
              professional_actual_price: 18000,
            },
          };
        } finally {
          setPriceLoadingStates((prev) => ({
            ...prev,
            [searchTag]: false,
          }));
        }
      });

      const results = await Promise.all(pricePromises);

      const pricesMap = {};
      results.forEach((result) => {
        pricesMap[result.searchTag] = result.data;
      });

      setProgramsPrice(pricesMap);
      setLoading(false);
    };

    if (techCourses.length > 0) {
      fetchAllPrices();
    }
  }, [techCourses]);

  // Load cart from sessionStorage
  useEffect(() => {
    const savedCart =
      JSON.parse(sessionStorage.getItem("techStarterCart")) || [];
    setCartItems(savedCart);

    const plans = {};
    savedCart.forEach((item) => {
      plans[item.id] = item.plan;
    });
    setSelectedPlans(plans);
  }, []);

  const getSelectedCoursesCount = () => {
    return Object.keys(selectedPlans).length;
  };

  const getMentorPlansCount = () => {
    return Object.values(selectedPlans).filter(
      (plan) => plan === PLAN_TYPES.MENTOR
    ).length;
  };

  const getNonMentorPlansCount = () => {
    return Object.values(selectedPlans).filter(
      (plan) => plan !== PLAN_TYPES.MENTOR
    ).length;
  };

  const isPlanSelected = (courseId, planName) => {
    return selectedPlans[courseId] === planName;
  };

  const isCourseSelected = (courseId) => {
    return courseId in selectedPlans;
  };

  const canSelectCourse = (courseId) => {
    return (
      isCourseSelected(courseId) || getSelectedCoursesCount() < MAX_COURSES
    );
  };

  const canSelectNonMentorPlan = (courseId) => {
    if (isCourseSelected(courseId)) {
      return true;
    }

    const currentNonMentorCount = getNonMentorPlansCount();
    const maxNonMentorPlans = MAX_COURSES - MIN_MENTOR_PLANS;

    return currentNonMentorCount < maxNonMentorPlans;
  };

  const isSelectionComplete = () => {
    return (
      getSelectedCoursesCount() === MAX_COURSES &&
      getMentorPlansCount() >= MIN_MENTOR_PLANS
    );
  };

  const handleAddToCart = (program, plan, price, actualPrice) => {
    if (!canSelectCourse(program.id)) {
      toast.error(`Maximum ${MAX_COURSES} courses allowed!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    if (plan !== PLAN_TYPES.MENTOR && !canSelectNonMentorPlan(program.id)) {
      toast.error(
        `You must select at least ${MIN_MENTOR_PLANS} Mentor plans! Only ${
          MAX_COURSES - MIN_MENTOR_PLANS
        } non-Mentor plans allowed.`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      return;
    }

    const cartItem = {
      id: program.id,
      course: program.title,
      plan: plan,
      price: price,
      actualPrice: actualPrice,
      image: program.image,
      packId: "tech-starter-pack",
      isPackageItem: true,
      packagePrice: FIXED_PACKAGE_PRICE,
      program_id: program.id,
      name: program.title,
    };

    let existingCart =
      JSON.parse(sessionStorage.getItem("techStarterCart")) || [];
    existingCart = existingCart.filter((item) => item.id !== program.id);
    existingCart.push(cartItem);
    sessionStorage.setItem("techStarterCart", JSON.stringify(existingCart));

    const packageInfo = {
      isPackage: true,
      packageName: "Tech Starter Pack",
      packageId: "tech-starter-pack",
      fixedPrice: FIXED_PACKAGE_PRICE,
      originalPrice: existingCart.reduce(
        (sum, item) => sum + (item.actualPrice || item.price),
        0
      ),
      items: existingCart,
      coursesCount: existingCart.length,
      mentorPlansCount: existingCart.filter((i) => i.plan === PLAN_TYPES.MENTOR)
        .length,
    };

    sessionStorage.setItem(
      "techStarterPackageInfo",
      JSON.stringify(packageInfo)
    );
    sessionStorage.setItem("cartItems", JSON.stringify(existingCart));

    setCartItems(existingCart);
    setSelectedPlans((prev) => ({
      ...prev,
      [program.id]: plan,
    }));

    setIsCartOpen(true);

    toast.success(`${plan} plan added to cart!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleRemoveFromCart = (courseId) => {
    let existingCart =
      JSON.parse(sessionStorage.getItem("techStarterCart")) || [];
    existingCart = existingCart.filter((item) => item.id !== courseId);
    sessionStorage.setItem("techStarterCart", JSON.stringify(existingCart));

    if (existingCart.length > 0) {
      const packageInfo = {
        isPackage: true,
        packageName: "Tech Starter Pack",
        packageId: "tech-starter-pack",
        fixedPrice: FIXED_PACKAGE_PRICE,
        originalPrice: existingCart.reduce(
          (sum, item) => sum + (item.actualPrice || item.price),
          0
        ),
        items: existingCart,
        coursesCount: existingCart.length,
        mentorPlansCount: existingCart.filter(
          (i) => i.plan === PLAN_TYPES.MENTOR
        ).length,
      };
      sessionStorage.setItem(
        "techStarterPackageInfo",
        JSON.stringify(packageInfo)
      );
    } else {
      sessionStorage.removeItem("techStarterPackageInfo");
    }

    sessionStorage.setItem("cartItems", JSON.stringify(existingCart));

    setCartItems(existingCart);
    setSelectedPlans((prev) => {
      const newPlans = { ...prev };
      delete newPlans[courseId];
      return newPlans;
    });

    toast.info("Removed from cart!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleViewDetails = (courseId) => {
    window.location.href = `/programs/${courseId}`;
  };

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toLocaleString("en-IN") : price;
  };

  const calculateTotalPricing = () => {
    let totalActual = 0;
    let totalCurrent = 0;

    cartItems.forEach((item) => {
      // Find the program by ID from the programs array
      const program = programs.find((p) => p.id === item.id);
      if (program) {
        const coursePrice = programsPrice[program.price_search_tag];
        if (coursePrice) {
          const planKey = item.plan.toLowerCase();
          totalActual += coursePrice[`${planKey}_actual_price`] || 0;
          totalCurrent += coursePrice[`${planKey}_current_price`] || 0;
        }
      }
    });

    return { totalCurrent, totalActual };
  };

  const { totalCurrent, totalActual } = calculateTotalPricing();
  const discount =
    totalActual > 0
      ? Math.round(((totalActual - FIXED_PACKAGE_PRICE) / totalActual) * 100)
      : 0;

  const renderPlanCard = (
    program,
    planType,
    planName,
    currentPrice,
    actualPrice
  ) => {
    const planDiscount = Math.round(
      ((actualPrice - currentPrice) / actualPrice) * 100
    );
    const isSelected = isPlanSelected(program.id, planName);
    const courseSelected = isCourseSelected(program.id);
    const isDisabled = courseSelected && !isSelected;
    const canSelect = canSelectCourse(program.id);

    const isNonMentorDisabled =
      planName !== PLAN_TYPES.MENTOR && !canSelectNonMentorPlan(program.id);

    return (
      <div
        className={`${style.planCard} ${isSelected ? style.selectedCard : ""} ${
          isDisabled || isNonMentorDisabled ? style.disabledCard : ""
        }`}
        key={`${program.id}-${planType}`}
      >
        <div className={style.planImageSection}>
          <Image
            src={program.image}
            height={200}
            width={280}
            alt={program.title}
            className={style.courseImage}
          />
          <div className={style.courseTitle}>
            <svg
              className={style.starIcon}
              width="20"
              height="20"
              viewBox="0 0 136 148"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M66.0962 1.74792C66.3511 -0.582641 69.4658 -0.582641 69.7207 1.74792L71.8573 21.2992C74.6162 46.5452 92.9484 66.4498 116.2 69.4453L134.207 71.7651C136.354 72.0419 136.354 75.4237 134.207 75.7005L116.2 78.0203C92.9484 81.0159 74.6162 100.92 71.8573 126.166L69.7207 145.717C69.4658 148.048 66.3511 148.048 66.0962 145.717L63.9596 126.166C61.2007 100.92 42.8685 81.0159 19.6167 78.0203L1.60985 75.7005C-0.536616 75.4237 -0.536616 72.0419 1.60985 71.7651L19.6167 69.4453C42.8685 66.4498 61.2007 46.5452 63.9596 21.2992L66.0962 1.74792Z"
                fill="#A38907"
              />
            </svg>
            <h3>{program.title}</h3>
          </div>
        </div>

        <div className={style.planDetailsSection}>
          <div className={style.planHeader}>
            <h2 className={style.planName}>{planName}</h2>
            <button
              className={style.exploreBtn}
              onClick={() => handleViewDetails(program.id)}
              aria-label="View course details"
            >
              <ExternalLink size={20} />
            </button>
          </div>

          <div className={style.pricingInfo}>
            <div className={style.currentPrice}>
              ₹{formatPrice(currentPrice)}
            </div>
            <div className={style.originalPrice}>
              ₹{formatPrice(actualPrice)}
            </div>
            <div className={style.discountBadge}>{planDiscount}% OFF</div>
          </div>

          {isSelected ? (
            <button
              className={`${style.addToCartBtn} ${style.removeBtn}`}
              onClick={() => handleRemoveFromCart(program.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </g>
              </svg>
              Remove from Cart
            </button>
          ) : (
            <button
              className={style.addToCartBtn}
              onClick={() =>
                handleAddToCart(program, planName, currentPrice, actualPrice)
              }
              disabled={isDisabled || !canSelect || isNonMentorDisabled}
              style={{
                opacity:
                  isDisabled || !canSelect || isNonMentorDisabled ? 0.5 : 1,
                cursor:
                  isDisabled || !canSelect || isNonMentorDisabled
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </g>
              </svg>
              {isDisabled
                ? "Another Plan Selected"
                : !canSelect
                ? "Max Limit Reached"
                : isNonMentorDisabled
                ? "Need More Mentor Plans"
                : "Add to Cart"}
            </button>
          )}
        </div>

        {isSelected && (
          <div className={style.selectedBadge}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
              />
            </svg>
            Selected
          </div>
        )}
      </div>
    );
  };

  if (loading || programs.length === 0) {
    return (
      <div className={style.packsContainer}>
        <div className={style.loadingContainer}>
          <div className={style.loadingSpinner}></div>
          <p>Loading Tech Starter Pack...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.packsContainer}>
      <div className={style.headDiv}>
        <svg
          className={style.headstar1}
          width="60"
          height="60"
          viewBox="0 0 136 148"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M66.0962 1.74792C66.3511 -0.582641 69.4658 -0.582641 69.7207 1.74792L71.8573 21.2992C74.6162 46.5452 92.9484 66.4498 116.2 69.4453L134.207 71.7651C136.354 72.0419 136.354 75.4237 134.207 75.7005L116.2 78.0203C92.9484 81.0159 74.6162 100.92 71.8573 126.166L69.7207 145.717C69.4658 148.048 66.3511 148.048 66.0962 145.717L63.9596 126.166C61.2007 100.92 42.8685 81.0159 19.6167 78.0203L1.60985 75.7005C-0.536616 75.4237 -0.536616 72.0419 1.60985 71.7651L19.6167 69.4453C42.8685 66.4498 61.2007 46.5452 63.9596 21.2992L66.0962 1.74792Z"
            fill="#9F8310"
          />
        </svg>
        <h1 className={style.heading}>Tech Starter Pack</h1>
        <svg
          className={style.headstar2}
          width="60"
          height="60"
          viewBox="0 0 136 148"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M66.0962 1.74792C66.3511 -0.582641 69.4658 -0.582641 69.7207 1.74792L71.8573 21.2992C74.6162 46.5452 92.9484 66.4498 116.2 69.4453L134.207 71.7651C136.354 72.0419 136.354 75.4237 134.207 75.7005L116.2 78.0203C92.9484 81.0159 74.6162 100.92 71.8573 126.166L69.7207 145.717C69.4658 148.048 66.3511 148.048 66.0962 145.717L63.9596 126.166C61.2007 100.92 42.8685 81.0159 19.6167 78.0203L1.60985 75.7005C-0.536616 75.4237 -0.536616 72.0419 1.60985 71.7651L19.6167 69.4453C42.8685 66.4498 61.2007 46.5452 63.9596 21.2992L66.0962 1.74792Z"
            fill="#9F8310"
          />
        </svg>
      </div>

      <div className={style.packDescription}>
        <p>
          Select exactly <strong>4 courses</strong> from our collection of{" "}
          {techCourses.length} technology courses.{" "}
          <strong>At least 2 courses must have the Mentor plan</strong>{" "}
          selected. Get the complete package for just <strong>₹25,000</strong>!
        </p>
        {cartItems.length === MAX_COURSES && isSelectionComplete() && (
          <div className={style.priceRange}>
            <span className={style.priceLabel}>Your Total Package Price:</span>
            <span className={style.originalPrice}>
              ₹{formatPrice(totalActual)}
            </span>
            <span className={style.arrow}>→</span>
            <span className={style.currentPrice}>
              ₹{formatPrice(FIXED_PACKAGE_PRICE)}
            </span>
            <span className={style.discountBadge}>{discount}% OFF</span>
          </div>
        )}
      </div>

      <div className={style.selectionCounter}>
        <p>
          Selected: <strong>{getSelectedCoursesCount()}</strong> / {MAX_COURSES}{" "}
          courses
        </p>
        <p className={style.mentorCount}>
          Mentor Plans: <strong>{getMentorPlansCount()}</strong> /{" "}
          {MIN_MENTOR_PLANS} minimum required
        </p>
        {getSelectedCoursesCount() === MAX_COURSES &&
        getMentorPlansCount() >= MIN_MENTOR_PLANS ? (
          <div className={style.completeBadge}>
            <CheckCircle size={20} />
            <span>
              Selection Complete! Package Price: ₹
              {formatPrice(FIXED_PACKAGE_PRICE)}
            </span>
          </div>
        ) : getSelectedCoursesCount() === MAX_COURSES &&
          getMentorPlansCount() < MIN_MENTOR_PLANS ? (
          <div className={style.warningBadge}>
            <AlertCircle size={20} />
            <span>
              Need {MIN_MENTOR_PLANS - getMentorPlansCount()} more Mentor
              plan(s)!
            </span>
          </div>
        ) : null}
      </div>

      {cartItems.length > 0 && (
        <div className={style.viewCartButtonContainer}>
          <button
            className={style.viewCartButton}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={20} />
            View Cart ({cartItems.length}/4)
          </button>
        </div>
      )}

      <div className={style.coursesSection}>
        <h2 className={style.sectionTitle}>
          Choose Your {MAX_COURSES} Courses from {techCourses.length} Available
        </h2>

        <div className={style.plansGrid}>
          {techCourses.map((program) => {
            const coursePrice = programsPrice[program.price_search_tag];
            const isPriceLoading = priceLoadingStates[program.price_search_tag];

            if (isPriceLoading) {
              return (
                <div key={program.id} className={style.loadingCard}>
                  <div className={style.loadingSpinner}></div>
                  <p>Loading {program.title}...</p>
                </div>
              );
            }

            if (!coursePrice) return null;

            return (
              <React.Fragment key={program.id}>
                {renderPlanCard(
                  program,
                  "self",
                  PLAN_TYPES.SELF,
                  coursePrice.self_current_price,
                  coursePrice.self_actual_price
                )}
                {renderPlanCard(
                  program,
                  "mentor",
                  PLAN_TYPES.MENTOR,
                  coursePrice.mentor_current_price,
                  coursePrice.mentor_actual_price
                )}
                {renderPlanCard(
                  program,
                  "professional",
                  PLAN_TYPES.PROFESSIONAL,
                  coursePrice.professional_current_price,
                  coursePrice.professional_actual_price
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {isCartOpen && (
        <TechPackCartWindow
          cartItems={cartItems}
          onRemove={handleRemoveFromCart}
          onClose={() => setIsCartOpen(false)}
          totalOriginalPrice={totalActual}
          totalCurrentPrice={totalCurrent}
          isSelectionComplete={isSelectionComplete()}
          mentorPlansCount={getMentorPlansCount()}
          minMentorPlans={MIN_MENTOR_PLANS}
          fixedPackagePrice={FIXED_PACKAGE_PRICE}
        />
      )}

      {!isCartOpen && cartItems.length > 0 && (
        <button
          className={style.cartToggleBtn}
          onClick={() => setIsCartOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </g>
          </svg>
          <span className={style.cartBadge}>{cartItems.length}</span>
        </button>
      )}
    </div>
  );
};

export default TechStarter;
