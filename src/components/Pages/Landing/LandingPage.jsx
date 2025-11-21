"use client";
import React from "react";
import dynamic from "next/dynamic";
import landingStyles from "./styles/landing.module.scss";

const Hero = dynamic(() => import("./Sections/Hero/Hero"));
const AboutUs = dynamic(() => import("./Sections/AboutUs/AboutUs"));
const Programs = dynamic(() => import("./Sections/Programs/Programs"));
const WhyChooseUs = dynamic(() => import("./Sections/WhyChooseUs/WhyChooseUs"));
const OurPartners = dynamic(() => import("./Sections/OurPartners/OurPartners"));
const Testimonials = dynamic(() =>
  import("./Sections/Testimonials/Testimonials")
);
const FAQ = dynamic(() => import("./Sections/FAQ/FAQ"));
const Footer = dynamic(() => import("./Sections/Footer/Footer"));
const Blogs = dynamic(() => import("./Sections/Blogs/BlogCard"));

const LandingPage = () => {
  return (
    <div className={landingStyles.landing}>
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "pink",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "lightblue",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "lightsalmon",
        }}
      />
    </div>
  );
};

export default LandingPage;

{
  /* <Hero />
      <AboutUs />
      <Programs />
      <WhyChooseUs />
      <OurPartners />
      <Testimonials />
      <Blogs />
      <FAQ />
      <Footer /> */
}
