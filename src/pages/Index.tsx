import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Presale from "@/components/Presale";
import Schedule from "@/components/Schedule";
import Speakers from "@/components/Speakers";
import Partners from "@/components/Partners";
import Registration from "@/components/Registration";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Presale />
      <Schedule />
      <Speakers />
      <Partners />
      <Registration />
      <Footer />
    </div>
  );
};

export default Index;
