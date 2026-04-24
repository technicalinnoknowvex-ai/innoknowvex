"use client";
import React, { useState, useEffect } from "react";
import style from "./Sections/style/careers.module.scss";
import SmoothScroller from "@/components/Layouts/SmoothScroller";
import { getJobs } from "@/app/(backend)/api/jobs/jobs";
import { Icon } from "@iconify/react/dist/iconify.js";
import JobDetailsModal from "./JobDetailsModal";

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    location: "",
    resumeFile: null,
    coverNote: "",
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data || []);
      setFilteredJobs(data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const employmentTypes = ["All", "Full-Time", "Internship", "Part-Time"];

  const handleFilter = (type) => {
    setSelectedFilter(type);
    if (type === "All") {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter((job) => job.employment_type === type));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('❌ Invalid file format! Please upload a PDF file only');
        e.target.value = '';
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ File size too large! Maximum file size is 5MB');
        e.target.value = '';
        return;
      }
      setFormData((prev) => ({
        ...prev,
        resumeFile: file,
      }));
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate resume file
      if (!formData.resumeFile) {
        alert('❌ Resume Required! Please upload your PDF resume before submitting');
        return;
      }

      // Double-check file type before sending
      if (formData.resumeFile.type !== 'application/pdf') {
        alert('❌ Invalid file format! Resume must be in PDF format');
        setFormData((prev) => ({
          ...prev,
          resumeFile: null,
        }));
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('resume', formData.resumeFile);
      formDataToSend.append('coverNote', formData.coverNote);
      formDataToSend.append('jobId', selectedJobId);
      
      // Submit to API endpoint
      const response = await fetch('/api/jobs', {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      
      if (result.success) {
        const message = "✅ Application Submitted!\n\nYour application and resume have been successfully received. We'll review it and contact you at " + formData.email;
        
        alert(message);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          role: "",
          location: "",
          resumeFile: null,
          coverNote: "",
        });
        setShowApplicationForm(false);
      } else {
        alert("❌ Submission Failed\n\n" + (result.error || "Failed to submit application. Please try again or contact careers@innoknowvex.in"));
      }
    } catch (error) {
      alert("❌ Upload Failed\n\nUnable to submit your application. Please check:\n- Internet connection\n- PDF file size (max 5MB)\n- File format (PDF only)\n\nError: " + (error.message || "Unknown error"));
    }
  };

  const handleApplyClick = (jobId) => {
    setSelectedJobId(jobId);
    setFormData((prev) => ({
      ...prev,
      role: jobs.find((j) => j.id === jobId)?.title || "",
    }));
    setShowApplicationForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReadMoreClick = (job) => {
    setSelectedJobForDetails(job);
  };

  const handleCloseJobDetails = () => {
    setSelectedJobForDetails(null);
  };

  const stats = [
    { number: "5,000+", label: "Students Impacted" },
    { number: "100%", label: "Growth Mode" },
  ];

  const perks = [
    { title: "Fast Growth", description: "High-ownership environment where your impact is visible from day one." },
    { title: "Free Learning", description: "Access all Innoknowvex programs and upskill alongside our students." },
    { title: "Great Team", description: "Work with a passionate, young team that loves building things together." },
    { title: "Bengaluru HQ", description: "Based in India's EdTech capital, with hybrid work flexibility." },
    { title: "Meaningful Work", description: "Every role directly contributes to shaping students' careers." },
    { title: "Performance Pay", description: "Transparent incentives tied to your individual and team results." },
  ];

  return (
    <SmoothScroller>
      <div className={style.careersPage}>
        {/* Hero Section */}
        <section className={style.heroSection}>
          <div className={style.heroContent}>
            <h1 className={style.heroHeading}>
              Build the Future of EdTech<br />
              <span className={style.highlight}>with Us</span>
            </h1>
            <p className={style.heroSubtitle}>
              Join Innoknowvex and help thousands of students transform their careers. We're looking for passionate individuals who believe in the power of education.
            </p>

            <div className={style.statsContainer}>
              {stats.map((stat, idx) => (
                <div key={idx} className={style.statCard}>
                  <div className={style.statNumber}>{stat.number}</div>
                  <div className={style.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section className={style.jobsSection}>
          <div className={style.sectionHeader}>
            <h2 className={style.sectionTitle}>Open Positions</h2>
            <p className={style.sectionDescription}>
              Explore exciting career opportunities across growth, people, and marketing.
            </p>
          </div>

          <JobDetailsModal
            job={selectedJobForDetails}
            onClose={handleCloseJobDetails}
            onApplyClick={handleApplyClick}
          />

          {/* Filter Buttons */}
          <div className={style.filterButtons}>
            {employmentTypes.map((type) => (
              <button
                key={type}
                className={`${style.filterBtn} ${
                  selectedFilter === type ? style.active : ""
                }`}
                onClick={() => handleFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {loading ? (
            <div className={style.loadingSpinner}>
              <p>Loading job opportunities...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className={style.jobsGrid}>
              {filteredJobs.map((job) => (
                <div key={job.id} className={style.jobCard}>
                  <div className={style.jobHeader}>
                    <h3 className={style.jobTitle}>{job.title}</h3>
                    <div className={style.jobMeta}>
                      <span className={style.jobCategory}>{job.category}</span>
                      <span className={style.employmentType}>
                        {job.employment_type}
                      </span>
                    </div>
                  </div>

                  <div className={style.jobDescriptionWrapper}>
                    <p className={style.jobDescription}>{job.description}</p>
                    {typeof job.description === "string" && job.description.trim().length > 180 && (
                      <button
                        type="button"
                        className={style.readMoreBtn}
                        onClick={() => handleReadMoreClick(job)}
                      >
                        Read more
                      </button>
                    )}
                  </div>

                  <div className={style.skillsList}>
                    {job.skills?.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className={style.skillBadge}>
                        {skill}
                      </span>
                    ))}
                    {job.skills?.length > 4 && (
                      <span className={style.skillBadge}>
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>

                  <button
                    className={style.applyButton}
                    onClick={() => handleApplyClick(job.id)}
                  >
                    <Icon icon="lucide:arrow-right" />
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={style.noJobsMessage}>
              <Icon icon="lucide:briefcase" />
              <h3>No Open Positions</h3>
              <p>Check back soon for exciting opportunities!</p>
            </div>
          )}
        </section>

        {/* Perks Section */}
        <section className={style.perksSection}>
          <div className={style.sectionHeader}>
            <h2 className={style.sectionTitle}>Why Innoknowvex?</h2>
            <p className={style.sectionDescription}>
              We build people, not just products
            </p>
          </div>

          <div className={style.perksGrid}>
            {perks.map((perk, idx) => (
              <div key={idx} className={style.perkCard}>
                <div className={style.perkIcon}>
                  {idx === 0 && <Icon icon="lucide:rocket" />}
                  {idx === 1 && <Icon icon="lucide:book" />}
                  {idx === 2 && <Icon icon="lucide:users" />}
                  {idx === 3 && <Icon icon="lucide:map-pin" />}
                  {idx === 4 && <Icon icon="lucide:star" />}
                  {idx === 5 && <Icon icon="lucide:trending-up" />}
                </div>
                <h3 className={style.perkTitle}>{perk.title}</h3>
                <p className={style.perkDescription}>{perk.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Application Form Section */}
        {showApplicationForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            zIndex: 1000,
            overflowY: 'auto',
          }}>
            <section className={style.formSection} style={{
              animation: 'slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              maxWidth: '700px',
              width: '100%',
              margin: '0 auto',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
              minHeight: 'auto',
            }}>
              <div className={style.sectionHeader}>
                <h2 className={style.sectionTitle}>Apply Now</h2>
                <p className={style.sectionDescription}>
                  Fill out the form below and tell us why you're a great fit for Innoknowvex
                </p>
              </div>

              <div className={style.formContainer}>
              <form onSubmit={handleApplicationSubmit}>
                <div className={style.formGrid}>
                  <div className={style.formField}>
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={style.formField}>
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={style.formField}>
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={style.formField}>
                    <label htmlFor="role">Role Applying For *</label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      placeholder="Role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      disabled
                    />
                  </div>

                  <div className={style.formField}>
                    <label htmlFor="location">Current Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={style.formField}>
                    <label htmlFor="resumeFile">Resume / CV (PDF) *</label>
                    <input
                      type="file"
                      id="resumeFile"
                      name="resumeFile"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required
                      style={{ cursor: 'pointer' }}
                    />
                    {formData.resumeFile && (
                      <small style={{ color: '#4CAF50', marginTop: '0.5rem', display: 'block', fontWeight: '600' }}>
                        ✓ {formData.resumeFile.name} ({(formData.resumeFile.size / 1024).toFixed(2)} KB)
                      </small>
                    )}
                    {!formData.resumeFile && (
                      <small style={{ color: '#ff6432', marginTop: '0.3rem', display: 'block', fontSize: '0.85rem' }}>
                        Max file size: 5MB (PDF only)
                      </small>
                    )}
                  </div>

                  <div className={`${style.formField} ${style.full}`}>
                    <label htmlFor="coverNote">Cover Note</label>
                    <textarea
                      id="coverNote"
                      name="coverNote"
                      placeholder="Tell us why you're the right fit and what excites you about Innoknowvex..."
                      value={formData.coverNote}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className={style.formButtonGroup}>
                  <button
                    type="button"
                    className={style.closeBtn}
                    onClick={() => setShowApplicationForm(false)}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className={style.submitBtn}
                  >
                    Submit Application
                  </button>
                </div>
              </form>

              <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(166, 150, 0, 0.15)", textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
                <p>Don't see the right role? Send your resume directly to</p>
                <p style={{ fontWeight: "600", color: "#ff6432" }}>careers@innoknowvex.in</p>
              </div>
              </div>
            </section>
            </div>
        )}

        {!showApplicationForm && filteredJobs.length > 0 && (
          <section style={{ textAlign: "center", padding: "3rem 2rem", background: "linear-gradient(135deg, rgba(255, 100, 50, 0.05) 0%, rgba(166, 150, 0, 0.05) 100%)" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#262c35" }}>
              Don't see the right role?
            </h2>
            <p style={{ fontSize: "1rem", color: "#666", marginBottom: "1.5rem" }}>
              Send your resume directly to <strong>careers@innoknowvex.in</strong>
            </p>
            <p style={{ fontSize: "0.9rem", color: "#999" }}>
              📍 Bengaluru, Karnataka, India
            </p>
          </section>
        )}
      </div>
    </SmoothScroller>
  );
};

export default CareersPage;
