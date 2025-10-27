import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Ticket, Sparkles } from "lucide-react";

const Presale = () => {
  return (
    <section id="presale" className="py-20 md:py-32 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Presale Badge */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent via-[hsl(4,90%,58%)] to-accent blur-xl opacity-50 animate-pulse"></div>
            <h2 className="relative text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-gradient-to-r from-accent via-[hsl(4,90%,58%)] to-accent bg-clip-text tracking-tight transform -skew-x-6">
              PRESALE
            </h2>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            <p className="text-xl md:text-2xl font-bold text-foreground">Limited Seats Available!</p>
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          </div>
        </div>

        {/* Main Ticket Card */}
        <Card className="max-w-4xl mx-auto gradient-card border-2 border-primary/30 shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-2 transition-all duration-500">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Left Side - Main Info */}
              <div className="space-y-6">
                <div>
                  <Badge className="bg-secondary text-secondary-foreground mb-4 text-sm px-4 py-1">
                    Early Bird Special
                  </Badge>
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
                    Lock Your Seat
                    <br />
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      DevFest 2025
                    </span>{" "}
                    Awaits!
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Join the Revolution of Technology
                  </p>
                </div>

                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl md:text-6xl font-black text-secondary">
                      30k
                    </span>
                    <span className="text-2xl text-muted-foreground line-through">
                      55k
                    </span>
                  </div>
                  <Badge variant="outline" className="border-secondary text-secondary font-semibold">
                    <Ticket className="w-3 h-3 mr-1" />
                    Limited Seats
                  </Badge>
                </div>

                {/* CTA Button */}
                <a 
                  href="https://bit.ly/devcloudfest25" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    size="lg"
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 rounded-xl transform transition-all hover:scale-105 shadow-lg"
                  >
                    Purchase Your Ticket Now
                  </Button>
                </a>
              </div>

              {/* Right Side - Event Details */}
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-2xl p-6 space-y-5">
                  <h4 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Save the Date
                  </h4>

                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Location</p>
                        <p className="text-muted-foreground">Selan Hall, Piset Square</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <div className="bg-secondary/10 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Date</p>
                        <p className="text-muted-foreground">December 6, 2025</p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-3">
                      <div className="bg-accent/10 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Time</p>
                        <p className="text-muted-foreground">9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <p className="text-sm text-center text-muted-foreground">
                    🎉 Early bird discount ends soon! <br />
                    <span className="font-semibold text-primary">Save 45% now</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h4 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            What's Included in Your Ticket?
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Full Day Access", desc: "All techtalks & workshops" },
              { title: "Swag Exclusive", desc: "Official DevFest Merchandise" },
              { title: "Networking", desc: "Connect with 500+ developers" },
            ].map((benefit, index) => (
              <Card key={index} className="gradient-card border-primary/20 text-center hover:shadow-[var(--shadow-card)] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">✨</div>
                  <h5 className="font-bold text-lg mb-2 text-foreground">{benefit.title}</h5>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Presale;
