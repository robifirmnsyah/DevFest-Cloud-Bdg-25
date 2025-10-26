import { Button } from "@/components/ui/button";
import { Ticket, Users, Calendar } from "lucide-react";

const Registration = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden" id="register">
      <div className="absolute inset-0 gradient-hero"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Join Us at DevFest 2025
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Don't miss this opportunity to learn, network, and grow with the developer community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 py-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Ticket className="w-10 h-10 text-white mx-auto mb-4" />
              <p className="text-2xl font-bold text-white mb-2">Free Entry</p>
              <p className="text-white/80">Limited slots available</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Users className="w-10 h-10 text-white mx-auto mb-4" />
              <p className="text-2xl font-bold text-white mb-2">500+ Attendees</p>
              <p className="text-white/80">Network with peers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Calendar className="w-10 h-10 text-white mx-auto mb-4" />
              <p className="text-2xl font-bold text-white mb-2">Full Day</p>
              <p className="text-white/80">Talks & Workshops</p>
            </div>
          </div>

          <div className="pt-4">
            <a href="https://bit.ly/devcloudfest25" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold text-xl px-12 py-8 rounded-full shadow-2xl transform transition-all hover:scale-105"
              >
                Register Now - It's Free!
              </Button>
            </a>
            <p className="text-white/70 mt-4 text-sm">Limited slots available</p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Registration;
