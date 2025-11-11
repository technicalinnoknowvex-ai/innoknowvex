"use client";
import React, { useState } from "react";
import SideNavigation from "../../SideNavigation/SideNavigation";
import style from "./style/personalinfo.module.scss";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";

const PersonalInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "Anshuman",
    email: "anshuman@example.com",
    dob: "1995-06-15",
    companyId: "EMP001"
  });

  const [profileImage, setProfileImage] = useState(
    "https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/anime-3083036_1280.jpg"
  );
  const [imagePreview, setImagePreview] = useState("");

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

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setImagePreview("");
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (imagePreview) {
        setProfileImage(imagePreview);
        setImagePreview("");
      }
      
      alert("Profile updated successfully!");
      setIsEditing(false);
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
      // Reset form data if needed
    }
  };

  return (
    <div className={style.main}>
      <SideNavigation />
      <div className={style.personalInfoContainer}>
        <div className={style.formHeader}>
          <h2 className={style.formTitle}>Personal Information</h2>
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
              <p className={style.userRole}>Admin</p>
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
                <label htmlFor="companyId">Company ID</label>
                <input
                  type="text"
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
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

export default PersonalInfoPage;