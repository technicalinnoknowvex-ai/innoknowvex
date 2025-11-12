"use client";
import React, { useState, useEffect, useRef } from "react";
import style from "./style/coursesinfo.module.scss";
import SideNavigation from "../../SideNavigation/SideNavigation";
import Image from "next/image";
import { getPrograms, updateProgram, uploadImage, deleteImage, uploadBrochure, deleteBrochure } from "@/app/api/programs/programs";
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
    category: ""
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
      category: ""
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
        // Delete old image if it exists
        if (formData.image) {
          try {
            await deleteImage(formData.image);
          } catch (error) {
            console.error("Failed to delete old image:", error);
          }
        }

        // Upload new image
        const uploadResult = await uploadImage(imageFile, editingProgramId);
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // Handle brochure upload if new brochure is selected
      if (brochureFile) {
        // Delete old brochure if it exists
        if (formData.brochure) {
          try {
            await deleteBrochure(formData.brochure);
          } catch (error) {
            console.error("Failed to delete old brochure:", error);
          }
        }

        // Upload new brochure
        const uploadResult = await uploadBrochure(brochureFile, editingProgramId);
        if (uploadResult.success) {
          brochureUrl = uploadResult.url;
        } else {
          throw new Error("Failed to upload brochure");
        }
      }

      const programData = {
        image: imageUrl,
        brochure: brochureUrl,
        overview: formData.overview.trim(),
        skills: formData.skills,
        price_search_tag: formData.price_search_tag.trim(),
        category: formData.category
      };

      const result = await updateProgram(editingProgramId, programData);
      if (result.success) {
        alert("Course updated successfully!");
        resetForm();
        await loadPrograms();
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert(error.message || "Failed to update course. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (program) => {
    setEditMode(true);
    setEditingProgramId(program.id);
    
    setFormData({
      title: program.title || "",
      image: program.image || "",
      brochure: program.brochure || "",
      overview: program.overview || "",
      skills: program.skills || [],
      price_search_tag: program.price_search_tag || "",
      category: program.category || ""
    });
    
    setImagePreview(program.image || "");
    setBrochureFileName(program.brochure ? "Current brochure" : "");
    
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
                    <label htmlFor="price_search_tag">Price</label>
                    <input
                      type="text"
                      id="price_search_tag"
                      name="price_search_tag"
                      placeholder="e.g., ₹5000"
                      value={formData.price_search_tag}
                      onChange={handleInputChange}
                    />
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