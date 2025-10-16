import Image from "next/image";
import Link from "next/link";
import { speakers } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Linkedin, Twitter } from "lucide-react";

export default function Speakers() {
  return (
    <section id="speakers" className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Meet Our Speakers
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from industry experts and thought leaders at the forefront of technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker) => (
            <Dialog key={speaker.id}>
              <DialogTrigger asChild>
                <Card className="overflow-hidden text-center cursor-pointer hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <Image
                      src={speaker.photo.imageUrl}
                      alt={`Photo of ${speaker.name}`}
                      width={500}
                      height={500}
                      className="w-full h-auto aspect-square object-cover"
                      data-ai-hint={speaker.photo.imageHint}
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-headline">{speaker.name}</CardTitle>
                    <p className="text-sm text-primary mt-1">{speaker.title}</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Image
                      src={speaker.photo.imageUrl}
                      alt={`Photo of ${speaker.name}`}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-40 h-40"
                      data-ai-hint={speaker.photo.imageHint}
                    />
                    <div className="text-left">
                      <DialogTitle className="text-2xl font-headline">{speaker.name}</DialogTitle>
                      <p className="text-md text-primary mt-1">{speaker.title}</p>
                      <DialogDescription className="mt-4">
                        {speaker.bio}
                      </DialogDescription>
                      <div className="flex gap-2 mt-4">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={speaker.socials.twitter} target="_blank" aria-label={`${speaker.name}'s Twitter`}>
                            <Twitter className="h-5 w-5" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={speaker.socials.linkedin} target="_blank" aria-label={`${speaker.name}'s LinkedIn`}>
                            <Linkedin className="h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
