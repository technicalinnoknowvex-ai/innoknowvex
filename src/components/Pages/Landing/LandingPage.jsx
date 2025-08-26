"use client";
import React from "react";
import landingStyles from "./styles/landing.module.scss";
import Hero from "./Sections/Hero/Hero";
import AboutUs from "./Sections/AboutUs/AboutUs";
import Programs from "./Sections/Programs/Programs";
import WhyChooseUs from "./Sections/WhyChooseUs/WhyChooseUs";
import OurPartners from "./Sections/OurPartners/OurPartners";
import Testimonials from "./Sections/Testimonials/Testimonials";
import FAQ from "./Sections/FAQ/FAQ";
import Footer from "./Sections/Footer/Footer";

const LandingPage = () => {
  return (
    <div className={landingStyles.landing}>
      <Hero />
      <AboutUs />
      <Programs />
      <WhyChooseUs />
      <OurPartners />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;