import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader } from "@/components/ui/card";
import { Clock, User } from "lucide-react";

const Schedule = () => {
  const mainHallSessions = [
    { time: "9:15 AM - 9:50 AM", title: "Opening & Keynote", speaker: "", duration: "35 min" },
    { time: "10:00 AM - 10:35 AM", title: "Techtalk 1: AI di Industri Film", speaker: "Azhar Fuad", duration: "35 min" },
    { time: "10:55 AM - 11:30 AM", title: "Techtalk 2: Persib", speaker: "Adhitia", duration: "35 min" },
    { time: "11:30 AM - 1:00 PM", title: "LUNCH BREAK", speaker: "", duration: "1.5 hrs", isBreak: true },
    { time: "1:00 PM - 1:35 PM", title: "Techtalk 3: AI di PLN", speaker: "Cendekia Luthfieta", duration: "35 min" },
    { time: "1:55 PM - 2:30 PM", title: "Techtalk 4: GCP Billing", speaker: "Luqman Aljundi", duration: "35 min" },
    { time: "2:50 PM - 3:25 PM", title: "Techtalk 5: Python", speaker: "Farah Clara", duration: "35 min" },
    { time: "3:45 PM - 4:20 PM", title: "Techtalk 6", speaker: "Ibnu Wardy", duration: "35 min" },
    { time: "4:40 PM - 4:50 PM", title: "CLOSING", speaker: "", duration: "10 min", isBreak: true },
  ];

  const workshopSessions = [
    { time: "10:00 AM - 10:45 AM", title: "Workshop 1: Flowise", speaker: "Rendra Toro", duration: "45 min" },
    { time: "10:55 AM - 11:40 AM", title: "Workshop 2: n8n", speaker: "Natali Ardianto", duration: "45 min" },
    { time: "11:50 AM - 1:00 PM", title: "LUNCH BREAK", speaker: "", duration: "1 hr 10 min", isBreak: true },
    { time: "1:00 PM - 1:45 PM", title: "Workshop 3: NotebookLM", speaker: "Angga Agia", duration: "45 min" },
    { time: "1:55 PM - 2:40 PM", title: "Workshop 4: Cyber Security", speaker: "Meyta Jennis", duration: "45 min" },
    { time: "2:50 PM - 3:35 PM", title: "Workshop 5: Gemma", speaker: "M Ghifary", duration: "45 min" },
    { time: "3:45 PM - 4:30 PM", title: "Workshop 6: AI for Stock", speaker: "Farhan Rafly", duration: "45 min" },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30" id="schedule">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Event Schedule
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            December 6, 2025 - Two parallel tracks for your learning journey
          </p>
        </div>

        <Tabs defaultValue="main" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-14">
            <TabsTrigger value="main" className="text-lg font-semibold">Main Hall: Techtalk</TabsTrigger>
            <TabsTrigger value="workshop" className="text-lg font-semibold">Upper Hall: Workshop</TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-4">
            {mainHallSessions.map((session, index) => (
              <Card 
                key={index} 
                className={`${session.isBreak ? 'bg-muted border-dashed' : 'gradient-card hover:shadow-[var(--shadow-card)]'} transition-all duration-300`}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <Clock className="w-4 h-4" />
                        <span>{session.time}</span>
                        <span className="text-xs text-muted-foreground ml-2">({session.duration})</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{session.title}</h3>
                    </div>
                    {session.speaker && (
                      <div className="flex items-center gap-2 text-muted-foreground bg-primary/5 px-4 py-2 rounded-full">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{session.speaker}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="workshop" className="space-y-4">
            {workshopSessions.map((session, index) => (
              <Card 
                key={index} 
                className={`${session.isBreak ? 'bg-muted border-dashed' : 'gradient-card hover:shadow-[var(--shadow-card)]'} transition-all duration-300`}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-secondary font-semibold">
                        <Clock className="w-4 h-4" />
                        <span>{session.time}</span>
                        <span className="text-xs text-muted-foreground ml-2">({session.duration})</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{session.title}</h3>
                    </div>
                    {session.speaker && (
                      <div className="flex items-center gap-2 text-muted-foreground bg-secondary/5 px-4 py-2 rounded-full">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{session.speaker}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Schedule;
