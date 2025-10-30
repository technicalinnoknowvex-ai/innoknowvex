import React from "react";
import style from "./style/testimonials.module.scss";
import SideNavigation from "../../SideNavigation/SideNavigation";

const TestimonialsPage = () => {
  return (
    <>
      <div className={style.main}>
        <SideNavigation />
        <div className={style.testimonialInfoContent}>Testimonial Content</div>
      </div>
    </>
  );
};

export default TestimonialsPage;
