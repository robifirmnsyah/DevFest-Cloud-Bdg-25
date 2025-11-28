import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Speakers from "@/components/Speakers";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";
import Presale from "@/components/Presale";
import Moments from "@/components/Moments";
import JobFair from "@/components/JobFair";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Presale />
      <Speakers />
      <JobFair />
      <Partners />
      <Moments />
      <Footer />
    </div>
  );
};

export default Index;
