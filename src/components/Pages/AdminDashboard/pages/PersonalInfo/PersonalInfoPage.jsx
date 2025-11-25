"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideNavigation from "../../SideNavigation/SideNavigation";
import style from "./style/personalinfo.module.scss";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  getAdmin,
  updateAdmin,
  uploadAdminImage,
} from "@/app/(backend)/api/admin/admin";
import useUserSession from "@/hooks/useUserSession";

const PersonalInfoPage = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { session, isSessionLoading } = useUserSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    companyId: "",
  });

  const [profileImage, setProfileImage] = useState(
    "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/Profile%20Images/images.jpg"
  );
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const fetchAdminData = async () => {
    if (isSessionLoading) return;

    if (!session?.user_id) {
      console.error("No session or user_id found");
      setLoading(false);
      return;
    }

    const adminId = session.user_id;

    try {
      setLoading(true);
      console.log("Fetching admin data for ID:", adminId);

      const result = await getAdmin(adminId);
      console.log("Fetch result:", result);

      if (result.success && result.data) {
        const adminData = result.data;

        setFormData({
          name: adminData.name || "",
          email: adminData.email || "",
          dob: adminData.dob || "",
          companyId: adminData.id || "",
        });

        if (adminData.image) {
          setProfileImage(adminData.image);
        }
      } else {
        console.error("Failed to fetch admin data:", result.error);
        alert(
          `Failed to load profile data: ${result.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      alert(`An error occurred while loading profile data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [session, isSessionLoading]);

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

    if (!session?.user_id) {
      alert("Session expired. Please log in again.");
      return;
    }

    const adminId = session.user_id;

    try {
      setSaving(true);
      console.log("Starting save process...");

      let imageUrl = profileImage;

      if (selectedImageFile) {
        console.log("Uploading new image...");
        const uploadResult = await uploadAdminImage(selectedImageFile, adminId);
        console.log("Upload result:", uploadResult);

        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else {
          console.error("Image upload failed:", uploadResult.error);
          alert("Failed to upload image. Continuing with profile update...");
        }
      }

      const updateData = {
        name: formData.name,
        email: formData.email,
        dob: formData.dob || null,
        image: imageUrl,
      };

      console.log("Updating admin with data:", updateData);
      const result = await updateAdmin(adminId, updateData);
      console.log("Update result:", result);

      if (result.success) {
        setProfileImage(imageUrl);
        setImagePreview("");
        setSelectedImageFile(null);
        alert("Profile updated successfully!");
        setIsEditing(false);
        await fetchAdminData();
      } else {
        alert(`Failed to update profile: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost."
      )
    ) {
      setIsEditing(false);
      setImagePreview("");
      setSelectedImageFile(null);
      fetchAdminData();
    }
  };

  if (isSessionLoading || loading) {
    return (
      <div className={style.main}>
        <SideNavigation />
        <div className={style.personalInfoContainer}>
          <div className={style.loadingContainer}>
            <Icon icon="lucide:loader-2" className={style.spinner} />
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user_id) {
    return (
      <div className={style.main}>
        <SideNavigation />
        <div className={style.personalInfoContainer}>
          <p>No session found. Please log in.</p>
        </div>
      </div>
    );
  }

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
              <p className={style.userName}>{formData.name || "Loading..."}</p>
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
                  disabled={true}
                  readOnly
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className={style.saveButtonContainer}>
              <button type="submit" className={style.savebtn} disabled={saving}>
                {saving ? (
                  <>
                    <Icon
                      icon="lucide:loader-2"
                      className={style.buttonSpinner}
                    />
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