import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Exhibition() {
  const image = PlaceHolderImages.find(p => p.id === 'exhibition-floor');

  return (
    <section id="exhibition" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Exhibition Hall
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore cutting-edge technology and network with our innovative sponsors.
          </p>
        </div>
        {image && (
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
      </div>
    </section>
  );
}
