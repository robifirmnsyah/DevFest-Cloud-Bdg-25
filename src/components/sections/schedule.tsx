import { schedule, getSpeakerById } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, User, Info } from "lucide-react";
import Image from "next/image";

const SessionItem = ({ session }: { session: (typeof schedule.day1)[0] }) => {
  const speaker = getSpeakerById(session.speakerId);

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-28 text-left sm:text-right text-primary font-bold">{session.time}</div>
        <div className="border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-4 flex-1">
          <h4 className="font-bold font-headline">{session.title}</h4>
          {speaker ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <User className="h-4 w-4" />
              {speaker.name}
            </p>
          ) : session.description ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Info className="h-4 w-4" />
                {session.description}
            </p>
          ) : null}
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4" />
            {session.location}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Schedule() {
  return (
    <section id="schedule" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Schedule
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            The DevFest Bandung 2024 schedule is packed with exciting sessions.
          </p>
        </div>

        <Tabs defaultValue="day1" className="w-full">
          <TabsList className="grid w-full grid-cols-1 max-w-sm mx-auto h-auto">
            <TabsTrigger value="day1">Dec 12</TabsTrigger>
          </TabsList>
          <TabsContent value="day1">
            <div className="space-y-4 mt-8">
              {schedule.day1.map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
