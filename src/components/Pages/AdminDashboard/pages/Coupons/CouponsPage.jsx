"use client";
import React, { useState, useEffect, useRef } from "react";
import style from "./style/coupons.module.scss";
import SideNavigation from "../../SideNavigation/SideNavigation";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/app/api/validate-coupon/route";
import { getPrograms } from "@/app/api/programs/programs";
import { Icon } from "@iconify/react/dist/iconify.js";

const CouponsPage = () => {
  const [couponsData, setCouponsData] = useState([]);
  const [programsData, setProgramsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const gap = 30;
  const containerRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage",
    percentage_discount: "",
    fixed_amount_discount: "",
    min_order_amount: "",
    max_uses: "",
    valid_from: "",
    valid_until: "",
    is_active: true,
    applicable_courses: [],
    max_order_amount: ""
  });

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectAllCourses, setSelectAllCourses] = useState(false);
  const [showCourseSelector, setShowCourseSelector] = useState(false);

  useEffect(() => {
    loadCoupons();
    loadPrograms();
  }, []);

  useEffect(() => {
    const calculateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        setContainerWidth(container.offsetWidth);
        const card = container.querySelector(`.${style.couponCardAdmin}`);
        if (card) setCardWidth(card.offsetWidth);
      }
    };
    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, [couponsData.length]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCouponsData(data);
    } catch (error) {
      console.error("Failed to load coupons:", error);
      alert("Failed to load coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async () => {
    try {
      setProgramsLoading(true);
      const data = await getPrograms();
      setProgramsData(data);
    } catch (error) {
      console.error("Failed to load programs:", error);
      alert("Failed to load programs. Please try again.");
    } finally {
      setProgramsLoading(false);
    }
  };

  const cardsToShow = containerWidth > 0 && cardWidth > 0
    ? Math.floor(containerWidth / (cardWidth + gap))
    : 3;

  const maxIndex = Math.max(0, couponsData.length - cardsToShow);

  const nextSlide = () => {
    if (currentIndex < maxIndex) setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDiscountTypeChange = (e) => {
    const discountType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      discount_type: discountType,
      percentage_discount: discountType === 'percentage' ? prev.percentage_discount : "",
      fixed_amount_discount: discountType !== 'percentage' ? prev.fixed_amount_discount : ""
    }));
  };

  // Course selection handlers
  const handleCourseSelection = (courseId) => {
    setSelectedCourses(prev => {
      const newSelection = prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId];
      
      // Update form data with the selected courses
      setFormData(prev => ({
        ...prev,
        applicable_courses: newSelection
      }));
      
      return newSelection;
    });
  };

  const handleSelectAllCourses = () => {
    if (selectAllCourses) {
      // Deselect all
      setSelectedCourses([]);
      setFormData(prev => ({
        ...prev,
        applicable_courses: []
      }));
    } else {
      // Select all program IDs
      const allProgramIds = programsData.map(program => program.id);
      setSelectedCourses(allProgramIds);
      setFormData(prev => ({
        ...prev,
        applicable_courses: allProgramIds
      }));
    }
    setSelectAllCourses(!selectAllCourses);
  };

  const handleSelectAllInCategory = (category) => {
    const categoryPrograms = programsData.filter(program => program.category === category);
    const categoryIds = categoryPrograms.map(program => program.id);
    
    // Check if all category programs are already selected
    const allSelected = categoryIds.every(id => selectedCourses.includes(id));
    
    if (allSelected) {
      // Deselect all in category
      setSelectedCourses(prev => prev.filter(id => !categoryIds.includes(id)));
      setFormData(prev => ({
        ...prev,
        applicable_courses: prev.applicable_courses.filter(id => !categoryIds.includes(id))
      }));
    } else {
      // Select all in category
      setSelectedCourses(prev => {
        const newSelection = [...prev];
        categoryIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        
        setFormData(prevForm => ({
          ...prevForm,
          applicable_courses: newSelection
        }));
        
        return newSelection;
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      percentage_discount: "",
      fixed_amount_discount: "",
      min_order_amount: "",
      max_uses: "",
      valid_from: "",
      valid_until: "",
      is_active: true,
      applicable_courses: [],
      max_order_amount: ""
    });
    setSelectedCourses([]);
    setSelectAllCourses(false);
    setEditMode(false);
    setEditingCouponId(null);
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      alert("Please enter a coupon code");
      return false;
    }

    if (!formData.discount_type) {
      alert("Please select a discount type");
      return false;
    }

    if (formData.discount_type === 'percentage') {
      if (!formData.percentage_discount || formData.percentage_discount < 0 || formData.percentage_discount > 100) {
        alert("Percentage discount must be between 0 and 100");
        return false;
      }
    } else {
      if (!formData.fixed_amount_discount || formData.fixed_amount_discount <= 0) {
        alert("Fixed amount discount must be greater than 0");
        return false;
      }
    }

    if (formData.valid_from && formData.valid_until && new Date(formData.valid_from) > new Date(formData.valid_until)) {
      alert("Valid from date cannot be after valid until date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const couponData = {
        code: formData.code.trim(),
        description: formData.description.trim(),
        discount_type: formData.discount_type,
        min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : 0,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null,
        is_active: formData.is_active,
        applicable_courses: formData.applicable_courses.length > 0 ? formData.applicable_courses : null,
        max_order_amount: formData.max_order_amount ? parseFloat(formData.max_order_amount) : null
      };

      // Add discount value based on type
      if (formData.discount_type === 'percentage') {
        couponData.percentage_discount = parseFloat(formData.percentage_discount);
        couponData.fixed_amount_discount = null;
      } else {
        couponData.fixed_amount_discount = parseFloat(formData.fixed_amount_discount);
        couponData.percentage_discount = null;
      }

      if (editMode) {
        const result = await updateCoupon(editingCouponId, couponData);
        if (result.success) {
          alert("Coupon updated successfully!");
          resetForm();
          await loadCoupons();
        }
      } else {
        const result = await createCoupon(couponData);
        if (result.success) {
          alert("Coupon created successfully!");
          resetForm();
          await loadCoupons();
        }
      }
    } catch (error) {
      console.error("Error submitting coupon:", error);
      alert(error.message || "Failed to submit coupon. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditMode(true);
    setEditingCouponId(coupon.id);
    
    const applicableCourses = coupon.applicable_courses || [];
    setSelectedCourses(applicableCourses);
    setSelectAllCourses(applicableCourses.length === programsData.length);
    
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discount_type: coupon.discount_type,
      percentage_discount: coupon.percentage_discount || "",
      fixed_amount_discount: coupon.fixed_amount_discount || "",
      min_order_amount: coupon.min_order_amount || "",
      max_uses: coupon.max_uses || "",
      valid_from: coupon.valid_from ? coupon.valid_from.split('T')[0] : "",
      valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : "",
      is_active: coupon.is_active,
      applicable_courses: applicableCourses,
      max_order_amount: coupon.max_order_amount || ""
    });
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (couponId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this coupon? This action cannot be undone."
    );
    
    if (!confirmDelete) return;

    try {
      const result = await deleteCoupon(couponId);
      if (result.success) {
        alert("Coupon deleted successfully!");
        await loadCoupons();
        
        // If we're editing the deleted coupon, reset the form
        if (editingCouponId === couponId) {
          resetForm();
        }
        
        // Reset carousel index if needed
        if (currentIndex > 0 && currentIndex >= couponsData.length - cardsToShow - 1) {
          setCurrentIndex(Math.max(0, currentIndex - 1));
        }
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert(error.message || "Failed to delete coupon. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    if (window.confirm("Are you sure you want to cancel editing? All unsaved changes will be lost.")) {
      resetForm();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isCouponActive = (coupon) => {
    if (!coupon.is_active) return false;
    
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) return false;
    if (coupon.valid_until && new Date(coupon.valid_until) < now) return false;
    
    return true;
  };

  // Group programs by category
  const programsByCategory = programsData.reduce((acc, program) => {
    if (!acc[program.category]) {
      acc[program.category] = [];
    }
    acc[program.category].push(program);
    return acc;
  }, {});

  const showNavigation = couponsData.length > cardsToShow;
  const translateX = -(currentIndex * (cardWidth + gap));

  return (
    <>
      <div className={style.main}>
        <SideNavigation />
        <div className={style.couponsInfoContent}>
          <div className={style.formHeader}>
            <h2 className={style.formTitle}>
              {editMode ? "Edit Coupon" : "Create New Coupon"}
            </h2>
            {editMode && (
              <button
                className={style.cancelEditBtn}
                onClick={handleCancelEdit}
                type="button"
              >
                <Icon icon="lucide:x" />
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={style.inputGrid}>
              <div className={style.inputField}>
                <label htmlFor="code">Coupon Code *</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  placeholder="e.g., SUMMER25"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={style.inputField}>
                <label htmlFor="discount_type">Discount Type *</label>
                <select
                  id="discount_type"
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleDiscountTypeChange}
                  required
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="fixed_price">Fixed Price</option>
                  <option value="minimum_price">Minimum Price</option>
                </select>
              </div>

              {formData.discount_type === 'percentage' ? (
                <div className={style.inputField}>
                  <label htmlFor="percentage_discount">Discount Percentage *</label>
                  <input
                    type="number"
                    id="percentage_discount"
                    name="percentage_discount"
                    placeholder="0-100"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.percentage_discount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ) : (
                <div className={style.inputField}>
                  <label htmlFor="fixed_amount_discount">Discount Amount *</label>
                  <input
                    type="number"
                    id="fixed_amount_discount"
                    name="fixed_amount_discount"
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    value={formData.fixed_amount_discount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className={style.inputField}>
                <label htmlFor="min_order_amount">Minimum Order Amount</label>
                <input
                  type="number"
                  id="min_order_amount"
                  name="min_order_amount"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.min_order_amount}
                  onChange={handleInputChange}
                />
              </div>

              <div className={style.inputField}>
                <label htmlFor="max_order_amount">Maximum Order Amount</label>
                <input
                  type="number"
                  id="max_order_amount"
                  name="max_order_amount"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.max_order_amount}
                  onChange={handleInputChange}
                />
              </div>

              <div className={style.inputField}>
                <label htmlFor="max_uses">Maximum Uses</label>
                <input
                  type="number"
                  id="max_uses"
                  name="max_uses"
                  placeholder="Leave empty for unlimited"
                  min="0"
                  value={formData.max_uses}
                  onChange={handleInputChange}
                />
              </div>

              <div className={style.inputField}>
                <label htmlFor="valid_from">Valid From</label>
                <input
                  type="date"
                  id="valid_from"
                  name="valid_from"
                  value={formData.valid_from}
                  onChange={handleInputChange}
                />
              </div>

              <div className={style.inputField}>
                <label htmlFor="valid_until">Valid Until</label>
                <input
                  type="date"
                  id="valid_until"
                  name="valid_until"
                  value={formData.valid_until}
                  onChange={handleInputChange}
                />
              </div>

              {/* Course Selection */}
              <div className={`${style.inputField} ${style.fullWidth}`}>
                <label>Applicable Courses</label>
                <div className={style.courseSelector}>
                  <button
                    type="button"
                    className={style.courseSelectorToggle}
                    onClick={() => setShowCourseSelector(!showCourseSelector)}
                  >
                    <span>
                      {selectedCourses.length === 0 
                        ? "Select courses (leave empty for all courses)" 
                        : `${selectedCourses.length} course(s) selected`}
                    </span>
                    <Icon 
                      icon={showCourseSelector ? "lucide:chevron-up" : "lucide:chevron-down"} 
                      className={style.selectorIcon}
                    />
                  </button>

                  {showCourseSelector && (
                    <div className={style.courseSelectorDropdown}>
                      {programsLoading ? (
                        <div className={style.loadingCourses}>
                          <Icon icon="lucide:loader-2" className={style.spinner} />
                          Loading courses...
                        </div>
                      ) : (
                        <>
                          <div className={style.courseSelectorHeader}>
                            <div className={style.courseSelectorActions}>
                              <button
                                type="button"
                                className={style.selectAllButton}
                                onClick={handleSelectAllCourses}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectAllCourses}
                                  onChange={handleSelectAllCourses}
                                />
                                <span>Select All Courses</span>
                              </button>
                              <span className={style.selectedCount}>
                                {selectedCourses.length} selected
                              </span>
                            </div>
                          </div>

                          <div className={style.courseCategories}>
                            {Object.entries(programsByCategory).map(([category, programs]) => (
                              <div key={category} className={style.courseCategory}>
                                <div className={style.categoryHeader}>
                                  <h4 className={style.categoryTitle}>
                                    {category.replace(/-/g, ' ').toUpperCase()}
                                  </h4>
                                  <button
                                    type="button"
                                    className={style.selectCategoryButton}
                                    onClick={() => handleSelectAllInCategory(category)}
                                  >
                                    Select All
                                  </button>
                                </div>
                                <div className={style.courseList}>
                                  {programs.map(program => (
                                    <label key={program.id} className={style.courseCheckbox}>
                                      <input
                                        type="checkbox"
                                        checked={selectedCourses.includes(program.id)}
                                        onChange={() => handleCourseSelection(program.id)}
                                      />
                                      <span className={style.checkboxLabel}>{program.title}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className={`${style.inputField} ${style.fullWidth}`}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Enter coupon description"
                  value={formData.description}
                  onChange={handleInputChange}
                />

                <div className={style.checkboxField}>
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="is_active">Active Coupon</label>
                </div>

                <div className={style.submitButton}>
                  <button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Icon icon="lucide:loader-2" className={style.buttonSpinner} />
                        {editMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Icon icon={editMode ? "lucide:save" : "lucide:plus"} />
                        {editMode ? "Update Coupon" : "Create Coupon"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* All Coupons Section with Carousel */}
          <div className={style.allCouponsSection}>
            <h2 className={style.sectionTitle}>
              All Coupons {couponsData.length > 0 && `(${couponsData.length})`}
            </h2>

            {loading ? (
              <div className={style.loadingState}>
                <Icon icon="lucide:loader-2" className={style.spinner} />
                Loading coupons...
              </div>
            ) : couponsData.length === 0 ? (
              <div className={style.emptyState}>
                <Icon icon="lucide:inbox" className={style.emptyIcon} />
                <p>No coupons available</p>
                <p className={style.emptySubtext}>Create your first coupon to get started!</p>
              </div>
            ) : (
              <div className={style.carouselContainer} ref={containerRef}>
                {showNavigation && (
                  <>
                    <button
                      className={`${style.navButton} ${style.navButtonLeft}`}
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                      aria-label="Previous coupons"
                    >
                      <Icon icon="famicons:chevron-back" style={{ width: "24px", height: "24px" }} />
                    </button>
                    <button
                      className={`${style.navButton} ${style.navButtonRight}`}
                      onClick={nextSlide}
                      disabled={currentIndex >= maxIndex}
                      aria-label="Next coupons"
                    >
                      <Icon icon="famicons:chevron-forward" style={{ width: "24px", height: "24px" }} />
                    </button>
                  </>
                )}
                <div className={style.cardsContainer}>
                  <div
                    className={style.cardsWrapper}
                    style={{ transform: `translateX(${translateX}px)`, gap: `${gap}px` }}
                  >
                    {couponsData.map((coupon) => (
                      <div 
                        key={coupon.id} 
                        className={`${style.couponCardAdmin} ${editingCouponId === coupon.id ? style.editing : ''} ${!isCouponActive(coupon) ? style.inactive : ''}`}
                      >
                        <div className={style.cardContentAdmin}>
                          <div className={style.cardHeader}>
                            <div className={style.couponCode}>
                              <span className={style.code}>{coupon.code}</span>
                              <span className={`${style.status} ${isCouponActive(coupon) ? style.active : style.inactive}`}>
                                {isCouponActive(coupon) ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className={style.cardActions}>
                              <button
                                className={style.actionBtn}
                                onClick={() => handleEdit(coupon)}
                                title="Edit"
                                aria-label="Edit coupon"
                              >
                                <Icon icon="lucide:edit" />
                              </button>
                              <button
                                className={`${style.actionBtn} ${style.deleteBtn}`}
                                onClick={() => handleDelete(coupon.id)}
                                title="Delete"
                                aria-label="Delete coupon"
                              >
                                <Icon icon="lucide:trash-2" />
                              </button>
                            </div>
                          </div>

                          <div className={style.discountInfo}>
                            {coupon.discount_type === 'percentage' ? (
                              <span className={style.discountPercentage}>
                                {coupon.percentage_discount}% OFF
                              </span>
                            ) : (
                              <span className={style.discountFixed}>
                                ₹{coupon.fixed_amount_discount} OFF
                              </span>
                            )}
                            <span className={style.discountType}>
                              {coupon.discount_type.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>

                          {coupon.description && (
                            <p className={style.couponDescription}>
                              {coupon.description}
                            </p>
                          )}

                          <div className={style.couponDetails}>
                            <div className={style.detailItem}>
                              <Icon icon="lucide:users" className={style.detailIcon} />
                              <span>Used: {coupon.times_used || 0}{coupon.max_uses ? ` / ${coupon.max_uses}` : ''}</span>
                            </div>
                            
                            {coupon.min_order_amount > 0 && (
                              <div className={style.detailItem}>
                                <Icon icon="lucide:indian-rupee" className={style.detailIcon} />
                                <span>Min: ₹{coupon.min_order_amount}</span>
                              </div>
                            )}

                            <div className={style.detailItem}>
                              <Icon icon="lucide:calendar" className={style.detailIcon} />
                              <span>Expires: {formatDate(coupon.valid_until)}</span>
                            </div>
                          </div>

                          {coupon.applicable_courses && coupon.applicable_courses.length > 0 && (
                            <div className={style.applicableCourses}>
                              <span className={style.coursesLabel}>
                                Applicable to: {coupon.applicable_courses.length} course(s)
                              </span>
                            </div>
                          )}

                          {editingCouponId === coupon.id && (
                            <div className={style.editingBadge}>
                              <Icon icon="lucide:edit-3" />
                              Editing
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponsPage;