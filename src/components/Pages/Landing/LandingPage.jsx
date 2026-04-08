"use client";
import React from "react";
import dynamic from "next/dynamic";
import landingStyles from "./styles/landing.module.scss";
import SmoothScroller from "@/components/Layouts/SmoothScroller";
import Announcements from "./Sections/Announcements/Announcements";
import ScrollProgress from "./ScrollProgress/ScrollProgress";

const ModernHero = dynamic(() => import("./Sections/ModernHero/ModernHero"));
const AboutUs = dynamic(() => import("./Sections/AboutUs/AboutUs"));
const Programs = dynamic(() => import("./Sections/Programs/Programs"));
const OfflineHighlights = dynamic(() =>
  import("./Sections/OfflineHighlights/OfflineHighlights")
);
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
      <ScrollProgress />
      <div className={landingStyles.landing}>
        <ModernHero />
        <Announcements />
        <AboutUs />
        <hr className={landingStyles.sectionDivider} />
        <Programs />
        <OfflineHighlights />
        <hr className={landingStyles.sectionDivider} />
        <WhyChooseUs />
        <hr className={landingStyles.sectionDivider} />
        <OurPartners />
        <hr className={landingStyles.sectionDivider} />
        <Testimonials />
        <hr className={landingStyles.sectionDivider} />
        <Blogs />
        <hr className={landingStyles.sectionDivider} />
        <FAQ />
        <Footer />
      </div>
    </SmoothScroller>
  );
};

export default LandingPage;
