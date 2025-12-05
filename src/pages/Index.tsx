import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Speakers from "@/components/Speakers";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";
// import Presale from "@/components/Presale";
// import Moments from "@/components/Moments";
import JobFair from "@/components/JobFair";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "organizer") {
        navigate("/organizer");
      } else if (role === "booth_staff") {
        navigate("/booth-staff");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      {/* <Presale /> */}
      <Speakers />
      <JobFair />
      <Partners />
      {/* <Moments /> */}
      <Footer />
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;
