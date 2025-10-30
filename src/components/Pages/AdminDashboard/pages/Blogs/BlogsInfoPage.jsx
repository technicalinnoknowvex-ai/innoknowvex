import React from "react";
import style from "./style/blogsinfo.module.scss";
import SideNavigation from "../../SideNavigation/SideNavigation";

const BlogsInfoPage = () => {
  return (
    <>
      <div className={style.main}>
        <SideNavigation />
        <div className={style.blogsInfoContent}>Blogs Info</div>
      </div>
    </>
  );
};

export default BlogsInfoPage;
