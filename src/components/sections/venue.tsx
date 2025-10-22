import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Building, Navigation } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

export default function Venue() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'venue-map');
  const venueAddress = "Selah Hall, Piset Square, Bandung";
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`;

  return (
    <section id="venue" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Conference Venue
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find your way to the heart of innovation in Bandung.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                  <Building className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold font-headline">Selah Hall, Piset Square</h3>
              </div>
              <div className="mt-6 flex items-start gap-3">
                <div className="bg-primary/10 text-primary p-3 rounded-lg mt-1">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <p className="text-muted-foreground">{venueAddress}</p>
                </div>
              </div>

              <div className="mt-6">
                <Button asChild>
                  <Link href={googleMapsLink} target="_blank">
                    <Navigation className="mr-2 h-4 w-4" /> Get Directions
                  </Link>
                </Button>
              </div>

              <div className="mt-8 border-t pt-6">
                  <h4 className="font-semibold mb-2">Accommodation</h4>
                  <p className="text-muted-foreground">
                    Bandung offers a wide range of hotels and guesthouses near the venue. We recommend booking in advance through your favorite travel apps.
                  </p>
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
