import Image from "next/image";
import Link from "next/link";
import { sponsors } from "@/lib/data";
import { Button } from "../ui/button";

const SponsorTier = ({ title, items, size }: { title: string, items: typeof sponsors.platinum, size: {width: number, height: number, className: string} }) => (
  <div className="mb-12">
    <h3 className="text-2xl font-bold font-headline text-center text-primary mb-6">{title}</h3>
    <div className={`flex justify-center items-center gap-8 flex-wrap ${size.className}`}>
      {items.map((sponsor) => (
        <Link href={sponsor.website} target="_blank" key={sponsor.id} className="grayscale hover:grayscale-0 transition-all duration-300">
          <Image
            src={sponsor.logo.imageUrl}
            alt={`${sponsor.name} logo`}
            width={size.width}
            height={size.height}
            className="object-contain"
            data-ai-hint={sponsor.logo.imageHint}
          />
        </Link>
      ))}
    </div>
  </div>
);

export default function Sponsors() {
  return (
    <section id="sponsors" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Sponsors
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            This event is supported by our amazing sponsors.
          </p>
        </div>

        <SponsorTier title="Platinum" items={sponsors.platinum} size={{width: 300, height: 150, className: "max-w-lg mx-auto"}} />
        <SponsorTier title="Gold" items={sponsors.gold} size={{width: 250, height: 125, className: "max-w-2xl mx-auto"}} />
        <SponsorTier title="Silver" items={sponsors.silver} size={{width: 200, height: 100, className: "max-w-3xl mx-auto"}} />
        
      </div>
    </section>
  );
}
