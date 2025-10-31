import React from "react";
import SideNavigation from "../../SideNavigation/SideNavigation";
import style from "./style/personalinfo.module.scss";
import Image from "next/image";

const PersonalInfoPage = () => {
  return (
    <div className={style.main}>
      <SideNavigation />
      <div className={style.personalInfoContainer}>
        <div className={style.profileHeader}>
          <div className={style.profileImageWrapper}>
            <Image
              className={style.profileImage}
              src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/anime-3083036_1280.jpg"
              height={166}
              width={175}
              alt="profile pic"
            />
          </div>

          <div className={style.userDetails}>
            <p className={style.userName}>Anshuman</p>
            <div className={style.line}></div>
            <p className={style.userRole}>Admin</p>
            <button className={style.editProfileButton}>Edit</button>
          </div>
        </div>

        <div className={style.userInfoFields}>
          <div className={style.upperFields}>
            <div className={style.fieldGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" />
            </div>

            <div className={style.fieldGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" />
            </div>
          </div>

          <div className={style.lowerFields}>
            <div className={style.fieldGroup}>
              <label htmlFor="dob">Date of Birth</label>
              <input type="date" id="dob" />
            </div>

            <div className={style.fieldGroup}>
              <label htmlFor="companyId">Company ID</label>
              <input type="text" id="companyId" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
