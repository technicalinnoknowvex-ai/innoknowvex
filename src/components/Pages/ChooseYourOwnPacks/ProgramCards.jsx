

"use client";
import React, { useState, useEffect } from "react";
import style from "./style/packs.module.scss";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ShoppingCart, ExternalLink } from "lucide-react";
import CartWindow from "./CartWindow";

const ProgramCards = ({
  programs,
  programsPrice,
  priceLoadingStates,
  selectedCategory,
  loading,
  onCountChange,
}) => {
  const router = useRouter();
  const [selectedPlans, setSelectedPlans] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const MAX_COURSES = 4;

  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    setCartItems(items);

    const plans = {};
    items.forEach((item) => {
      plans[item.id] = item.plan;
    });
    setSelectedPlans(plans);
  }, []);

  const getSelectedCoursesCount = () => {
    return Object.keys(selectedPlans).length;
  };

  useEffect(() => {
    onCountChange(getSelectedCoursesCount());
  }, [selectedPlans, onCountChange]);

  const isPlanSelected = (courseId, planName) => {
    return selectedPlans[courseId] === planName;
  };

  const isCourseSelected = (courseId) => {
    return courseId in selectedPlans;
  };

  const canSelectCourse = (courseId) => {
    return isCourseSelected(courseId) || getSelectedCoursesCount() < MAX_COURSES;
  };

  // ✅ SECURE: Store only identifiers, NO PRICES
  const handleAddToCart = (program, plan) => {
    if (!canSelectCourse(program.id)) {
      toast.error(`Maximum ${MAX_COURSES} courses allowed!`, {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
      return;
    }

    // ✅ SECURE: Only store course identifiers and metadata
    // Backend will fetch real prices from database
    const cartItem = {
      id: program.id,
      courseId: program.id,
      program_id: program.id,
      courseName: program.title, // ✅ For display only
      course: program.title,
      plan: plan,
      priceSearchTag: program.price_search_tag, // ✅ CRITICAL: Backend uses this to fetch real price
      price_search_tag: program.price_search_tag, // Alternative field name
      image: program.image,
      // ❌ NO PRICES STORED
      // Backend will calculate from pricing table using priceSearchTag
    };

    let existingCart = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    existingCart = existingCart.filter((item) => item.id !== program.id);
    existingCart.push(cartItem);
    sessionStorage.setItem("cartItems", JSON.stringify(existingCart));

    setCartItems(existingCart);
    setSelectedPlans((prev) => ({
      ...prev,
      [program.id]: plan,
    }));

    setIsCartOpen(true);

    toast.success(`${plan} plan added to pack!`, {
      position: "top-right",
      autoClose: 1000,
      theme: "colored",
    });
  };

  const handleRemoveFromCart = (courseId) => {
    let existingCart = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    existingCart = existingCart.filter((item) => item.id !== courseId);
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
      theme: "colored",
    });
  };

  const handleExplore = (item) => {
    router.push(`/programs/${item.id}`);
  };

  const formatPrice = (price) => {
    return typeof price === "number" ? price.toLocaleString("en-IN") : price;
  };

  const filteredPrograms =
    !programs || programs.length === 0
      ? []
      : selectedCategory === "all"
      ? programs
      : programs.filter((p) => p.category === selectedCategory);

  const renderPlanCard = (program, planType, planName, currentPrice, actualPrice) => {
    const discount = Math.round(((actualPrice - currentPrice) / actualPrice) * 100);
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
          <Image src={program.image} fill alt={program.title} style={{ objectFit: "cover" }} />
          <div className={style.imageOverlay}></div>
        </div>

        <div className={style.planDetailsSection}>
          <div className={style.programInfo}>
            <h3 className={style.programTitle}>{program.title}</h3>
            <button className={style.exploreBtn} onClick={() => handleExplore(program)}>
              View Details <ExternalLink size={14} />
            </button>
          </div>

          <div className={style.planTypeTag}>{planName} Plan</div>

          <div className={style.pricingInfo}>
            <div className={style.priceGroup}>
              <span className={style.currentPrice}>₹{formatPrice(currentPrice)}</span>
              <span className={style.originalPrice}>₹{formatPrice(actualPrice)}</span>
            </div>
            <div className={style.discountBadge}>{discount}% OFF</div>
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
              onClick={() => handleAddToCart(program, planName)} // ✅ No price parameter
              disabled={isDisabled || !canSelect}
            >
              <span>
                {isDisabled ? "Another Plan Selected" : !canSelect ? "Pack Full" : "Add to Pack"}
              </span>
            </button>
          )}
        </div>

        {isSelected && (
          <div className={style.selectedBadge}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" />
            </svg>
            Added
          </div>
        )}
      </div>
    );
  };

  if (!programs || programs.length === 0) {
    return (
      <div className={style.loadingContainer}>
        <div className={style.loadingSpinner}></div>
        <p>Loading programs...</p>
      </div>
    );
  }

  return (
    <>
      {cartItems.length > 0 && (
        <div className={style.viewCartButtonContainer}>
          <button className={style.viewCartButton} onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={20} />
            View Pack ({cartItems.length}/4)
          </button>
        </div>
      )}

      {loading && (
        <div className={style.loadingContainer}>
          <div className={style.loadingSpinner}></div>
          <p>Loading courses and pricing...</p>
        </div>
      )}

      {!loading && (
        <div className={style.plansGrid}>
          {filteredPrograms.map((program) => {
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
                {renderPlanCard(program, "self", "Self", coursePrice.self_current_price, coursePrice.self_actual_price)}
                {renderPlanCard(
                  program,
                  "mentor",
                  "Mentor",
                  coursePrice.mentor_current_price,
                  coursePrice.mentor_actual_price
                )}
                {renderPlanCard(
                  program,
                  "professional",
                  "Professional",
                  coursePrice.professional_current_price,
                  coursePrice.professional_actual_price
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {isCartOpen && (
        <CartWindow 
          cartItems={cartItems} 
          programsPrice={programsPrice} 
          onRemove={handleRemoveFromCart} 
          onClose={() => setIsCartOpen(false)} 
        />
      )}

      {!isCartOpen && cartItems.length > 0 && (
        <button className={style.cartToggleBtn} onClick={() => setIsCartOpen(true)}>
          <ShoppingCart size={22} />
          <span className={style.cartBadge}>{cartItems.length}</span>
        </button>
      )}
    </>
  );
};

export default ProgramCards;