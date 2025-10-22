import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Calendar, MapPin, Ticket } from "lucide-react";

export default function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-bg');

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
          Bandung DevFest 2025
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/80">
          In person event - Conference, hands on workshop, exhibition
        </p>
        <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            <span>Saturday, 06 December 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            <span>Selah Hall, Piset Square</span>
          </div>
        </div>
        <Button size="lg" className="mt-8" asChild>
          <Link href="#">
            <Ticket className="mr-2 h-5 w-5" />
            Register Now
          </Link>
        </Button>
      </div>
    </section>
  );
}
