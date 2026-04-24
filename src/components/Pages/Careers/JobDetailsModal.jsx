"use client";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import style from "./Sections/style/careers.module.scss";

const JobDetailsModal = ({ job, onClose, onApplyClick }) => {
  if (!job) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        zIndex: 999,
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <section
        className={style.jobDetailsModal}
        style={{
          animation: "slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
          boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3)",
          minHeight: "auto",
          background: "white",
          borderRadius: "12px",
          padding: "2.5rem",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            background: "none",
            border: "none",
            fontSize: "1.8rem",
            cursor: "pointer",
            color: "#666",
            zIndex: 10,
          }}
          title="Close"
        >
          <Icon icon="lucide:x" />
        </button>

        {/* Job Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#262c35" }}>
            {job.title}
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <span
              style={{
                background: "rgba(255, 100, 50, 0.1)",
                color: "#ff6432",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              {job.category}
            </span>
            <span
              style={{
                background: "rgba(166, 150, 0, 0.1)",
                color: "#a69600",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              {job.employment_type}
            </span>
            {job.experience && (
              <span
                style={{
                  background: "rgba(0, 150, 136, 0.1)",
                  color: "#009688",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                {job.experience}
              </span>
            )}
          </div>
        </div>

        {/* Job Description Section */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.8rem", color: "#262c35", fontWeight: "600" }}>
            About the Role
          </h3>
          <p style={{ lineHeight: "1.6", color: "#555", whiteSpace: "pre-wrap" }}>
            {job.description}
          </p>
        </div>

        {/* Key Responsibilities */}
        {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.8rem", color: "#262c35", fontWeight: "600" }}>
              Key Responsibilities
            </h3>
            <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
              {job.keyResponsibilities.map((responsibility, idx) => (
                <li key={idx} style={{ color: "#555", marginBottom: "0.5rem" }}>
                  {responsibility}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Eligibility Criteria */}
        {job.eligibilityCriteria && job.eligibilityCriteria.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.8rem", color: "#262c35", fontWeight: "600" }}>
              Eligibility Criteria
            </h3>
            <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
              {job.eligibilityCriteria.map((criteria, idx) => (
                <li key={idx} style={{ color: "#555", marginBottom: "0.5rem" }}>
                  {criteria}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Interview Process */}
        {job.interviewProcess && job.interviewProcess.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.8rem", color: "#262c35", fontWeight: "600" }}>
              Interview Process
            </h3>
            <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
              {job.interviewProcess.map((process, idx) => (
                <li key={idx} style={{ color: "#555", marginBottom: "0.5rem" }}>
                  {process}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Required Skills */}
        {job.skills && job.skills.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.8rem", color: "#262c35", fontWeight: "600" }}>
              Required Skills
            </h3>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              {job.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "rgba(76, 175, 80, 0.1)",
                    color: "#4CAF50",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Apply Button */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid #eee",
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "1rem 1.5rem",
              background: "#f5f5f5",
              color: "#262c35",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#e0e0e0")}
            onMouseOut={(e) => (e.target.style.background = "#f5f5f5")}
          >
            Close
          </button>
          <button
            onClick={() => {
              onApplyClick(job.id);
              onClose();
            }}
            style={{
              flex: 1,
              padding: "1rem 1.5rem",
              background: "#ff6432",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
            onMouseOver={(e) => (e.target.style.background = "#e55a24")}
            onMouseOut={(e) => (e.target.style.background = "#ff6432")}
          >
            <Icon icon="lucide:arrow-right" />
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default JobDetailsModal;
