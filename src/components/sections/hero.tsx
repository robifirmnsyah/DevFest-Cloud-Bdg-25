import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import Header from "../layout/header";

export default function Hero() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center text-white gradient-background">
      <Header />
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-32 pb-24 md:pt-48 md:pb-40">
        <Badge
          variant="secondary"
          className="mb-4 bg-white/10 text-white backdrop-blur-sm"
        >
          GDG Cloud Bandung Presents
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
          Cloud DevFest <br /> Bandung 2025
        </h1>
        <p className="mt-4 max-w-3xl text-lg md:text-xl text-primary-foreground/80">
          Building Safe, Secure and Scalable Solutions with AI and Cloud
        </p>
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>December 6, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>Bandung, Indonesia</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>500+ Developers</span>
          </div>
        </div>
        <div className="mt-10 flex gap-4">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90" asChild>
            <Link href="#tickets">
              Register Now
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10 hover:text-white" asChild>
            <Link href="#schedule">
              View Schedule
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
