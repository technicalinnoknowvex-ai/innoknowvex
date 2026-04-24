"use client";
import React, { useState, useEffect, useRef } from "react";
import style from "./style/jobsinfo.module.scss";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "@/app/(backend)/api/jobs/jobs";
import { jobPostings, jobCategories } from "@/data/jobPostings";
import { Icon } from "@iconify/react/dist/iconify.js";

const JobsInfoPage = () => {
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const gap = 30;
  const containerRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    keyResponsibilities: [],
    eligibilityCriteria: [],
    interviewProcess: [],
    skills: [],
    employment_type: "Full-Time",
    experience: "",
  });

  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    console.log('🔧 JobsInfoPage mounted - loading jobs...');
    loadJobs();
  }, []);

  useEffect(() => {
    const calculateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        setContainerWidth(container.offsetWidth);
        const card = container.querySelector(`.${style.jobCardAdmin}`);
        if (card) setCardWidth(card.offsetWidth);
      }
    };
    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, [jobsData.length]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      console.log('✅ Jobs loaded:', data);
      setJobsData(data);
    } catch (error) {
      console.error("❌ Failed to load jobs:", error);
      alert("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardsToShow =
    containerWidth > 0 && cardWidth > 0
      ? Math.floor(containerWidth / (cardWidth + gap))
      : 3;

  const maxIndex = Math.max(0, jobsData.length - cardsToShow);

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

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      keyResponsibilities: [],
      eligibilityCriteria: [],
      interviewProcess: [],
      skills: [],
      employment_type: "Full-Time",
      experience: "",
    });
    setSkillInput("");
    setEditMode(false);
    setEditingJobId(null);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Please enter a job title");
      return false;
    }
    if (!formData.category.trim()) {
      alert("Please select a category");
      return false;
    }
    if (!formData.description.trim()) {
      alert("Please enter a job description");
      return false;
    }
    if (formData.skills.length === 0) {
      alert("Please add at least one skill");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const jobData = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        keyResponsibilities: formData.keyResponsibilities,
        eligibilityCriteria: formData.eligibilityCriteria,
        interviewProcess: formData.interviewProcess,
        skills: formData.skills,
        employment_type: formData.employment_type,
        experience: formData.experience.trim(),
      };

      if (editMode) {
        const result = await updateJob(editingJobId, jobData);
        if (result.success) {
          alert("Job updated successfully!");
          resetForm();
          await loadJobs();
        }
      } else {
        const result = await createJob(jobData);
        if (result.success) {
          alert("Job posted successfully!");
          resetForm();
          await loadJobs();
        }
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      alert(error.message || "Failed to submit job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (job) => {
    setEditMode(true);
    setEditingJobId(job.id);
    setFormData({
      title: job.title,
      category: job.category,
      description: job.description,
      keyResponsibilities: job.keyResponsibilities || [],
      eligibilityCriteria: job.eligibilityCriteria || [],
      interviewProcess: job.interviewProcess || [],
      skills: job.skills || [],
      employment_type: job.employment_type,
      experience: job.experience || "",
    });

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job posting? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const result = await deleteJob(jobId);
      if (result.success) {
        alert("Job deleted successfully!");
        await loadJobs();

        // If we're editing the deleted job, reset the form
        if (editingJobId === jobId) {
          resetForm();
        }

        // Reset carousel index if needed
        if (
          currentIndex > 0 &&
          currentIndex >= jobsData.length - cardsToShow - 1
        ) {
          setCurrentIndex(Math.max(0, currentIndex - 1));
        }
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert(error.message || "Failed to delete job. Please try again.");
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

  const showNavigation = jobsData.length > cardsToShow;
  const translateX = -(currentIndex * (cardWidth + gap));

  const employmentTypes = ["Full-Time", "Internship"];

  return (
    <>
      <div className={style.pageInner}>
        <div className={style.jobsInfoContent}>
          <div className={style.formHeader}>
            <h2 className={style.formTitle}>
              {editMode ? "Edit Job Posting" : "Post New Job"}
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
            <button
              onClick={loadJobs}
              style={{
                padding: '0.5rem 1rem',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
              title="Refresh jobs list"
            >
              <Icon icon="lucide:refresh-cw" /> Refresh
            </button>
          </div>

          <div className={style.formContainer}>
            <form onSubmit={handleSubmit}>
              <div className={style.inputGrid}>
                <div className={style.inputField}>
                  <label htmlFor="title">Job Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g., Business Development Executive"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={style.inputField}>
                  <label htmlFor="employment_type">Employment Type *</label>
                  <select
                    id="employment_type"
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleInputChange}
                    required
                  >
                    {employmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={style.inputField}>
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {jobCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={style.inputField}>
                  <label htmlFor="experience">Experience Required</label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    placeholder="e.g., 2-3 years"
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={style.inputField + " " + style.fullWidth}>
                <label htmlFor="description">Job Description *</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={style.inputField + " " + style.fullWidth}>
                <label>Required Skills *</label>
                <div className={style.skillsInput}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="Add a skill and press Enter"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={handleSkillKeyPress}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className={style.submitBtn}
                      style={{ padding: "0.75rem 1.5rem" }}
                    >
                      Add
                    </button>
                  </div>
                  <div>
                    {formData.skills.map((skill, index) => (
                      <span key={index} className={style.skillsTag}>
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          aria-label="Remove skill"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={style.formActions}>
                <button
                  type="reset"
                  className={style.resetBtn}
                  onClick={resetForm}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className={style.submitBtn}
                  disabled={submitting}
                >
                  {submitting
                    ? editMode
                      ? "Updating..."
                      : "Posting..."
                    : editMode
                    ? "Update Job"
                    : "Post Job"}
                </button>
              </div>
            </form>
          </div>

          {/* Jobs List Section */}
          {loading && (
            <div className={style.jobsContainer}>
              <div className={style.noData}>
                <Icon icon="lucide:loader" />
                <p>Loading jobs...</p>
              </div>
            </div>
          )}
          {!loading && (
            <div className={style.jobsContainer}>
              <div className={style.jobsHeader}>
                <h3>Posted Jobs</h3>
                <span className={style.jobCount}>{jobsData.length} jobs</span>
              </div>

              {jobsData.length > 0 ? (
                <div className={style.jobsCarousel}>
                  <div
                    className={style.carouselContainer}
                    ref={containerRef}
                    style={{
                      transform: `translateX(${translateX}px)`,
                    }}
                  >
                    {jobsData.map((job) => (
                      <div
                        key={job.id}
                        className={style.jobCardAdmin}
                      >
                        <div className={style.jobHeader}>
                          <div className={style.jobInfo}>
                            <h4 className={style.jobTitle}>{job.title}</h4>
                            <div>
                              <span className={style.jobCategory}>
                                {job.category}
                              </span>
                              <span className={style.employmentType}>
                                {job.employment_type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className={style.jobDescription}>
                          {truncateText(job.description, 120)}
                        </p>

                        <div className={style.skillsList}>
                          {job.skills?.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className={style.skillBadge}>
                              {skill}
                            </span>
                          ))}
                          {job.skills?.length > 3 && (
                            <span className={style.skillBadge}>
                              +{job.skills.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className={style.jobActions}>
                          <button
                            className={style.actionBtn}
                            onClick={() => handleEdit(job)}
                          >
                            <Icon icon="lucide:edit-2" />
                            Edit
                          </button>
                          <button
                            className={`${style.actionBtn} ${style.deleteBtn}`}
                            onClick={() => handleDelete(job.id)}
                          >
                            <Icon icon="lucide:trash-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {showNavigation && (
                    <div className={style.carouselNav + " " + style.show}>
                      <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                      >
                        <Icon icon="lucide:chevron-left" />
                      </button>
                      <button
                        onClick={nextSlide}
                        disabled={currentIndex >= maxIndex}
                      >
                        <Icon icon="lucide:chevron-right" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={style.noData}>
                  <Icon icon="lucide:briefcase" />
                  <p>No jobs posted yet. Create your first job posting!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobsInfoPage;
