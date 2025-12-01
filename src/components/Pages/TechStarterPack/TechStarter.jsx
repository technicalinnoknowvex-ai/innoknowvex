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
import { toast } from "react-toastify";
import { getPrograms } from "@/app/(backend)/api/programs/programs";
import CartWindow from "../ChooseYourOwnPacks/CartWindow";

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
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem("techStarterCart")) || [];
    setCartItems(items);

    const plans = {};
    items.forEach((item) => {
      plans[item.id] = item.plan;
    });
    setSelectedPlans(plans);
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const fetchedPrograms = await getPrograms();
        const techPrograms = fetchedPrograms.filter(
          (p) =>
            p.category === "technology-programming" || p.category === "ai-data"
        );
        setPrograms(techPrograms);
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

  const fetchProgramPrice = async (tag) => {
    try {
      setPriceLoadingStates((prev) => ({ ...prev, [tag]: true }));

      const response = await fetch(`/api/pricingPowerPack/${tag}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProgramsPrice((prev) => ({ ...prev, [tag]: data }));
    } catch (err) {
      console.error(`Error fetching program price for ${tag}:`, err);
    } finally {
      setPriceLoadingStates((prev) => ({ ...prev, [tag]: false }));
    }
  };

  useEffect(() => {
    if (programs.length === 0) return;

    setLoading(true);

    const fetchPromises = programs.map((course) =>
      fetchProgramPrice(course.price_search_tag)
    );

    Promise.allSettled(fetchPromises).finally(() => {
      setLoading(false);
    });
  }, [programs]);

  const getSelectedCoursesCount = () => {
    return Object.keys(selectedPlans).length;
  };

  const getMentorPlansCount = () => {
    return Object.values(selectedPlans).filter(
      (plan) => plan === PLAN_TYPES.MENTOR
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

  const isPackageValid = useMemo(() => {
    const totalCourses = getSelectedCoursesCount();
    const mentorCount = getMentorPlansCount();
    return totalCourses === MAX_COURSES && mentorCount >= MIN_MENTOR_PLANS;
  }, [selectedPlans]);

  const handleAddToCart = (program, plan) => {
    if (!canSelectCourse(program.id)) {
      toast.error(`Maximum ${MAX_COURSES} courses allowed!`, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    const cartItem = {
      id: program.id,
      course: program.title,
      plan: plan,
      image: program.image,
    };

    let existingCart =
      JSON.parse(sessionStorage.getItem("techStarterCart")) || [];
    existingCart = existingCart.filter((item) => item.id !== program.id);
    existingCart.push(cartItem);
    sessionStorage.setItem("techStarterCart", JSON.stringify(existingCart));

    setCartItems(existingCart);
    setSelectedPlans((prev) => ({
      ...prev,
      [program.id]: plan,
    }));

    setIsCartOpen(true);

    toast.success(`${plan} plan added!`, {
      position: "top-right",
      autoClose: 1000,
      theme: "colored",
    });
  };

  const handleRemoveFromCart = (courseId) => {
    let existingCart =
      JSON.parse(sessionStorage.getItem("techStarterCart")) || [];
    existingCart = existingCart.filter((item) => item.id !== courseId);
    sessionStorage.setItem("techStarterCart", JSON.stringify(existingCart));

    setCartItems(existingCart);
    setSelectedPlans((prev) => {
      const newPlans = { ...prev };
      delete newPlans[courseId];
      return newPlans;
    });

    toast.info("Removed from pack!", {
      position: "top-right",
      autoClose: 1000,
      theme: "colored",
    });
  };

  const handleExplore = (program) => {
    window.open(`/programs/${program.id}`, "_blank");
  };

  const renderPlanCard = (program, planType, planName) => {
    const isSelected = isPlanSelected(program.id, planName);
    const courseSelected = isCourseSelected(program.id);
    const isDisabled = courseSelected && !isSelected;
    const canSelect = canSelectCourse(program.id);

    return (
      <div
        className={`${style.planCard} ${isSelected ? style.selectedCard : ""} ${
          isDisabled ? style.disabledCard : ""
        }`}
        key={`${program.id}-${planType}`}
      >
        <div className={style.planImageSection}>
          <Image
            src={program.image}
            fill
            alt={program.title}
            style={{ objectFit: "cover" }}
          />
          <div className={style.imageOverlay}></div>
        </div>

        <div className={style.planDetailsSection}>
          <div className={style.programInfo}>
            <h3 className={style.programTitle}>{program.title}</h3>
            <button
              className={style.exploreBtn}
              onClick={() => handleExplore(program)}
            >
              View Details <ExternalLink size={14} />
            </button>
          </div>

          <div className={style.planTypeTag}>{planName} Plan</div>

          <div className={style.packageInfo}>
            <p className={style.packageText}>
              Part of Tech Starter Pack @ ₹25,000
            </p>
          </div>

          {isSelected ? (
            <button
              className={`${style.addToCartBtn} ${style.removeBtn}`}
              onClick={() => handleRemoveFromCart(program.id)}
            >
              <span>Remove from Pack</span>
            </button>
          ) : (
            <button
              className={style.addToCartBtn}
              onClick={() => handleAddToCart(program, planName)}
              disabled={isDisabled || !canSelect}
            >
              <span>
                {isDisabled
                  ? "Another Plan Selected"
                  : !canSelect
                  ? "Pack Full"
                  : "Add to Pack"}
              </span>
            </button>
          )}
        </div>

        {isSelected && (
          <div className={style.selectedBadge}>
            <CheckCircle size={14} />
            Added
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={style.techStarterContainer}>
        <div className={style.stickyHeader}>
          <div className={style.pageHeader}>
            <h1 className={style.pageTitle}>Tech Starter Pack</h1>
            <p className={style.pageSubtitle}>
              Get 4 courses for just ₹25,000 • Select at least 2 Mentor plans
            </p>
          </div>
        </div>
        <div className={style.loadingContainer}>
          <div className={style.loadingSpinner}></div>
          <p>Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.techStarterContainer}>
      <div className={style.stickyHeader}>
        <div className={style.pageHeader}>
          <h1 className={style.pageTitle}>Tech Starter Pack</h1>
          <p className={style.pageSubtitle}>
            Get 4 courses for just ₹25,000 • Select at least 2 Mentor plans
          </p>
        </div>

        <div className={style.statusBar}>
          <div className={style.progressInfo}>
            <div className={style.progressItem}>
              <span className={style.label}>Courses Selected:</span>
              <span className={style.value}>
                {getSelectedCoursesCount()} / {MAX_COURSES}
              </span>
            </div>
            <div className={style.progressItem}>
              <span className={style.label}>Mentor Plans:</span>
              <span
                className={`${style.value} ${
                  getMentorPlansCount() >= MIN_MENTOR_PLANS
                    ? style.valid
                    : style.invalid
                }`}
              >
                {getMentorPlansCount()} / {MIN_MENTOR_PLANS} minimum
              </span>
            </div>
          </div>

          {isPackageValid ? (
            <div className={style.validationSuccess}>
              <CheckCircle size={18} />
              <span>Pack Complete!</span>
            </div>
          ) : (
            <div className={style.validationWarning}>
              <AlertCircle size={18} />
              <span>
                {getSelectedCoursesCount() < MAX_COURSES
                  ? `Select ${MAX_COURSES - getSelectedCoursesCount()} more`
                  : `Need ${MIN_MENTOR_PLANS - getMentorPlansCount()} more Mentor plans`}
              </span>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={style.viewCartButtonContainer}>
            <button
              className={style.viewCartButton}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={20} />
              View Pack ({cartItems.length}/4)
            </button>
          </div>
        )}
      </div>

      <div className={style.cardsScrollContainer}>
        <div className={style.plansGrid}>
          {programs.map((program) => {
            const coursePrice = programsPrice[program.price_search_tag];
            const isPriceLoading =
              priceLoadingStates[program.price_search_tag];

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
                {renderPlanCard(program, "self", PLAN_TYPES.SELF)}
                {renderPlanCard(program, "mentor", PLAN_TYPES.MENTOR)}
                {renderPlanCard(
                  program,
                  "professional",
                  PLAN_TYPES.PROFESSIONAL
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {isCartOpen && (
        <CartWindow
          cartItems={cartItems}
          onRemove={handleRemoveFromCart}
          onClose={() => setIsCartOpen(false)}
          fixedPrice={FIXED_PACKAGE_PRICE}
          packageName="Tech Starter Pack"
        />
      )}

      {!isCartOpen && cartItems.length > 0 && (
        <button
          className={style.cartToggleBtn}
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart size={22} />
          <span className={style.cartBadge}>{cartItems.length}</span>
        </button>
      )}
    </div>
  );
};

export default TechStarter;
