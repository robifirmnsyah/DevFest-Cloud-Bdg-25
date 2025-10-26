import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

export default function Venue() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'venue-map');
  const venueAddress = "Jl. Braga No.99, Braga, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40111";
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Landmark Convention Hall")}`;

  return (
    <section id="venue" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Venue
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            The event will be held at the Landmark Convention Hall, Bandung.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold font-headline mb-4">Landmark Convention Hall</h3>
              
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <p className="text-muted-foreground">{venueAddress}</p>
                </div>
              </div>

              <div className="mt-6">
                <Button asChild>
                  <Link href={googleMapsLink} target="_blank">
                    <Navigation className="mr-2 h-4 w-4" /> Open in Maps
                  </Link>
                </Button>
              </div>
            </div>
            {mapImage && (
              <div className="relative min-h-[300px] lg:min-h-0">
                <Image
                  src={mapImage.imageUrl}
                  alt={mapImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={mapImage.imageHint}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
