import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Puzzle background colors
const puzzleColors = [
  "bg-gradient-to-br from-[#FFE066]/80 via-[#FFF6E0]/90 to-[#FFD6A5]/80",
  "bg-gradient-to-br from-[#A2D5F2]/80 via-[#EAF6FF]/90 to-[#B5EAD7]/80",
  "bg-gradient-to-br from-[#FFB3C6]/80 via-[#FFF0F6]/90 to-[#C3B1E1]/80",
  "bg-gradient-to-br from-[#B5EAD7]/80 via-[#E0FFF6]/90 to-[#A2D5F2]/80",
  "bg-gradient-to-br from-[#FFD6A5]/80 via-[#FFF6E0]/90 to-[#FFE066]/80",
  "bg-gradient-to-br from-[#C3B1E1]/80 via-[#F6F0FF]/90 to-[#FFB3C6]/80",
  "bg-gradient-to-br from-[#FFDAC1]/80 via-[#FFF6E0]/90 to-[#FFD6A5]/80",
  "bg-gradient-to-br from-[#B5EAD7]/80 via-[#E0FFF6]/90 to-[#A2D5F2]/80",
  "bg-gradient-to-br from-[#A2D5F2]/80 via-[#EAF6FF]/90 to-[#B5EAD7]/80",
  "bg-gradient-to-br from-[#FFB3C6]/80 via-[#FFF0F6]/90 to-[#C3B1E1]/80",
  "bg-gradient-to-br from-[#FFE066]/80 via-[#FFF6E0]/90 to-[#FFD6A5]/80",
  "bg-gradient-to-br from-[#FFD6A5]/80 via-[#FFF6E0]/90 to-[#FFDAC1]/80",
  "bg-gradient-to-br from-[#C3B1E1]/80 via-[#F6F0FF]/90 to-[#FFB3C6]/80",
  "bg-gradient-to-br from-[#FFDAC1]/80 via-[#FFF6E0]/90 to-[#FFD6A5]/80",
];

const Speakers = () => {
  const speakers = [
    {
      name: "Jason Stanley",
      image: "/images/jason.jpg",
      title: "Full Stack Web3 Engineer @ Xellar",
      topic: "Web3 Explained: What Happens When Users Own The Internet. Do We Need Cloud?",
      detail: "Understand the future of Web3 and cloud from a developer's perspective.",
      track: "Techtalk",
    },
    {
      name: "Luqman Aljundi",
      image: "/images/luqman.jpg",
      topic: "GCP Discount & Billing",
      title: "Business Lead GITS Cloud",
      detail:
        "Practical strategies to apply discounts, monitor costs, and set alerts to avoid surprising bills in GCP.",
      track: "Techtalk",
    },
    {
      name: "Azhar Fuad",
      image: "/images/azhar.jpg",
      topic: "Ethical Video with AI",
      title: "CEO Curaweda",
      detail:
        "Best practices and tooling for creating responsible video content with generative AI while avoiding misuse.",
      track: "Techtalk",
    },
    {
      name: "Meyta Jennis",
      image: "/images/meyta.jpg",
      topic: "Visual Agent Builder",
      title: "Act Principal Coordinator ITSEC Asia",
      detail:
        "Create and orchestrate multi-agent workflows visually in ADK — patterns, debugging, and production tips.",
      track: "Workshop",
    },
    {
      name: "Cendekia Luthfieta",
      image: "/images/cendekia.jpg",
      topic: "AI/ML for Power Outage Detection",
      title: "Contact System Center Officer PLN",
      detail:
        "Detect anomalies and predict outages using sensor data and ML models; deployment strategies for edge and cloud.",
      track: "Techtalk",
    },
    {
      name: "Ibnu Wardy",
      image: "/images/ibnu.jpg",
      topic: "Spec Driven Development",
      title: "CTO Carte WMS & Google AI & Cloud Dev Expert",
      detail:
        "Using spec-driven workflows to reduce rework: spec-first design, tests-as-specs, and fast iteration patterns.",
      track: "Techtalk",
    },
    {
      name: "Natali Ardianto",
      image: "/images/natali.jpg",
      title: "Founder Tiket.com & CEO Lifepack",
      topic: "Intro to n8n: Creating expense tracker in 30 minutes",
      detail: "Learn how to automate expense tracking in minutes using n8n.",
      track: "Workshop",
    },
    {
      name: "Farah Clara",
      image: "/images/farah.jpg",
      title: "Community Organizer PythonID",
      topic: "Python Landscape in Industry and Community",
      detail: "Explore Python's impact in industry and community.",
      track: "Techtalk",
    },
    {
      name: "M Ghifary",
      image: "/images/ghifari.jpg",
      topic: "Personal Doctor AI Assistant",
      title: "CTO GovTech Edu & Google AI Dev Expert",
      detail:
        "Designing a privacy-aware personal medical assistant with MedGemma — intents, data connectors, and safety considerations.",
      track: "Workshop",
    },
    {
      name: "Farhan Rafly",
      image: "/images/farhan.jpg",
      title: "Frontend Engineer at Ape AI",
      topic: "Don't Follow the Vibe - Lead It with Gemini CLI",
      detail: "Lead the developer vibe with Gemini CLI for modern workflows.",
      track: "Workshop",
    },
        {
      name: "Deni Fuzi",
      image: "/images/deni.jpg",
      title: "UI/UX Designer at Aegislabs",
      topic: "UI Designer? No Worries! Coding as a Designer with Stitch",
      detail: "Empower designers to code easily with Stitch.",
      track: "Workshop",
    },
    {
      name: "Indah Widowati",
      image: "/images/indah.jpg",
      title: "Frontend Engineer at INA Digital Edu",
      topic: "Building Modern Frontends and Careers with Firebase Studio",
      detail: "Build scalable frontends and careers with Firebase Studio.",
      track: "Workshop",
    },
        {
      name: "Farhan Naufal Ghani",
      image: "/images/naufal.jpg",
      title: "DevSecOps Engineer at 99 Group",
      topic: "TBD",
      detail: "Stay tuned for DevSecOps insights from 99 Group.",
      track: "Workshop",
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-background" id="speakers">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-secondary via-primary to-[hsl(271,76%,53%)] bg-clip-text text-transparent">
            Our Speakers
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Enhance Your Skills: Join Techtalks & Workshops
          </p>
        </div>

        {/* Speaker Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
          {speakers.map((speaker, index) => (
            <div
              key={index}
              className={`rounded-3xl shadow-lg flex flex-col items-center justify-between p-4 md:p-6 transition-all duration-300 hover:scale-105 ${puzzleColors[index % puzzleColors.length]} max-w-xs mx-auto md:max-w-none`}
              style={{
                minHeight: 340,
                boxShadow: "0 2px 16px 0 rgba(0,0,0,0.08) inset",
                backgroundBlendMode: "overlay"
              }}
            >
              {/* Avatar */}
              <div className="flex flex-col items-center w-full relative">
                {/* Track Badge - moved to top right above photo */}
                <Badge
                  className={`absolute top-0 right-0 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                    speaker.track === "Techtalk"
                      ? "bg-primary/80 text-white"
                      : "bg-secondary/80 text-white"
                  }`}
                  style={{ transform: "translate(10%, -30%)" }}
                >
                  {speaker.track}
                </Badge>
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full mb-3 mt-4 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-secondary/30 to-[#FFD6A5]/30 blur-[2px]"></div>
                  <div className="absolute inset-0 rounded-full ring-4 ring-white/60"></div>
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover object-top rounded-full relative z-10"
                    onError={(e) =>
                      (e.currentTarget.src = "/images/Angga.jpg")
                    }
                  />
                </div>
                {/* Name */}
                <h3 className="text-lg md:text-xl font-bold text-foreground text-center mb-1">{speaker.name}</h3>
                {/* Title */}
                <p className="text-xs md:text-sm text-muted-foreground text-center font-medium mb-2">{speaker.title}</p>
              </div>

              {/* Topic */}
              <div className="w-full flex flex-col items-center mt-2 mb-2">
                {speaker.topic !== "TBD" ? (
                  <div className="mb-1 w-full flex justify-center">
                    <span
                      className="text-sm md:text-base font-extrabold text-center bg-gradient-to-r from-primary via-secondary to-neutral-800 bg-clip-text text-transparent"
                      style={{
                        letterSpacing: "0.5px",
                        WebkitTextStroke: "0.5px #222",
                        color: "#222" // fallback warna gelap
                      }}
                    >
                      {speaker.topic}
                    </span>
                  </div>
                ) : (
                  <div className="mb-1 w-full flex justify-center">
                    <span className="text-xs md:text-sm font-bold text-muted-foreground text-center">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>

              {/* Detail */}
              <p className="text-xs md:text-sm text-muted-foreground text-center mt-2 min-h-[40px]">
                {(() => {
                  switch (speaker.name) {
                    case "Natali Ardianto":
                      return "Learn how to automate expense tracking in minutes using n8n.";
                    case "Farah Clara":
                      return "Explore Python's impact in industry and community.";
                    case "Jason Stanley":
                      return "Understand the future of Web3 and cloud from a developer's perspective.";
                    case "Farhan Rafly":
                      return "Lead the developer vibe with Gemini CLI for modern workflows.";
                    case "Deni Fuzi":
                      return "Empower designers to code easily with Stitch.";
                    case "Indah Widowati":
                      return "Build scalable frontends and careers with Firebase Studio.";
                    case "Farhan Naufal Ghani":
                      return "Stay tuned for DevSecOps insights from 99 Group.";
                    default:
                      return speaker.detail;
                  }
                })()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Speakers;
