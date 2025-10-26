import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Ticket, Sparkles, WandSparkles } from "lucide-react";
import Link from "next/link";

const includedFeatures = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Full Day Access",
      description: "All techtalks & workshops"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Networking",
      description: "Connect with 500+ developers"
    }
  ];

export default function Tickets() {
  return (
    <section id="tickets" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-transparent bg-clip-text relative inline-block uppercase"
            style={{
                filter: 'drop-shadow(0 0 1.5rem rgba(255,165,0,0.7))'
            }}>
                PRESALE
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-medium">
                <Sparkles className="inline-block h-5 w-5 text-yellow-400" /> Limited Seats Available! <Sparkles className="inline-block h-5 w-5 text-yellow-400" />
            </p>
        </div>

        <Card className="max-w-5xl mx-auto shadow-lg p-6 md:p-8">
            <CardContent className="p-0 grid md:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col gap-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 w-fit">Early Bird Special</Badge>
                    <h3 className="text-3xl md:text-4xl font-bold font-headline">
                        Lock Your Seat <br />
                        <span className="text-primary">DevFest 2025</span> Awaits!
                    </h3>
                    <p className="text-muted-foreground">Join the Revolution of Technology</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">30k</span>
                        <span className="text-2xl text-muted-foreground line-through">55k</span>
                    </div>
                    <Badge variant="outline" className="w-fit"><Ticket className="h-4 w-4 mr-2"/>Limited Seats</Badge>
                    <Button size="lg" className="w-full md:w-fit mt-4 bg-green-600 hover:bg-green-700 text-white" asChild>
                        <Link href="#">Purchase Your Ticket Now</Link>
                    </Button>
                </div>
                <div className="bg-muted/30 p-6 rounded-lg space-y-4">
                    <h4 className="font-bold font-headline flex items-center gap-2 text-lg"><Calendar className="h-5 w-5 text-primary"/>Save the Date</h4>
                    <div className="space-y-3 pl-7 border-l-2 border-primary/20 ml-2.5">
                        <div>
                            <p className="font-semibold">Location</p>
                            <p className="text-muted-foreground">Selan Hall, Piset Square</p>
                        </div>
                        <div>
                            <p className="font-semibold">Date</p>
                            <p className="text-muted-foreground">December 6, 2025</p>
                        </div>
                        <div>
                            <p className="font-semibold">Time</p>
                            <p className="text-muted-foreground">9:00 AM - 5:00 PM</p>
                        </div>
                    </div>
                    <div className="bg-blue-100 text-blue-800 p-4 rounded-lg flex items-center gap-3 mt-4">
                        <WandSparkles className="h-5 w-5 text-blue-600"/>
                        <div>
                            <p className="font-semibold">Early bird discount ends soon!</p>
                            <Link href="#" className="text-blue-600 font-bold hover:underline">Save 45% now</Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="mt-24 text-center">
            <h3 className="text-3xl md:text-4xl font-bold font-headline">What's Included in Your Ticket?</h3>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {includedFeatures.map((feature, index) => (
                    <Card key={index} className="p-6 text-center bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex justify-center items-center h-12 w-12 rounded-full bg-primary/10 mx-auto mb-4">
                            {feature.icon}
                        </div>
                        <h4 className="text-lg font-bold font-headline">{feature.title}</h4>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </Card>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
}
