<<<<<<< HEAD
import LandingPage from "@/components/Pages//Landing/LandingPage";
import React from "react";


const page = () => {
  return (<div>
    <div><LandingPage /></div>
    </div>
    )
=======
import LandingPage from "@/components/Pages/Landing/LandingPage";
import PopupForm from "@/components/Pages/PopupForm/PopupForm";

const page = () => {
  return (<div>
    <LandingPage/>
    <PopupForm delaySeconds={4}/>
  </div>
  )
>>>>>>> anshuman
};

export default page;
