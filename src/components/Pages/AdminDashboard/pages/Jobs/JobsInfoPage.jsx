"use client";
import React, { useEffect, useState } from "react";
import style from "./style/jobsinfo.module.scss";
import {
  createJob,
  updateJob,
} from "@/app/(backend)/api/jobs/jobs";
import { jobCategories } from "@/data/jobPostings";
import { Icon } from "@iconify/react/dist/iconify.js";
import { EDIT_STORAGE_KEY } from "./PostedJobsPage";

const JobsInfoPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

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
    try {
      const raw = sessionStorage.getItem(EDIT_STORAGE_KEY);
      if (!raw) return;
      const job = JSON.parse(raw);
      sessionStorage.removeItem(EDIT_STORAGE_KEY);

      if (job?.id) {
        setEditMode(true);
        setEditingJobId(job.id);
        setFormData({
          title: job.title || "",
          category: job.category || "",
          description: job.description || "",
          keyResponsibilities: job.keyResponsibilities || [],
          eligibilityCriteria: job.eligibilityCriteria || [],
          interviewProcess: job.interviewProcess || [],
          skills: job.skills || [],
          employment_type: job.employment_type || "Full-Time",
          experience: job.experience || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      // ignore
    }
  }, []);

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
        }
      } else {
        const result = await createJob(jobData);
        if (result.success) {
          alert("Job posted successfully!");
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      alert(error.message || "Failed to submit job. Please try again.");
    } finally {
      setSubmitting(false);
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

  const employmentTypes = ["Full-Time", "Internship"];

  return (
    <>
      <div className={style.pageInner}>
        <div className={style.jobsInfoContent}>
          <div className={style.formHeader}>
            <h2 className={style.formTitle}>
              {editMode ? "Edit Job Posting" : "Now Post a Job"}
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
        </div>
      </div>
    </>
  );
};

export default JobsInfoPage;
