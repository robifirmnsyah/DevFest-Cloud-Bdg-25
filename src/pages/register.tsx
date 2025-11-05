import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";

const Register = () => {
  useEffect(() => {
    // Script sudah dimuat di index.html, widget akan render otomatis
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      {/* Hero Section with Solid Background */}
      <div className="relative pt-32 pb-20 bg-muted/30">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block">
              <div className="bg-primary/10 backdrop-blur-sm px-6 py-2 rounded-full border border-primary/30">
                <p className="text-primary font-semibold text-sm md:text-base flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Limited Seats Available!
                </p>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Register for DevFest 2025
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Secure your spot at Indonesia's Premier Cloud & AI Festival
            </p>
          </div>
        </div>
      </div>
      
      <main className="flex-1 pb-20 bg-background">
        <div className="container mx-auto px-4 -mt-12">
          {/* Event Details Card - Landscape */}
          <div className="max-w-5xl mx-auto mb-12">
            <Card className="gradient-card border-primary/20 shadow-[var(--shadow-lg)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-around gap-6 md:gap-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                      <p className="font-bold text-foreground">December 6, 2025</p>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-12 bg-border"></div>

                  <div className="flex items-center gap-3">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                      <Clock className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Time</p>
                      <p className="font-bold text-foreground">9:00 AM - 5:00 PM WIB</p>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-12 bg-border"></div>

                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
                      <p className="font-bold text-foreground">Selan Hall, Piset Square</p>
                      <p className="text-xs text-muted-foreground">Bandung, Indonesia</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Widget Container */}
          <div className="max-w-5xl mx-auto">
            <Card className="gradient-card border-primary/20 shadow-[var(--shadow-lg)] transition-all duration-300">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
                    Get Your Ticket Now
                  </h2>
                  <p className="text-muted-foreground">
                    Limited early bird tickets available. Don't miss out!
                  </p>
                </div>

                {/* GOERS Widget */}
                <div id="goers-widget-container" className="min-h-[400px]">
                  <a 
                    id="___GOERS___widget" 
                    href="https://goersapp.com/events/indonesia-premier-cloud-ai-festival-devfest-cloud-bandung-2025--devfestcloudbdg25" 
                    data-background-color="transparent"
                  >
                    Indonesia Premier Cloud & AI Festival (DevFest Cloud Bandung 2025)
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-16 max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
              Why Attend DevFest 2025?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="gradient-card border-primary/20 text-center hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="text-5xl mb-4">🎯</div>
                  <h4 className="font-bold text-lg mb-3 text-foreground">Learn From Experts</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Gain insights from Google Developer Experts and industry leaders on AI, Cloud, and cutting-edge technologies
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-secondary/20 text-center hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="text-5xl mb-4">🚀</div>
                  <h4 className="font-bold text-lg mb-3 text-foreground">Hands-On Experience</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Participate in intensive workshops covering Flowise, n8n, NotebookLM, Cyber Security, and more
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-accent/20 text-center hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="text-5xl mb-4">🤝</div>
                  <h4 className="font-bold text-lg mb-3 text-foreground">Build Connections</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Network with fellow developers, share ideas, and build lasting professional relationships
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
