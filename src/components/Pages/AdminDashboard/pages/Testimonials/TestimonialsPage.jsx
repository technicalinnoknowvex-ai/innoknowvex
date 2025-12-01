"use client";
import React, { useState, useEffect, useRef } from "react";
import style from "./style/testimonials.module.scss";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/app/(backend)/api/testimonials/testimonials";
import { Icon } from "@iconify/react/dist/iconify.js";

const TestimonialsPage = () => {
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const gap = 30;
  const containerRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    testimonial: "",
    name: "",
    profession: "",
    avatar: "",
    position: "top",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    const calculateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        setContainerWidth(container.offsetWidth);
        const card = container.querySelector(`.${style.testimonialCardAdmin}`);
        if (card) setCardWidth(card.offsetWidth);
      }
    };
    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, [testimonialsData.length]);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonialsData(data);
    } catch (error) {
      console.error("Failed to load testimonials:", error);
      alert("Failed to load testimonials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardsToShow =
    containerWidth > 0 && cardWidth > 0
      ? Math.floor(containerWidth / (cardWidth + gap))
      : 3;

  const maxIndex = Math.max(0, testimonialsData.length - cardsToShow);

  const nextSlide = () => {
    if (currentIndex < maxIndex) setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Avatar size should be less than 5MB");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      testimonial: "",
      name: "",
      profession: "",
      avatar: "",
      position: "top",
    });
    setAvatarFile(null);
    setAvatarPreview("");
    setEditMode(false);
    setEditingTestimonialId(null);

    // Reset file input
    const fileInput = document.getElementById("avatar");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validateForm = () => {
    if (!formData.testimonial.trim()) {
      alert("Please enter a testimonial");
      return false;
    }
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return false;
    }
    if (!formData.profession.trim()) {
      alert("Please enter a profession");
      return false;
    }
    if (!editMode && !formData.avatar) {
      alert("Please upload an avatar");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const testimonialData = {
        testimonial: formData.testimonial.trim(),
        name: formData.name.trim(),
        profession: formData.profession.trim(),
        position: formData.position,
      };

      // Only include avatar if it's been changed or it's a new testimonial
      if (formData.avatar) {
        testimonialData.avatar = formData.avatar;
      }

      if (editMode) {
        const result = await updateTestimonial(
          editingTestimonialId,
          testimonialData
        );
        if (result.success) {
          alert("Testimonial updated successfully!");
          resetForm();
          await loadTestimonials();
        }
      } else {
        const result = await createTestimonial(testimonialData);
        if (result.success) {
          alert("Testimonial created successfully!");
          resetForm();
          await loadTestimonials();
        }
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert(error.message || "Failed to submit testimonial. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditMode(true);
    setEditingTestimonialId(testimonial.id);
    setFormData({
      testimonial: testimonial.testimonial,
      name: testimonial.name,
      profession: testimonial.profession,
      avatar: testimonial.avatar,
      position: testimonial.position,
    });
    setAvatarPreview(testimonial.avatar);

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (testimonialId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this testimonial? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const result = await deleteTestimonial(testimonialId);
      if (result.success) {
        alert("Testimonial deleted successfully!");
        await loadTestimonials();

        // If we're editing the deleted testimonial, reset the form
        if (editingTestimonialId === testimonialId) {
          resetForm();
        }

        // Reset carousel index if needed
        if (
          currentIndex > 0 &&
          currentIndex >= testimonialsData.length - cardsToShow - 1
        ) {
          setCurrentIndex(Math.max(0, currentIndex - 1));
        }
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert(error.message || "Failed to delete testimonial. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel editing? All unsaved changes will be lost."
      )
    ) {
      resetForm();
    }
  };

  const truncateText = (text, maxLength = 100) =>
    text?.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text || "";

  const showNavigation = testimonialsData.length > cardsToShow;
  const translateX = -(currentIndex * (cardWidth + gap));

  return (
    <>
      <div className={style.main}>
        <div className={style.pageInner}>
          <div className={style.testimonialInfoContent}>
          <div className={style.formHeader}>
            <h2 className={style.formTitle}>
              {editMode ? "Edit Testimonial" : "Create New Testimonial"}
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
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter person's name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={style.inputField}>
                <label htmlFor="profession">Profession *</label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  placeholder="Enter profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={style.inputField}>
                <label htmlFor="position">Position</label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                >
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>

              <div className={style.inputField}>
                <label htmlFor="avatar">
                  Upload Avatar *{" "}
                  {editMode && "(Leave empty to keep current avatar)"}
                </label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  required={!editMode}
                />
                {avatarPreview && (
                  <div className={style.avatarPreviewContainer}>
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className={style.avatarPreview}
                    />
                    <button
                      type="button"
                      className={style.removeAvatarBtn}
                      onClick={() => {
                        setAvatarPreview("");
                        setAvatarFile(null);
                        setFormData((prev) => ({ ...prev, avatar: "" }));
                        const fileInput = document.getElementById("avatar");
                        if (fileInput) fileInput.value = "";
                      }}
                    >
                      <Icon icon="lucide:x" />
                    </button>
                  </div>
                )}
              </div>

              <div className={`${style.inputField} ${style.fullWidth}`}>
                <label htmlFor="testimonial">Testimonial *</label>
                <textarea
                  id="testimonial"
                  name="testimonial"
                  rows="6"
                  placeholder="Enter testimonial text"
                  value={formData.testimonial}
                  onChange={handleInputChange}
                  required
                />

                <div className={style.submitButton}>
                  <button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Icon
                          icon="lucide:loader-2"
                          className={style.buttonSpinner}
                        />
                        {editMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Icon icon={editMode ? "lucide:save" : "lucide:plus"} />
                        {editMode ? "Update Testimonial" : "Create Testimonial"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* All Testimonials Section with Carousel */}
          <div className={style.allTestimonialsSection}>
            <h2 className={style.sectionTitle}>
              All Testimonials{" "}
              {testimonialsData.length > 0 && `(${testimonialsData.length})`}
            </h2>

            {loading ? (
              <div className={style.loadingState}>
                <Icon icon="lucide:loader-2" className={style.spinner} />
                Loading testimonials...
              </div>
            ) : testimonialsData.length === 0 ? (
              <div className={style.emptyState}>
                <Icon icon="lucide:inbox" className={style.emptyIcon} />
                <p>No testimonials available</p>
                <p className={style.emptySubtext}>
                  Create your first testimonial to get started!
                </p>
              </div>
            ) : (
              <div className={style.carouselContainer} ref={containerRef}>
                {showNavigation && (
                  <>
                    <button
                      className={`${style.navButton} ${style.navButtonLeft}`}
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                      aria-label="Previous testimonials"
                    >
                      <Icon
                        icon="famicons:chevron-back"
                        style={{ width: "24px", height: "24px" }}
                      />
                    </button>
                    <button
                      className={`${style.navButton} ${style.navButtonRight}`}
                      onClick={nextSlide}
                      disabled={currentIndex >= maxIndex}
                      aria-label="Next testimonials"
                    >
                      <Icon
                        icon="famicons:chevron-forward"
                        style={{ width: "24px", height: "24px" }}
                      />
                    </button>
                  </>
                )}
                <div className={style.cardsContainer}>
                  <div
                    className={style.cardsWrapper}
                    style={{
                      transform: `translateX(${translateX}px)`,
                      gap: `${gap}px`,
                    }}
                  >
                    {testimonialsData.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className={`${style.testimonialCardAdmin} ${
                          editingTestimonialId === testimonial.id
                            ? style.editing
                            : ""
                        }`}
                      >
                        <div className={style.cardContentAdmin}>
                          {testimonial.position === "top" && (
                            <div className={style.authorInfo}>
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className={style.avatar}
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/80x80?text=Avatar";
                                }}
                              />
                              <div className={style.authorDetails}>
                                <h3 className={style.authorName}>
                                  {testimonial.name}
                                </h3>
                                <p className={style.authorProfession}>
                                  {testimonial.profession}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className={style.testimonialText}>
                            <Icon
                              icon="lucide:quote"
                              className={style.quoteIcon}
                            />
                            <p>{truncateText(testimonial.testimonial, 150)}</p>
                          </div>

                          {testimonial.position === "bottom" && (
                            <div className={style.authorInfo}>
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className={style.avatar}
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/80x80?text=Avatar";
                                }}
                              />
                              <div className={style.authorDetails}>
                                <h3 className={style.authorName}>
                                  {testimonial.name}
                                </h3>
                                <p className={style.authorProfession}>
                                  {testimonial.profession}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className={style.cardMeta}>
                            <span className={style.dateTag}>
                              {testimonial.date
                                ? new Date(testimonial.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "No Date"}
                            </span>
                          </div>

                          <div className={style.cardActions}>
                            <button
                              className={style.actionBtn}
                              onClick={() => handleEdit(testimonial)}
                              title="Edit"
                              aria-label="Edit testimonial"
                            >
                              <Icon icon="lucide:edit" />
                            </button>
                            <button
                              className={`${style.actionBtn} ${style.deleteBtn}`}
                              onClick={() => handleDelete(testimonial.id)}
                              title="Delete"
                              aria-label="Delete testimonial"
                            >
                              <Icon icon="lucide:trash-2" />
                            </button>
                          </div>

                          {editingTestimonialId === testimonial.id && (
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
      </div>
    </>
  );
};

export default TestimonialsPage;
