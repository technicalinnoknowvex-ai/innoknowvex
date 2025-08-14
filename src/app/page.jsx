import LandingPage from "@/components/Pages//Landing/LandingPage";
import AboutUs from "@/components/Pages/Landing/About Us/AboutUs";
import Navbar from "@/components/Pages/Navbar/Navbar";
import React from "react";
import Chooseus from "@/components/Pages/Landing/ChooseUs/ChooseUs";
import Cards from "@/components/Pages/Landing/ChooseUs/Cards";
import FAQ from "@/components/Pages/FAQ/FAQ";
import Footer from "@/components/Pages/Footer/Footer";


const page = () => {
  return (<div>
    <div><Navbar/></div>
    <div><LandingPage /></div>
    <div><AboutUs/></div>
    <div><Chooseus/></div>
    <div><Cards/></div>
    <div><FAQ/></div>
    <div><Footer/></div>
    </div>
    )
};

export default page;
