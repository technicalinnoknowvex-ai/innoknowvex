"use client";
import React, { useState, useEffect, useRef } from "react";
import style from "./style/coursesinfo.module.scss";
import SideNavigation from "../../SideNavigation/SideNavigation";
import Image from "next/image";
import { getPrograms, updateProgram, uploadImage, deleteImage, uploadBrochure, deleteBrochure } from "@/app/api/programs/programs";
import { getPricingByCourse, upsertPricing, calculateSavings } from "@/app/api/programs/programs";
import { Icon } from "@iconify/react/dist/iconify.js";

const CoursesInfoPage = () => {
  const [programsData, setProgramsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const gap = 30;
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const brochureInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    brochure: "",
    overview: "",
    skills: [],
    price_search_tag: "",
    category: "",
    // Pricing fields
    self_actual_price: "",
    self_current_price: "",
    mentor_actual_price: "",
    mentor_current_price: "",
    professional_actual_price: "",
    professional_current_price: "",
    currency: "INR"
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [brochureFile, setBrochureFile] = useState(null);
  const [brochureFileName, setBrochureFileName] = useState("");
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    const calculateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        setContainerWidth(container.offsetWidth);
        const card = container.querySelector(`.${style.programCard}`);
        if (card) setCardWidth(card.offsetWidth);
      }
    };
    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, [programsData.length]);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await getPrograms();
      setProgramsData(data);
    } catch (error) {
      console.error("Failed to load programs:", error);
      alert("Failed to load programs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardsToShow = containerWidth > 0 && cardWidth > 0
    ? Math.floor(containerWidth / (cardWidth + gap))
    : 3;

  const maxIndex = Math.max(0, programsData.length - cardsToShow);

  const nextSlide = () => {
    if (currentIndex < maxIndex) setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrochureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Brochure size should be less than 10MB");
        return;
      }
      setBrochureFile(file);
      setBrochureFileName(file.name);
    }
  };

  const handleSkillAdd = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      image: "",
      brochure: "",
      overview: "",
      skills: [],
      price_search_tag: "",
      category: "",
      self_actual_price: "",
      self_current_price: "",
      mentor_actual_price: "",
      mentor_current_price: "",
      professional_actual_price: "",
      professional_current_price: "",
      currency: "INR"
    });
    setImageFile(null);
    setImagePreview("");
    setBrochureFile(null);
    setBrochureFileName("");
    setSkillInput("");
    setEditMode(false);
    setEditingProgramId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (brochureInputRef.current) {
      brochureInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!formData.category) {
      alert("Please select a category");
      return false;
    }

    // Validate pricing fields
    const priceFields = [
      'self_actual_price', 'self_current_price',
      'mentor_actual_price', 'mentor_current_price',
      'professional_actual_price', 'professional_current_price'
    ];

    for (const field of priceFields) {
      if (formData[field] && isNaN(parseFloat(formData[field]))) {
        alert(`Please enter a valid number for ${field.replace(/_/g, ' ')}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      let imageUrl = formData.image;
      let brochureUrl = formData.brochure;

      // Handle image upload if new image is selected
      if (imageFile) {
        if (formData.image) {
          try {
            await deleteImage(formData.image);
          } catch (error) {
            console.error("Failed to delete old image:", error);
          }
        }

        const uploadResult = await uploadImage(imageFile, editingProgramId);
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // Handle brochure upload if new brochure is selected
      if (brochureFile) {
        if (formData.brochure) {
          try {
            await deleteBrochure(formData.brochure);
          } catch (error) {
            console.error("Failed to delete old brochure:", error);
          }
        }

        const uploadResult = await uploadBrochure(brochureFile, editingProgramId);
        if (uploadResult.success) {
          brochureUrl = uploadResult.url;
        } else {
          throw new Error("Failed to upload brochure");
        }
      }

      // Update program data
      const programData = {
        image: imageUrl,
        brochure: brochureUrl,
        overview: formData.overview.trim(),
        skills: formData.skills,
        price_search_tag: formData.price_search_tag.trim(),
        category: formData.category
      };

      const result = await updateProgram(editingProgramId, programData);
      if (!result.success) {
        throw new Error("Failed to update program");
      }

      // Update pricing data
      const pricingData = {
        self_actual_price: formData.self_actual_price || 0,
        self_current_price: formData.self_current_price || 0,
        mentor_actual_price: formData.mentor_actual_price || 0,
        mentor_current_price: formData.mentor_current_price || 0,
        professional_actual_price: formData.professional_actual_price || 0,
        professional_current_price: formData.professional_current_price || 0,
        currency: formData.currency
      };

      const pricingResult = await upsertPricing(formData.title, pricingData);
      if (!pricingResult.success) {
        console.error("Failed to update pricing:", pricingResult.error);
        alert("Course updated but pricing update failed. Please try again.");
      } else {
        alert("Course and pricing updated successfully!");
      }

      resetForm();
      await loadPrograms();
    } catch (error) {
      console.error("Error updating course:", error);
      alert(error.message || "Failed to update course. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (program) => {
    setEditMode(true);
    setEditingProgramId(program.id);
    
    // Fetch pricing data
    const pricingData = await getPricingByCourse(program.title);
    
    setFormData({
      title: program.title || "",
      image: program.image || "",
      brochure: program.brochure || "",
      overview: program.overview || "",
      skills: program.skills || [],
      price_search_tag: program.price_search_tag || "",
      category: program.category || "",
      self_actual_price: pricingData?.self_actual_price || "",
      self_current_price: pricingData?.self_current_price || "",
      mentor_actual_price: pricingData?.mentor_actual_price || "",
      mentor_current_price: pricingData?.mentor_current_price || "",
      professional_actual_price: pricingData?.professional_actual_price || "",
      professional_current_price: pricingData?.professional_current_price || "",
      currency: pricingData?.currency || "INR"
    });
    
    setImagePreview(program.image || "");
    // setBrochureFileName(program.brochure ? "Current brochure" : "");
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    if (window.confirm("Are you sure you want to cancel editing? All unsaved changes will be lost.")) {
      resetForm();
    }
  };

  const totalStudents = programsData.reduce((sum, program) => {
    return sum + (program.students_count || 0);
  }, 0);

  const showNavigation = programsData.length > cardsToShow;
  const translateX = -(currentIndex * (cardWidth + gap));

  // Calculate savings for display
  const selfSavings = calculateSavings(
    parseFloat(formData.self_actual_price) || 0,
    parseFloat(formData.self_current_price) || 0
  );
  const mentorSavings = calculateSavings(
    parseFloat(formData.mentor_actual_price) || 0,
    parseFloat(formData.mentor_current_price) || 0
  );
  const professionalSavings = calculateSavings(
    parseFloat(formData.professional_actual_price) || 0,
    parseFloat(formData.professional_current_price) || 0
  );

  return (
    <>
      <div className={style.main}>
        <SideNavigation />
        <div className={style.coursesInfoContent}>
          {!editMode && (
            <div className={style.figures}>
              <p>Total Students: {totalStudents}</p>
              <p>Total Courses: {programsData.length}</p>
            </div>
          )}

          {editMode && (
            <>
              <div className={style.formHeader}>
                <h2 className={style.formTitle}>Edit Course: {formData.title}</h2>
                <button
                  className={style.cancelEditBtn}
                  onClick={handleCancelEdit}
                  type="button"
                >
                  <Icon icon="lucide:x" />
                  Cancel Edit
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={style.inputGrid}>
                  <div className={style.inputField}>
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="programming">Programming</option>
                      <option value="data-science">Data Science</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-development">Mobile Development</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                    </select>
                  </div>

                  <div className={style.inputField}>
                    <label htmlFor="price_search_tag">Price Tag</label>
                    <input
                      type="text"
                      id="price_search_tag"
                      name="price_search_tag"
                      placeholder="e.g., ₹5000"
                      value={formData.price_search_tag}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={style.inputField}>
                    <label htmlFor="currency">Currency</label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  {/* Pricing Section Header */}
                  <div className={`${style.inputField} ${style.fullWidth}`}>
                    <div className={style.sectionHeader}>
                      <Icon icon="lucide:indian-rupee" />
                      <h3>Pricing Information</h3>
                    </div>
                  </div>

                  {/* Self-Paced Pricing */}
                  <div className={`${style.inputField} ${style.fullWidth}`}>
                    <div className={style.pricingGroup}>
                      <h4 className={style.pricingTitle}>
                        <Icon icon="lucide:user" />
                        Self-Paced Learning
                        {selfSavings > 0 && (
                          <span className={style.savingsBadge}>{selfSavings}% OFF</span>
                        )}
                      </h4>
                      <div className={style.pricingInputs}>
                        <div className={style.inputField}>
                          <label htmlFor="self_actual_price">Actual Price</label>
                          <input
                            type="number"
                            id="self_actual_price"
                            name="self_actual_price"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.self_actual_price}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className={style.inputField}>
                          <label htmlFor="self_current_price">Current Price</label>
                          <input
                            type="number"
                            id="self_current_price"
                            name="self_current_price"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.self_current_price}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mentor-Led Pricing */}
                  <div className={`${style.inputField} ${style.fullWidth}`}>
                    <div className={style.pricingGroup}>
                      <h4 className={style.pricingTitle}>
                        <Icon icon="lucide:users" />
                        Mentor-Led Learning
                        {mentorSavings > 0 && (
                          <span className={style.savingsBadge}>{mentorSavings}% OFF</span>
                        )}
                      </h4>
                      <div className={style.pricingInputs}>
                        <div className={style.inputField}>
                          <label htmlFor="mentor_actual_price">Actual Price</label>
                          <input
                            type="number"
                            id="mentor_actual_price"
                            name="mentor_actual_price"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.mentor_actual_price}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className={style.inputField}>
                          <label htmlFor="mentor_current_price">Current Price</label>
                          <input
                            type="number"
                            id="mentor_current_price"
                            name="mentor_current_price"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.mentor_current_price}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Pricing */}
                  <div className={`${style.inputField} ${style.fullWidth}`}>
                    <div className={style.pricingGroup}>
                      <h4 className={style.pricingTitle}>
                        <Icon icon="lucide:briefcase" />
                        Professional Track
                        {professionalSavings > 0 && (
                          <span className={style.savingsBadge}>{professionalSavings}% OFF</span>
                        )}
                      </h4>
                      <div className={style.pricingInputs}>
                        <div className={style.inputField}>
                          <label htmlFor="professional_actual_price">Actual Price</label>
                          <input
                            type="number"
                            id="professional_actual_price"
                            name="professional_actual_price"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.professional_actual_price}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className={style.inputField}>
                          <label htmlFor="professional_current_price">Current Price</label>
                          <input
                            type="number"
                            id="professional_current_price"
                            name="professional_current_price"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.professional_current_price}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${style.inputField} ${style.fullWidth}`}>
                    <label htmlFor="brochure">Course Brochure</label>
                    <input
                      type="file"
                      id="brochure"
                      name="brochure"
                      accept=".pdf,.doc,.docx"
                      ref={brochureInputRef}
                      onChange={handleBrochureChange}
                      className={style.fileInput}
                    />
                    {brochureFileName && (
                      <div className={style.fileNameDisplay}>
                        <Icon icon="lucide:file-text" />
                        <span>{brochureFileName}</span>
                      </div>
                    )}
                  </div>

                  <div className={`${style.inputField} ${style.fullWidth}`}>
                    <label htmlFor="image">Course Image</label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className={style.fileInput}
                    />
                    {imagePreview && (
                      <div className={style.imagePreview}>
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={200}
                          height={150}
                          className={style.previewImg}
                        />
                      </div>
                    )}
                  </div>

                  <div className={`${style.inputField} ${style.fullWidth}`}>
                    <label htmlFor="skills">Skills</label>
                    <div className={style.skillsInput}>
                      <input
                        type="text"
                        id="skills"
                        name="skills"
                        placeholder="Add a skill and press Add"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSkillAdd();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={style.addSkillBtn}
                        onClick={handleSkillAdd}
                      >
                        <Icon icon="lucide:plus" />
                        Add
                      </button>
                    </div>
                    {formData.skills.length > 0 && (
                      <div className={style.skillsList}>
                        {formData.skills.map((skill, index) => (
                          <span key={index} className={style.skillTag}>
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleSkillRemove(index)}
                              className={style.removeSkillBtn}
                            >
                              <Icon icon="lucide:x" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`${style.inputField} ${style.fullWidth}`}>
                    <label htmlFor="overview">Overview</label>
                    <textarea
                      id="overview"
                      name="overview"
                      rows="6"
                      placeholder="Enter course overview"
                      value={formData.overview}
                      onChange={handleInputChange}
                    />

                    <div className={style.submitButton}>
                      <button type="submit" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Icon icon="lucide:loader-2" className={style.buttonSpinner} />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Icon icon="lucide:save" />
                            Update Course
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}

          <div className={style.allCoursesSection}>
            <h2 className={style.sectionTitle}>
              All Courses {programsData.length > 0 && `(${programsData.length})`}
            </h2>

            {loading ? (
              <div className={style.loadingState}>
                <Icon icon="lucide:loader-2" className={style.spinner} />
                Loading courses...
              </div>
            ) : programsData.length === 0 ? (
              <div className={style.emptyState}>
                <Icon icon="lucide:inbox" className={style.emptyIcon} />
                <p>No courses available</p>
              </div>
            ) : (
              <div className={style.carouselContainer} ref={containerRef}>
                {showNavigation && (
                  <>
                    <button
                      className={`${style.navButton} ${style.navButtonLeft}`}
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                      aria-label="Previous courses"
                    >
                      <Icon icon="famicons:chevron-back" style={{ width: "24px", height: "24px" }} />
                    </button>
                    <button
                      className={`${style.navButton} ${style.navButtonRight}`}
                      onClick={nextSlide}
                      disabled={currentIndex >= maxIndex}
                      aria-label="Next courses"
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
                    {programsData.map((program) => (
                      <div 
                        key={program.id} 
                        className={`${style.programCard} ${editingProgramId === program.id ? style.editing : ''}`}
                      >
                        <div className={style.cardImageWrapper}>
                          <Image
                            src={program.image || "https://via.placeholder.com/400x250"}
                            alt={program.title}
                            width={400}
                            height={250}
                            className={style.cardImage}
                          />
                        </div>
                        <div className={style.cardContent}>
                          <h3 className={style.cardTitle}>{program.title}</h3>
                          <button 
                            className={style.editButton}
                            onClick={() => handleEdit(program)}
                          >
                            <Icon icon="lucide:edit" />
                            Edit Course
                          </button>
                        </div>

                        {editingProgramId === program.id && (
                          <div className={style.editingBadge}>
                            <Icon icon="lucide:edit-3" />
                            Editing
                          </div>
                        )}
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

export default CoursesInfoPage;