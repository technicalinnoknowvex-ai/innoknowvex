import LandingPage from "@/components/Pages/Landing/LandingPage";
import AboutUs from "@/components/Pages/About Us/AboutUs";
import Navbar from "@/components/Pages/Navbar/Navbar";
import React from "react";


const page = () => {
  return (<div>
    <div><Navbar/></div>
    <div><LandingPage /></div>
    <div><AboutUs/></div>
    </div>
    )
};

export default page;
