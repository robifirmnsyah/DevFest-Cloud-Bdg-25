import { schedule, getSpeakerById } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User } from "lucide-react";

const SessionItem = ({ session }: { session: (typeof schedule.mainHall)[0] }) => {
  const speaker = getSpeakerById(session.speakerId);

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-primary mb-1">
            <Clock className="h-4 w-4" />
            <span>{session.time}</span>
            {session.duration && <span className="text-muted-foreground">({session.duration})</span>}
          </div>
          <h4 className="font-bold font-headline">{session.title}</h4>
        </div>
        {speaker && (
            <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
              <User className="h-4 w-4" />
              <span>{speaker.name}</span>
            </div>
          )}
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
            Event Schedule
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            December 6, 2025 - Two parallel tracks for your learning journey
          </p>
        </div>

        <Tabs defaultValue="main-hall" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
            <TabsTrigger value="main-hall">Main Hall: Techtalk</TabsTrigger>
            <TabsTrigger value="upper-hall">Upper Hall: Workshop</TabsTrigger>
          </TabsList>
          <TabsContent value="main-hall">
            <div className="space-y-4 mt-8 max-w-4xl mx-auto">
              {schedule.mainHall.map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="upper-hall">
            <div className="space-y-4 mt-8 max-w-4xl mx-auto">
                <Card className="text-center p-8">
                    <p className="text-muted-foreground">Workshop schedule will be announced soon. Stay tuned!</p>
                </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
