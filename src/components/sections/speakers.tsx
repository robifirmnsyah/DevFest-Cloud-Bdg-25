import Image from "next/image";
import { speakers } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

export default function Speakers() {
  return (
    <section id="speakers" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Speakers
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from the experts in the field of technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <Image
                  src={speaker.photo.imageUrl}
                  alt={`Photo of ${speaker.name}`}
                  fill
                  className="rounded-full object-cover shadow-lg"
                  data-ai-hint={speaker.photo.imageHint}
                />
              </div>
              <h3 className="text-lg font-bold font-headline">{speaker.name}</h3>
              <p className="text-sm text-primary">{speaker.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
