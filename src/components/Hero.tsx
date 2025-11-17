import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Logo/Badge */}
          <div className="inline-block">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
              <p className="text-white font-semibold text-sm md:text-base">GDG Cloud Bandung Presents</p>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            Cloud DevFest
            <span className="block text-4xl md:text-6xl lg:text-7xl mt-2">Bandung 2025</span>
          </h1>

          {/* Theme */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto font-light">
            Building Safe, Secure and Scalable Solutions with AI and Cloud
          </p>

          {/* Event Details */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 pt-4">
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="w-5 h-5" />
              <span className="text-lg font-medium">December 6, 2025</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5" />
              <span className="text-lg font-medium">Bandung, Indonesia</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Users className="w-5 h-5" />
              <span className="text-lg font-medium">500+ Developers</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <a href="https://www.goersapp.com/events/indonesia-premier-cloud-and-ai-festival-dev-fest-cloud-bandung-2025--devfestcloudbdg25" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-6 rounded-full shadow-2xl"
              >
                Register Now
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
