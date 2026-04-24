"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import style from "./style/jobsinfo.module.scss";
import { Icon } from "@iconify/react/dist/iconify.js";
import { deleteJob, getJobs } from "@/app/(backend)/api/jobs/jobs";

const EDIT_STORAGE_KEY = "admin_jobs_edit_v1";

const PostedJobsPage = () => {
  const router = useRouter();
  const params = useParams();
  const adminId = params?.adminId;

  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const gap = 30;
  const containerRef = useRef(null);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const calculateDimensions = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      setContainerWidth(container.offsetWidth);
      const card = container.querySelector(`.${style.jobCardAdmin}`);
      if (card) setCardWidth(card.offsetWidth);
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, [jobsData.length]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobsData(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load jobs:", error);
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

  const truncateText = (text, maxLength = 100) =>
    text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text || "";

  const showNavigation = jobsData.length > cardsToShow;
  const translateX = -(currentIndex * (cardWidth + gap));

  const handleEdit = (job) => {
    try {
      sessionStorage.setItem(EDIT_STORAGE_KEY, JSON.stringify(job));
    } catch {
      // ignore storage failures; still navigate
    }
    const href = adminId
      ? `/admin/${adminId}/dashboard/jobs`
      : "/admin/dashboard/jobs";
    router.push(href);
  };

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job posting? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const result = await deleteJob(jobId);
      if (result?.success) {
        alert("Job deleted successfully!");
        await loadJobs();
        setCurrentIndex((idx) => Math.max(0, Math.min(idx, maxIndex)));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting job:", error);
      alert(error.message || "Failed to delete job. Please try again.");
    }
  };

  return (
    <div className={style.pageInner}>
      <div className={style.jobsInfoContent}>
        <div className={style.formHeader}>
          <h2 className={style.formTitle}>Posted Jobs</h2>
          <button
            onClick={loadJobs}
            style={{
              padding: "0.5rem 1rem",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
            title="Refresh jobs list"
            type="button"
          >
            <Icon icon="lucide:refresh-cw" /> Refresh
          </button>
        </div>

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
              <h3>All Posted Jobs</h3>
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
                    <div key={job.id} className={style.jobCardAdmin}>
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
                          type="button"
                        >
                          <Icon icon="lucide:edit-2" />
                          Edit
                        </button>
                        <button
                          className={`${style.actionBtn} ${style.deleteBtn}`}
                          onClick={() => handleDelete(job.id)}
                          type="button"
                        >
                          <Icon icon="lucide:trash-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {showNavigation && (
                  <div
                    className={`${style.carouselNav} ${style.carouselNavShow}`}
                  >
                    <button onClick={prevSlide} disabled={currentIndex === 0}>
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
                <p>No jobs posted yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { EDIT_STORAGE_KEY };
export default PostedJobsPage;

