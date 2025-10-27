import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

const Speakers = () => {
  const speakers = [
    { name: "Angga Agia", topic: "IT Manager Langham Hospitality Group & Google Cloud Dev Expert", track: "Workshop" },
    { name: "M Ghifary", topic: "CTO GovTech Edu & Google AI Dev Expert", track: "Workshop" },
    { name: "Luqman Aljundi", topic: "Business Lead GITS Cloud", track: "Techtalk" },
    { name: "Azhar Fuad", topic: "CEO Curaweda", track: "Techtalk" },
    { name: "Meyta Jennis", topic: "Act Principal Coordinator ITSEC Asia", track: "Workshop" },
    { name: "Natali Ardianto", topic: "Founder Tiket.com & CEO Lifepack", track: "Workshop" },
    { name: "Farah Clara", topic: "Community Organizer PythonID", track: "Techtalk" },
    { name: "Rendra Toro", topic: "CEO Lintas Media Danawa", track: "Workshop" },
    { name: "Cendekia Luthfieta", topic: "Contact System Center Officer PLN", track: "Techtalk" },
    { name: "Ibnu Wardy", topic: "CTO Carte WMS & Google AI & Cloud Dev Expert", track: "Techtalk" },
  ];

  return (
    <section className="py-20 md:py-32 bg-background" id="speakers">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-secondary via-primary to-[hsl(271,76%,53%)] bg-clip-text text-transparent">
            Our Speakers
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn from industry experts and Google Developer Experts
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {speakers.map((speaker, index) => (
            <Card 
              key={index} 
              className="gradient-card hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-2 border-primary/20"
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-2">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{speaker.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{speaker.topic}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    speaker.track === 'Techtalk' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-secondary/10 text-secondary'
                  }`}>
                    {speaker.track}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Speakers;
