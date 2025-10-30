import React from "react";
import SideNavigation from "../../SideNavigation/SideNavigation";
import style from "./style/personalinfo.module.scss";

const PersonalInfoPage = () => {
  return (
    <div className={style.main}>
      <SideNavigation />
      <div className={style.personalInfoContent}>PersonalInfoPage</div>
    </div>
  );
};

export default PersonalInfoPage;
