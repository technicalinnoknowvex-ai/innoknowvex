import LandingPage from "@/components/Pages/Landing/LandingPage";
import AboutUs from "@/components/Pages/Landing/About Us/AboutUs";
import Navbar from "@/components/Pages/Navbar/Navbar";
import React from "react";
import Chooseus from "@/components/Pages/Landing/ChooseUs/ChooseUs";
import Cards from "@/components/Pages/Landing/ChooseUs/Cards";
import FAQ from "@/components/Pages/FAQ/FAQ";
import Footer from "@/components/Pages/Footer/Footer";
import Partner from "@/components/Pages/Partner/Partner";




const page = () => {
  return (<div>
    <Navbar />
    <LandingPage />
    <AboutUs />
    <Chooseus />
    <Cards />
    <Partner/>
    <FAQ />
    <Footer />
  </div>
  )
};

export default page;
