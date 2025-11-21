"use client";
import React, { useState, useEffect, useRef } from "react";
import style from "./style/blogsinfo.module.scss";
import SideNavigation from "../../SideNavigation/SideNavigation";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/app/(backend)/api/blogs/blogs";
import { Icon } from "@iconify/react/dist/iconify.js";

const BlogsInfoPage = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const gap = 30;
  const containerRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    const calculateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        setContainerWidth(container.offsetWidth);
        const card = container.querySelector(`.${style.blogCardAdmin}`);
        if (card) setCardWidth(card.offsetWidth);
      }
    };
    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, [blogsData.length]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogs();
      setBlogsData(data);
    } catch (error) {
      console.error("Failed to load blogs:", error);
      alert("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardsToShow =
    containerWidth > 0 && cardWidth > 0
      ? Math.floor(containerWidth / (cardWidth + gap))
      : 3;

  const maxIndex = Math.max(0, blogsData.length - cardsToShow);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      link: "",
      image: "",
    });
    setImageFile(null);
    setImagePreview("");
    setEditMode(false);
    setEditingBlogId(null);

    // Reset file input
    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Please enter a blog title");
      return false;
    }
    if (!formData.description.trim()) {
      alert("Please enter a description");
      return false;
    }
    if (!formData.link.trim()) {
      alert("Please enter a link");
      return false;
    }
    if (!editMode && !formData.image) {
      alert("Please upload an image");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const blogData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        link: formData.link.trim(),
      };

      // Only include image if it's been changed or it's a new blog
      if (formData.image) {
        blogData.image = formData.image;
      }

      if (editMode) {
        const result = await updateBlog(editingBlogId, blogData);
        if (result.success) {
          alert("Blog updated successfully!");
          resetForm();
          await loadBlogs();
        }
      } else {
        const result = await createBlog(blogData);
        if (result.success) {
          alert("Blog created successfully!");
          resetForm();
          await loadBlogs();
        }
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert(error.message || "Failed to submit blog. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setEditMode(true);
    setEditingBlogId(blog.id);
    setFormData({
      title: blog.title,
      description: blog.description,
      link: blog.link,
      image: blog.image,
    });
    setImagePreview(blog.image);

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (blogId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const result = await deleteBlog(blogId);
      if (result.success) {
        alert("Blog deleted successfully!");
        await loadBlogs();

        // If we're editing the deleted blog, reset the form
        if (editingBlogId === blogId) {
          resetForm();
        }

        // Reset carousel index if needed
        if (
          currentIndex > 0 &&
          currentIndex >= blogsData.length - cardsToShow - 1
        ) {
          setCurrentIndex(Math.max(0, currentIndex - 1));
        }
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert(error.message || "Failed to delete blog. Please try again.");
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

  const showNavigation = blogsData.length > cardsToShow;
  const translateX = -(currentIndex * (cardWidth + gap));

  return (
    <>
      <div className={style.main}>
        <SideNavigation />
        <div className={style.blogsInfoContent}>
          <div className={style.formHeader}>
            <h2 className={style.formTitle}>
              {editMode ? "Edit Blog" : "Create New Blog"}
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
                <label htmlFor="title">Blog Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter blog title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={style.inputField}>
                <label htmlFor="link">Blog Link *</label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  placeholder="https://example.com/blog"
                  value={formData.link}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={style.inputField}>
                <label htmlFor="image">
                  Upload Image *{" "}
                  {editMode && "(Leave empty to keep current image)"}
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editMode}
                />
                {imagePreview && (
                  <div className={style.imagePreviewContainer}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className={style.imagePreview}
                    />
                    <button
                      type="button"
                      className={style.removeImageBtn}
                      onClick={() => {
                        setImagePreview("");
                        setImageFile(null);
                        setFormData((prev) => ({ ...prev, image: "" }));
                        const fileInput = document.getElementById("image");
                        if (fileInput) fileInput.value = "";
                      }}
                    >
                      <Icon icon="lucide:x" />
                    </button>
                  </div>
                )}
              </div>

              <div className={`${style.inputField} ${style.fullWidth}`}>
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  placeholder="Enter blog description"
                  value={formData.description}
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
                        {editMode ? "Update Blog" : "Create Blog"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* All Blogs Section with Carousel */}
          <div className={style.allBlogsSection}>
            <h2 className={style.sectionTitle}>
              All Blogs {blogsData.length > 0 && `(${blogsData.length})`}
            </h2>

            {loading ? (
              <div className={style.loadingState}>
                <Icon icon="lucide:loader-2" className={style.spinner} />
                Loading blogs...
              </div>
            ) : blogsData.length === 0 ? (
              <div className={style.emptyState}>
                <Icon icon="lucide:inbox" className={style.emptyIcon} />
                <p>No blogs available</p>
                <p className={style.emptySubtext}>
                  Create your first blog to get started!
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
                      aria-label="Previous blogs"
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
                      aria-label="Next blogs"
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
                    {blogsData.map((blog) => (
                      <div
                        key={blog.id}
                        className={`${style.blogCardAdmin} ${
                          editingBlogId === blog.id ? style.editing : ""
                        }`}
                      >
                        <div className={style.imageWrapper}>
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className={style.blogImageAdmin}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/400x200?text=Image+Not+Found";
                            }}
                          />
                          <div className={style.cardActions}>
                            <button
                              className={style.actionBtn}
                              onClick={() => handleEdit(blog)}
                              title="Edit"
                              aria-label="Edit blog"
                            >
                              <Icon icon="lucide:edit" />
                            </button>
                            <button
                              className={`${style.actionBtn} ${style.deleteBtn}`}
                              onClick={() => handleDelete(blog.id)}
                              title="Delete"
                              aria-label="Delete blog"
                            >
                              <Icon icon="lucide:trash-2" />
                            </button>
                          </div>
                          {editingBlogId === blog.id && (
                            <div className={style.editingBadge}>
                              <Icon icon="lucide:edit-3" />
                              Editing
                            </div>
                          )}
                        </div>

                        <div className={style.cardContentAdmin}>
                          <div className={style.cardMeta}>
                            <span className={style.dateTag}>
                              {blog.date
                                ? new Date(blog.date).toLocaleDateString(
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

                          <h3 className={style.blogTitleAdmin}>{blog.title}</h3>

                          <p className={style.blogDescriptionAdmin}>
                            {truncateText(blog.description, 120)}
                          </p>

                          {blog.link && blog.link !== "#" && (
                            <a
                              href={blog.link}
                              className={style.linkPreview}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Icon icon="lucide:external-link" />
                              View Article
                            </a>
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

export default BlogsInfoPage;
