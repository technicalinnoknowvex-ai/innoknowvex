import React from "react";
import style from "./style/coursesinfo.module.scss";
import SideNavigation from "../../SideNavigation/SideNavigation";

const CoursesInfoPage = () => {
  return (
    <>
      <div className={style.main}>
        <SideNavigation />
        <div className={style.coursesInfoContent}>Courses Info Page</div>
      </div>
    </>
  );
};

export default CoursesInfoPage;
