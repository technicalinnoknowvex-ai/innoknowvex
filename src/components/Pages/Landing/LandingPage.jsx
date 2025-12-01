"use client";
import React from "react";
import dynamic from "next/dynamic";
import landingStyles from "./styles/landing.module.scss";
import SmoothScroller from "@/components/Layouts/SmoothScroller";

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
    <SmoothScroller>
      <div className={landingStyles.landing}>
        <Hero />
        <AboutUs />
        <Programs />
        <WhyChooseUs />
        <OurPartners />
        <Testimonials />
        <Blogs />
        <FAQ />
        <Footer />
      </div>
    </SmoothScroller>
  );
};

export default LandingPage;
