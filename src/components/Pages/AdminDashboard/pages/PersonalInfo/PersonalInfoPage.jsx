import React from "react";
import SideNavigation from "../../SideNavigation/SideNavigation";
import style from "./style/personalinfo.module.scss";
import Image from "next/image";

const PersonalInfoPage = () => {
  return (
    <div className={style.main}>
      <SideNavigation />
      <div className={style.personalInfoContent}>
        <div className={style.imgdiv}>
          <Image
            className={style.profilepic}
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/anime-3083036_1280.jpg"
            height={100}
            width={100}
            alt="user profile"
          />
          <button className={style.editbtn}>Update</button>
          <p></p>
        </div>
        <p className={style.username}>
          JASKAMAL <br /> <span>(admin)</span>
        </p>

        <div className={style.infodiv}>
          <div className={style.upper}>
            <div className={style.fieldbox}>
              <label htmlFor="">Name</label>
              <input type="text" name="" id="" />
            </div>

            <div className={style.fieldbox}>
              <label htmlFor="">DOB</label>
              <input type="text" name="" id="" />
            </div>
          </div>

          <div className={style.lower}>
            <div className={style.fieldbox}>
              <label htmlFor="">Email</label>
              <input type="text" name="" id="" />
            </div>

            <div className={style.fieldbox}>
              <label htmlFor="">Company ID</label>
              <input type="text" name="" id="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
