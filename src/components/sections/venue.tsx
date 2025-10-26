import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, Calendar, Users, Briefcase } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

export default function Venue() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'venue-map');
  const venueName = "Selah Hall, Piset Square";
  const venueAddress = "Jl. Pelajar Pejuang 45 No.119, Lkr. Sel., Kec. Lengkong, Kota Bandung";
  const googleMapsLink = "https://share.google/VCfLUOgZt3BJ5Ir98";

  const details = [
    { icon: <Calendar className="h-5 w-5 text-primary" />, text: "Saturday, 06 December 2025" },
    { icon: <Briefcase className="h-5 w-5 text-primary" />, text: "In person event - Conference, hands on workshop, exhibition" },
    { icon: <Users className="h-5 w-5 text-primary" />, text: "1000 person capacity" },
  ];

  return (
    <section id="venue" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Venue
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="lg:order-last">
                {mapImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
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
            <div className="flex flex-col gap-6">
                <h3 className="text-2xl font-bold font-headline">{venueName}</h3>
                
                <div className="space-y-4">
                    {details.map((detail, index) => (
                        <div key={index} className="flex items-start gap-4">
                            {detail.icon}
                            <p className="text-muted-foreground">{detail.text}</p>
                        </div>
                    ))}
                </div>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Location</p>
                                <p className="text-muted-foreground">{venueAddress}</p>
                            </div>
                        </div>
                        <Button asChild className="mt-4">
                            <Link href={googleMapsLink} target="_blank">
                                <Navigation className="mr-2 h-4 w-4" /> Open in Maps
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </section>
  );
}
