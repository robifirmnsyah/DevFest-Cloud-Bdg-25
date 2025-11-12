import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, User } from "lucide-react";

const Speakers = () => {
  const speakers = [
    {
      name: "Angga Agia",
      image: "/images/Angga.jpg",
      topic: "NotebookLM as Your Company Insights Engine",
      title: "IT Manager Langham Hospitality Group & Google Cloud Dev Expert",
      detail:
        "Build company-level insights from internal docs using NotebookLM. Live demo: ingest, query, and visualize insights.",
      track: "Workshop",
    },
    {
      name: "M Ghifary",
      image: "/images/Ghifary.jpg",
      topic: "Personal Doctor AI Assistant",
      title: "CTO GovTech Edu & Google AI Dev Expert",
      detail:
        "Designing a privacy-aware personal medical assistant with MedGemma — intents, data connectors, and safety considerations.",
      track: "Workshop",
    },
    {
      name: "Luqman Aljundi",
      image: "/images/Luqman.jpg",
      topic: "GCP Discount & Billing",
      title: "Business Lead GITS Cloud",
      detail:
        "Practical strategies to apply discounts, monitor costs, and set alerts to avoid surprising bills in GCP.",
      track: "Techtalk",
    },
    {
      name: "Azhar Fuad",
      image: "/images/Azhar.jpg",
      topic: "Ethical Video with AI",
      title: "CEO Curaweda",
      detail:
        "Best practices and tooling for creating responsible video content with generative AI while avoiding misuse.",
      track: "Techtalk",
    },
    {
      name: "Meyta Jennis",
      image: "/images/Meyta.jpg",
      topic: "Visual Agent Builder",
      title: "Act Principal Coordinator ITSEC Asia",
      detail:
        "Create and orchestrate multi-agent workflows visually in ADK — patterns, debugging, and production tips.",
      track: "Workshop",
    },
    {
      name: "Cendekia Luthfieta",
      image: "/images/Cendekia.png",
      topic: "AI/ML for Power Outage Detection",
      title: "Contact System Center Officer PLN",
      detail:
        "Detect anomalies and predict outages using sensor data and ML models; deployment strategies for edge and cloud.",
      track: "Techtalk",
    },
    {
      name: "Ibnu Wardy",
      image: "/images/Ibnu.jpg",
      topic: "Spec Driven Development",
      title: "CTO Carte WMS & Google AI & Cloud Dev Expert",
      detail:
        "Using spec-driven workflows to reduce rework: spec-first design, tests-as-specs, and fast iteration patterns.",
      track: "Techtalk",
    },
    {
      name: "Natali Ardianto",
      image: "/images/Natali.jpg",
      title: "Founder Tiket.com & CEO Lifepack",
      topic: "TBD",
      detail: "Coming Soon",
      track: "Workshop",
    },
    {
      name: "Farah Clara",
      image: "/images/Farah.jpg",
      title: "Community Organizer PythonID",
      topic: "TBD",
      detail: "Coming Soon",
      track: "Techtalk",
    },
    {
      name: "Rendra Toro",
      image: "/images/Rendra.jpg",
      title: "CEO Lintas Media Danawa",
      topic: "TBD",
      detail: "Coming Soon",
      track: "Workshop",
    },
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {speakers.map((speaker, index) => (
            <Card 
              key={index} 
              className="gradient-card hover:shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-3 border-2 border-primary/10 hover:border-primary/30 overflow-hidden group"
            >
              <CardContent className="p-0">
                {/* Image Section with Track Badge */}
                {/* CHANGED: increase container height responsively, center image, reduce hover scale */}
                <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-102"
                    onError={(e) =>
                      (e.currentTarget.src = "/images/Angga.jpg")
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                  
                  <Badge 
                    className={`absolute top-4 right-4 ${
                      speaker.track === 'Techtalk' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-white'
                    } px-3 py-1 text-xs font-bold shadow-lg`}
                  >
                    {speaker.track}
                  </Badge>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                  {/* Speaker Name & Title */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {speaker.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {speaker.title}
                    </p>
                  </div>

                  {/* Topic - Highlighted Section */}
                  {speaker.topic !== "TBD" ? (
                    <div className="speaker-topic-highlight">
                      <div className="flex items-start gap-2 justify-center">
                        <Sparkles className="w-5 h-5 flex-shrink-0 mt-1" />
                        <p className="text-base font-bold leading-tight text-center">
                          {speaker.topic}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="coming-soon-badge">
                      <div className="flex items-center gap-2 justify-center">
                        <Sparkles className="w-5 h-5" />
                        <p className="text-base font-bold">
                          Coming Soon
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Detail */}
                  <p className="text-sm text-muted-foreground leading-relaxed text-center min-h-[60px]">
                    {speaker.detail}
                  </p>
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
