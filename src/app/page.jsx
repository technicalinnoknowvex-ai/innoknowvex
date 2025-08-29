import LandingPage from "@/components/Pages/Landing/LandingPage";
import PopupForm from "@/components/Pages/PopupForm/PopupForm";

const page = () => {
  return (<div>
    <LandingPage/>
    <PopupForm delaySeconds={5}/>
  </div>
  )
};

export default page;
