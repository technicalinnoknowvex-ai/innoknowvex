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
  const [displayPlans, setDisplayPlans] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [programsPrice, setProgramsPrice] = useState({});
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);

  // ✅ REMOVED: calculateOriginalTotal - Backend will calculate this
  // Function to create/update package info WITHOUT prices
  const updatePackageInfo = (items) => {
    const packageInfo = {
      items: items,
      fixedPrice: FIXED_PACKAGE_PRICE,
      // ✅ Backend will calculate originalPrice from database
      coursesCount: items.length,
      isTechStarterPack: true,
      packId: 'tech-starter-pack',
      packName: 'Tech Starter Pack'
    };

    sessionStorage.setItem('techStarterPackageInfo', JSON.stringify(packageInfo));
    return packageInfo;
  };

  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem("techStarterCart")) || [];
    setCartItems(items);

    const plans = {};
    const displayPlansList = {};
    items.forEach((item) => {
      plans[item.id] = item.plan;
      displayPlansList[item.id] = item.plan;
    });
    setSelectedPlans(plans);
    setDisplayPlans(displayPlansList);

    // Also check if package info exists, if not create it
    const packageInfo = JSON.parse(sessionStorage.getItem("techStarterPackageInfo"));
    if (!packageInfo && items.length > 0) {
      updatePackageInfo(items);
    }
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const fetchedPrograms = await getPrograms();

        const techPrograms = fetchedPrograms.filter(
          (p) =>
            (p.category === "Technology & Programming" || p.category === "AI & Data Science") &&
            !p.id.toLowerCase().includes("offline")
        );

        setPrograms(techPrograms);
      } catch (error) {
        console.error("Error loading programs:", error);
        toast.error("Failed to load programs", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    if (programs.length === 0) return;

    const fetchAllPrices = async () => {
      setLoading(true);

      const pricePromises = programs.map(async (course) => {
        try {
          const response = await fetch(`/api/pricingPowerPack/${course.price_search_tag}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            return { tag: course.price_search_tag, data: null };
          }

          const data = await response.json();
          return { tag: course.price_search_tag, data };
        } catch (err) {
          console.error(`Error fetching program price for ${course.price_search_tag}:`, err);
          return { tag: course.price_search_tag, data: null };
        }
      });

      const results = await Promise.all(pricePromises);

      const pricesMap = {};
      results.forEach(({ tag, data }) => {
        if (data) {
          pricesMap[tag] = data;
        }
      });

      setProgramsPrice(pricesMap);
      setLoading(false);
    };

    fetchAllPrices();
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

  const getPlanPrice = (program, plan) => {
    const coursePrice = programsPrice[program.price_search_tag];
    if (!coursePrice) return null;

    switch (plan) {
      case PLAN_TYPES.SELF:
        return coursePrice.self_current_price;
      case PLAN_TYPES.MENTOR:
        return coursePrice.mentor_current_price;
      case PLAN_TYPES.PROFESSIONAL:
        return coursePrice.professional_current_price;
      default:
        return null;
    }
  };

  const getOriginalPrice = (program, plan) => {
    const coursePrice = programsPrice[program.price_search_tag];
    if (!coursePrice) return null;

    switch (plan) {
      case PLAN_TYPES.SELF:
        return coursePrice.self_actual_price;
      case PLAN_TYPES.MENTOR:
        return coursePrice.mentor_actual_price;
      case PLAN_TYPES.PROFESSIONAL:
        return coursePrice.professional_actual_price;
      default:
        return null;
    }
  };

  const handleAddToCart = (program, plan) => {
    if (!canSelectCourse(program.id)) {
      toast.error(`Maximum ${MAX_COURSES} courses allowed!`, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    // ✅ SECURE: Store ONLY identifiers, NO PRICES
    const cartItem = {
      id: program.id,
      courseId: program.id,           // For backend lookup
      program_id: program.id,         // Alternative field name (backend compatibility)
      course: program.title,
      plan: plan,
      image: program.image,
      packId: 'tech-starter-pack',
      priceSearchTag: program.price_search_tag,  // ✅ Backend uses this to fetch real price
      // ❌ NO PRICES STORED - Backend will calculate from database
    };

    let existingCart =
      JSON.parse(sessionStorage.getItem("techStarterCart")) || [];
    existingCart = existingCart.filter((item) => item.id !== program.id);
    existingCart.push(cartItem);
    sessionStorage.setItem("techStarterCart", JSON.stringify(existingCart));

    // Update package info (without prices)
    updatePackageInfo(existingCart);

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

    // Update or remove package info
    if (existingCart.length > 0) {
      updatePackageInfo(existingCart);
    } else {
      // Remove package info if cart is empty
      sessionStorage.removeItem('techStarterPackageInfo');
    }

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

  const handlePlanSelect = (courseId, planName) => {
    setDisplayPlans((prev) => ({
      ...prev,
      [courseId]: planName,
    }));
  };

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toLocaleString("en-IN") : price;
  };

  const renderSingleCourseCard = (program, coursePrice) => {
    const courseSelected = isCourseSelected(program.id);
    const currentDisplayPlan = displayPlans[program.id] || PLAN_TYPES.SELF;
    const canSelect = canSelectCourse(program.id);

    // Get prices for all plans
    const selfPrice = {
      current: coursePrice.self_current_price,
      actual: coursePrice.self_actual_price,
    };
    const mentorPrice = {
      current: coursePrice.mentor_current_price,
      actual: coursePrice.mentor_actual_price,
    };
    const professionalPrice = {
      current: coursePrice.professional_current_price,
      actual: coursePrice.professional_actual_price,
    };

    // Get current display plan pricing
    let currentPrice, actualPrice;
    if (currentDisplayPlan === PLAN_TYPES.MENTOR) {
      currentPrice = mentorPrice.current;
      actualPrice = mentorPrice.actual;
    } else if (currentDisplayPlan === PLAN_TYPES.PROFESSIONAL) {
      currentPrice = professionalPrice.current;
      actualPrice = professionalPrice.actual;
    } else {
      currentPrice = selfPrice.current;
      actualPrice = selfPrice.actual;
    }

    const discount = Math.round(((actualPrice - currentPrice) / actualPrice) * 100);
    const isSelected = isPlanSelected(program.id, currentDisplayPlan);

    return (
      <div
        className={`${style.planCard} ${isSelected ? style.selectedCard : ""}`}
        key={program.id}
      >
        {/* Image Section */}
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
          {/* Program Header with View Details */}
          <div className={style.programInfo}>
            <h3 className={style.programTitle}>{program.title}</h3>
            <button
              className={style.exploreBtn}
              onClick={() => handleExplore(program)}
            >
              View Details <ExternalLink size={14} />
            </button>
          </div>

          {/* Plan Selector Toggle */}
          <div className={style.planSelectorContainer}>
            <label className={style.planSelectorLabel}>Select Plan:</label>
            <div className={style.planToggleGroup}>
              <button
                className={`${style.planToggle} ${currentDisplayPlan === PLAN_TYPES.SELF ? style.planToggleActive : ""}`}
                onClick={() => handlePlanSelect(program.id, PLAN_TYPES.SELF)}
              >
                Self
              </button>
              <button
                className={`${style.planToggle} ${currentDisplayPlan === PLAN_TYPES.MENTOR ? style.planToggleActive : ""}`}
                onClick={() => handlePlanSelect(program.id, PLAN_TYPES.MENTOR)}
              >
                Mentor
              </button>
              <button
                className={`${style.planToggle} ${currentDisplayPlan === PLAN_TYPES.PROFESSIONAL ? style.planToggleActive : ""}`}
                onClick={() => handlePlanSelect(program.id, PLAN_TYPES.PROFESSIONAL)}
              >
                Professional
              </button>
            </div>
          </div>

          {/* All Plans Pricing */}
          <div className={style.allPlansInfo}>
            <div className={style.planPriceRow}>
              <span className={style.planNameSmall}>Self: ₹{formatPrice(selfPrice.current)}</span>
              <span className={style.planPriceSmall}>₹{formatPrice(selfPrice.actual)}</span>
            </div>
            <div className={style.planPriceRow}>
              <span className={style.planNameSmall}>Mentor: ₹{formatPrice(mentorPrice.current)}</span>
              <span className={style.planPriceSmall}>₹{formatPrice(mentorPrice.actual)}</span>
            </div>
            <div className={style.planPriceRow}>
              <span className={style.planNameSmall}>Professional: ₹{formatPrice(professionalPrice.current)}</span>
              <span className={style.planPriceSmall}>₹{formatPrice(professionalPrice.actual)}</span>
            </div>
          </div>

          {/* Package Info */}
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
              onClick={() => handleAddToCart(program, currentDisplayPlan)}
              disabled={!canSelect}
            >
              <span>
                {!canSelect ? "Pack Full" : "Add to Pack"}
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

  const handleExplore = (program) => {
    window.open(`/programs/${program.id}`, "_blank");
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
                className={`${style.value} ${getMentorPlansCount() >= MIN_MENTOR_PLANS
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

            if (!coursePrice) return null;

            return renderSingleCourseCard(program, coursePrice);
          })}
        </div>
      </div>

      {isCartOpen && (
        <CartWindow
          cartItems={cartItems}
          programsPrice={programsPrice} 
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