import LandingPage from "@/components/Pages/Landing/LandingPage";
import AboutUs from "@/components/Pages/About Us/AboutUs";
import Navbar from "@/components/Pages/Navbar/Navbar";
import React from "react";
import Chooseus from "@/components/Pages/ChooseUs/ChooseUs";
import Cards from "@/components/Pages/ChooseUs/Cards";
import FAQ from "@/components/Pages/FAQ/FAQ";


const page = () => {
  return (<div>
    <div><Navbar/></div>
    <div><LandingPage /></div>
    <div><AboutUs/></div>
    <div><Chooseus/></div>
    <div><Cards/></div>
    <div><FAQ/></div>
    </div>
    )
};

export default page;
