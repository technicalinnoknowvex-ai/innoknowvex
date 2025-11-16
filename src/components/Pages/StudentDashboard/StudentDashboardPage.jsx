"use client";
import React, { useState, useEffect } from "react";
import style from "./styles/studentDashboard.module.scss";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getStudent, updateStudent, uploadStudentImage } from "@/app/api/student/student";

const StudentInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState("STU001");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    uniqueId: "",
    skills: [],
    projects: [],
    coursesEnrolled: []
  });

  const [profileImage, setProfileImage] = useState(
    "https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/anime-3083036_1280.jpg"
  );
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "" });
  const [newCourse, setNewCourse] = useState("");

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const result = await getStudent(studentId);
      
      if (result.success && result.data) {
        setFormData({
          name: result.data.name || "",
          email: result.data.email || "",
          dob: result.data.dob || "",
          uniqueId: result.data.id || "",
          skills: result.data.skills || [],
          projects: result.data.projects || [],
          coursesEnrolled: result.data.courses_enrolled || []
        });
        
        if (result.data.image) {
          setProfileImage(result.data.image);
        }
      } else {
        console.error("Failed to fetch student data:", result.error);
        alert("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("An error occurred while loading profile data");
    } finally {
      setLoading(false);
    }
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

      setSelectedImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, { ...newProject }]
      }));
      setNewProject({ title: "", description: "", link: "" });
    } else {
      alert("Please fill in project title and description");
    }
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addCourse = () => {
    if (newCourse.trim() && !formData.coursesEnrolled.includes(newCourse.trim())) {
      setFormData(prev => ({
        ...prev,
        coursesEnrolled: [...prev.coursesEnrolled, newCourse.trim()]
      }));
      setNewCourse("");
    }
  };

  const removeCourse = (courseToRemove) => {
    setFormData(prev => ({
      ...prev,
      coursesEnrolled: prev.coursesEnrolled.filter(course => course !== courseToRemove)
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setImagePreview("");
      setSelectedImageFile(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);
      
      let imageUrl = profileImage;
      
      if (selectedImageFile) {
        const uploadResult = await uploadStudentImage(selectedImageFile, studentId);
        
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        } else {
          alert("Failed to upload image. Continuing with profile update...");
        }
      }
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        dob: formData.dob || null,
        image: imageUrl,
        skills: formData.skills,
        projects: formData.projects,
        courses_enrolled: formData.coursesEnrolled
      };
      
      const result = await updateStudent(studentId, updateData);
      
      if (result.success) {
        setProfileImage(imageUrl);
        setImagePreview("");
        setSelectedImageFile(null);
        alert("Profile updated successfully!");
        setIsEditing(false);
        await fetchStudentData();
      } else {
        alert(`Failed to update profile: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      setIsEditing(false);
      setImagePreview("");
      setSelectedImageFile(null);
      setNewSkill("");
      setNewProject({ title: "", description: "", link: "" });
      setNewCourse("");
      fetchStudentData();
    }
  };

  if (loading) {
    return (
      <div className={style.main}>
        <div className={style.personalInfoContainer}>
          <div className={style.loadingContainer}>
            <Icon icon="lucide:loader-2" className={style.spinner} />
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.main}>
      <div className={style.personalInfoContainer}>
        <div className={style.formHeader}>
          <h2 className={style.formTitle}>Student Information</h2>
          {isEditing && (
            <button
              className={style.cancelEditBtn}
              onClick={handleCancel}
              type="button"
            >
              <Icon icon="lucide:x" />
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSave}>
          <div className={style.profileHeader}>
            <div className={style.profileImageWrapper}>
              <Image
                className={style.profileImage}
                src={imagePreview || profileImage}
                height={166}
                width={175}
                alt="profile pic"
              />
              {isEditing && (
                <label className={style.imageUploadOverlay}>
                  <Icon icon="lucide:camera" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>

            <div className={style.userDetails}>
              <p className={style.userName}>{formData.name}</p>
              <div className={style.line}></div>
              <p className={style.userRole}>Student</p>
              {!isEditing && (
                <button
                  type="button"
                  className={style.editProfileButton}
                  onClick={handleEditToggle}
                >
                  <Icon icon="lucide:edit" />
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className={style.userInfoFields}>
            <div className={style.upperFields}>
              <div className={style.fieldGroup}>
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className={style.fieldGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div className={style.lowerFields}>
              <div className={style.fieldGroup}>
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className={style.fieldGroup}>
                <label htmlFor="uniqueId">Student ID</label>
                <input
                  type="text"
                  id="uniqueId"
                  name="uniqueId"
                  value={formData.uniqueId}
                  disabled={true}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className={style.sectionContainer}>
            <h3 className={style.sectionTitle}>Skills</h3>
            <div className={style.tagsContainer}>
              {formData.skills.map((skill, index) => (
                <div key={index} className={style.tag}>
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className={style.removeTagBtn}
                    >
                      <Icon icon="lucide:x" />
                    </button>
                  )}
                </div>
              ))}
              {formData.skills.length === 0 && (
                <p className={style.emptyMessage}>No skills added yet</p>
              )}
            </div>
            {isEditing && (
              <div className={style.addItemContainer}>
                <input
                  type="text"
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className={style.addInput}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className={style.addBtn}
                >
                  <Icon icon="lucide:plus" />
                  Add Skill
                </button>
              </div>
            )}
          </div>

          <div className={style.sectionContainer}>
            <h3 className={style.sectionTitle}>Projects</h3>
            <div className={style.projectsContainer}>
              {formData.projects.map((project, index) => (
                <div key={index} className={style.projectCard}>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className={style.removeProjectBtn}
                    >
                      <Icon icon="lucide:x" />
                    </button>
                  )}
                  <h4 className={style.projectTitle}>{project.title}</h4>
                  <p className={style.projectDescription}>{project.description}</p>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={style.projectLink}
                    >
                      <Icon icon="lucide:external-link" />
                      View Project
                    </a>
                  )}
                </div>
              ))}
              {formData.projects.length === 0 && (
                <p className={style.emptyMessage}>No projects added yet</p>
              )}
            </div>
            {isEditing && (
              <div className={style.addProjectContainer}>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  className={style.addInput}
                />
                <textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  className={style.addTextarea}
                  rows={3}
                />
                <input
                  type="url"
                  placeholder="Project Link (optional)"
                  value={newProject.link}
                  onChange={(e) => setNewProject(prev => ({ ...prev, link: e.target.value }))}
                  className={style.addInput}
                />
                <button
                  type="button"
                  onClick={addProject}
                  className={style.addBtn}
                >
                  <Icon icon="lucide:plus" />
                  Add Project
                </button>
              </div>
            )}
          </div>

          <div className={style.sectionContainer}>
            <h3 className={style.sectionTitle}>Courses Enrolled</h3>
            <div className={style.tagsContainer}>
              {formData.coursesEnrolled.map((course, index) => (
                <div key={index} className={style.tag}>
                  <span>{course}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeCourse(course)}
                      className={style.removeTagBtn}
                    >
                      <Icon icon="lucide:x" />
                    </button>
                  )}
                </div>
              ))}
              {formData.coursesEnrolled.length === 0 && (
                <p className={style.emptyMessage}>No courses enrolled yet</p>
              )}
            </div>
            {isEditing && (
              <div className={style.addItemContainer}>
                <input
                  type="text"
                  placeholder="Add a course"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCourse())}
                  className={style.addInput}
                />
                <button
                  type="button"
                  onClick={addCourse}
                  className={style.addBtn}
                >
                  <Icon icon="lucide:plus" />
                  Add Course
                </button>
              </div>
            )}
          </div>

          {isEditing && (
            <div className={style.saveButtonContainer}>
              <button type="submit" className={style.savebtn} disabled={saving}>
                {saving ? (
                  <>
                    <Icon icon="lucide:loader-2" className={style.buttonSpinner} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:save" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentInfoPage;