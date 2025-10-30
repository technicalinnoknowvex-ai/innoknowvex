import React from "react";
import style from "./style/coupons.module.scss";
import SideNavigation from "../../SideNavigation/SideNavigation";

const CouponsPage = () => {
  return (
    <>
      <div className={style.main}>
        <SideNavigation />
        <div className={style.coursesInfoContent}>Coupons Info</div>
      </div>
    </>
  );
};

export default CouponsPage;
