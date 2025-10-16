import { schedule, getSpeakerById } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, User, Target, CheckCircle } from "lucide-react";
import Image from "next/image";

const SessionItem = ({ session }: { session: (typeof schedule.day1)[0] }) => {
  const speaker = getSpeakerById(session.speakerId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 flex gap-4">
            <div className="w-24 text-right text-primary font-bold">{session.time}</div>
            <div className="border-l pl-4 flex-1">
              <h4 className="font-bold font-headline">{session.title}</h4>
              {speaker && <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <User className="h-4 w-4" />
                {speaker.name}
              </p>}
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4" />
                {session.location}
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline mb-2">{session.title}</DialogTitle>
          {speaker && (
            <div className="flex items-center gap-4 mb-4">
               <Image
                  src={speaker.photo.imageUrl}
                  alt={`Photo of ${speaker.name}`}
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                  data-ai-hint={speaker.photo.imageHint}
                />
              <div>
                <p className="font-semibold">{speaker.name}</p>
                <p className="text-sm text-primary">{speaker.title}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {session.time}</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {session.location}</span>
          </div>
          <DialogDescription className="text-base text-foreground/80">{session.description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h5 className="font-semibold font-headline flex items-center gap-2 mb-2"><Target className="h-5 w-5 text-primary" /> Target Audience</h5>
            <p className="text-muted-foreground">{session.audience}</p>
          </div>
          <div>
            <h5 className="font-semibold font-headline flex items-center gap-2 mb-2"><CheckCircle className="h-5 w-5 text-primary" /> Learning Objectives</h5>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              {session.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function Schedule() {
  return (
    <section id="schedule" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Event Schedule
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Plan your days at DevFest. Don't miss out on your favorite talks and workshops!
          </p>
        </div>

        <Tabs defaultValue="day1" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto h-auto">
            <TabsTrigger value="day1" className="py-2">Day 1 (Oct 25)</TabsTrigger>
            <TabsTrigger value="day2" className="py-2">Day 2 (Oct 26)</TabsTrigger>
          </TabsList>
          <TabsContent value="day1">
            <div className="space-y-4 mt-8">
              {schedule.day1.map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="day2">
            <div className="space-y-4 mt-8">
              {schedule.day2.map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
