import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Puzzle background colors
const puzzleColors = [
  "bg-gradient-to-br from-[#FFE066]/80 via-[#FFF6E0]/90 to-[#FFD6A5]/80",
  "bg-gradient-to-br from-[#A2D5F2]/80 via-[#EAF6FF]/90 to-[#B5EAD7]/80",
  "bg-gradient-to-br from-[#FFB3C6]/80 via-[#FFF0F6]/90 to-[#C3B1E1]/80",
  "bg-gradient-to-br from-[#B5EAD7]/80 via-[#E0FFF6]/90 to-[#A2D5F2]/80",
  "bg-gradient-to-br from-[#C3B1E1]/80 via-[#F6F0FF]/90 to-[#FFB3C6]/80",
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
  "bg-gradient-to-br from-[#FFE066]/80 via-[#FFF6E0]/90 to-[#FFD6A5]/80",
  "bg-gradient-to-br from-[#A2D5F2]/80 via-[#EAF6FF]/90 to-[#B5EAD7]/80",
  "bg-gradient-to-br from-[#FFB3C6]/80 via-[#FFF0F6]/90 to-[#C3B1E1]/80"
];

const Speakers = () => {
  const speakers = [
    {
      name: "Jason Stanley",
      image: "/images/jason.jpg",
      title: "Full Stack Web3 Engineer @ Xellar",
      topic: "Web3 Explained: What Happens When Users Own The Internet. Do We Need Cloud?",
      detail:
        "Discussion on token ownership & smart contracts, trade-offs between cloud infrastructure vs decentralization, hybrid architecture examples, and security & privacy implications for user data.",
      track: "Techtalk",
    },
    {
      name: "Redha Hari Widiaprasetyo",
      image: "/images/redha.png",
      title: "IT Directorate Co-Lead at ParagonCorp",
      topic: "How ParagonCorp Scales Productivity with AI",
      detail:
        "Case study of AI adoption at ParagonCorp: toolchain used, end-to-end workflow automation, productivity metrics, and change-management strategies for large-scale implementation.",
      track: "Techtalk",
    },
    {
      name: "Fadly Mahendra",
      image: "/images/fadly.jpeg",
      title: "QA Manager at Durianpay",
      topic: "AI in Quality Engineering: Practical Strategies You Can Apply Tomorrow",
      detail:
        "Gemini Code Assist helps QA Engineers increase automated test coverage from 0 to 100% — even with Zero API Documentation.",
      track: "Techtalk",
    },
    {
      name: "Nurendratoro Singgih",
      image: "/images/rendra.jpeg",
      title: "SVP Industry Solution at Lintasarta",
      topic: "Mastering the AI Skills that Overseas Companies Actually Look For",
      detail:
        "Guide to AI skills sought by global markets: relevant portfolio projects, must-know ML/engineering techniques, key tools & libraries, and presentation tips for international interviews.",
      track: "Techtalk",
    },
    {
      name: "Qais Jabbar I",
      image: "/images/qais.png",
      topic: "How to deploy MCP Server at Cloud Run",
      title: "Senior Cloud Engineer at PT CloudMile Indonesia",
      detail:
        "Step-by-step guide to deploying Model Context Protocol servers on Cloud Run: containerization, configuration, scaling strategies, and best practices for production-ready deployments.",
      track: "Techtalk",
    },
    {
      name: "Luqman Aljundi",
      image: "/images/luqman.jpg",
      topic: "How to Apply Discount in GCP and Avoid Unexpected Billing Usage",
      title: "Business Lead GITS Cloud",
      detail:
        "Practical GCP cost management tips: choosing committed/sustained discounts, labeling & cost allocation strategies, budget & alert setup, and monitoring to prevent unexpected billing.",
      track: "Techtalk",
    },
    {
      name: "Azhar Fuad",
      image: "/images/azhar.jpg",
      topic: "The Responsible Lens: Crafting Video with Ethical AI",
      title: "Founder & CEO Curaweda",
      detail:
        "Principles of ethical AI video creation: data consent & licensing, dataset curation, watermarking & provenance, abuse mitigation, and governance policies for creators.",
      track: "Techtalk",
    },
    {
      name: "Angga Agia",
      image: "/images/angga.jpg",
      title: "IT Manager, The Langham Jakarta | Google Cloud Developer Expert",
      topic: "From (Power) Prompts to Company Insights: NotebookLM as Your Company Insights Engine",
      detail:
        "Guide to building insights pipeline: document ingestion, embedding & retrieval, effective prompt patterns, internal source connectors, and NotebookLM deployment for teams.",
      track: "Workshop",
    },
    {
      name: "Meyta Jennis",
      image: "/images/meyta.jpg",
      topic: "Create AI Multi Agent Using Visual Agent Builder in ADK",
      title: "Act Principal Coordinator ITSEC Asia",
      detail:
        "Visual multi-agent creation workshop: agent architecture design, inter-agent orchestration & communication, state management, debugging techniques, and production deployment steps.",
      track: "Workshop",
    },
    {
      name: "Cendekia Luthfieta",
      image: "/images/cendekia.jpg",
      topic: "AI/ML for Power Outage Detection",
      title: "Contact System Center Officer PLN",
      detail:
        "Outage detection approach: sensor data preprocessing, suitable anomaly-detection models, evaluation metrics, and edge vs cloud deployment strategies for real-time response.",
      track: "Techtalk",
    },
    {
      name: "Ibnu Wardy",
      image: "/images/ibnu.jpg",
      topic: "Spec Driven Development",
      title: "CTO Carte WMS & Google AI & Cloud Dev Expert",
      detail:
        "Spec-driven development principles: contract-first design, spec-as-tests, contract-testing techniques, and CI workflows that accelerate iteration while reducing regression.",
      track: "Techtalk",
    },
    {
      name: "Natali Ardianto",
      image: "/images/natali.jpg",
      title: "Founder Tiket.com & CEO Lifepack",
      topic: "Intro to n8n: Creating expense tracker in 30 minutes",
      detail:
        "Hands-on n8n workshop: expense tracker flow design, creating connectors & webhooks, data transformation, scheduling, and deploying end-to-end automation in 30 minutes.",
      track: "Workshop",
    },
    {
      name: "Farah Clara",
      image: "/images/farah.jpg",
      title: "Community Organizer PythonID",
      topic: "Python Landscape in Industry and Community",
      detail:
        "Overview of Python usage in industry & community: library ecosystem (data, web, ML), best practices, real-world case examples, and learning paths for Python-based careers.",
      track: "Techtalk",
    },
    {
      name: "M Ghifary",
      image: "/images/ghifari.jpg",
      topic: "Personal Doctor AI Assistant",
      title: "CTO GovTech Edu & Google AI Dev Expert",
      detail:
        "Private medical assistant design: intent modeling, patient data privacy & security, model & inference choices, and guardrails for safety and regulatory compliance.",
      track: "Workshop",
    },
    {
      name: "Farhan Rafly",
      image: "/images/farhan.jpg",
      title: "Frontend Engineer at Ape AI",
      topic: "Don't Follow the Vibe - Lead It with Gemini CLI",
      detail:
        "Practical Gemini CLI demo: creating reproducible prompt workflows, local development loops, template & snippet usage, and tricks to boost frontend/AI developer productivity.",
      track: "Workshop",
    },
    {
      name: "Deni Fuzi",
      image: "/images/deni.jpg",
      title: "UI/UX Designer at Aegislabs",
      topic: "UI Designer? No Worries! Coding as a Designer with Stitch",
      detail:
        "Stitch workflow for designers: component-based prototyping, production-ready code export, design-to-dev synchronization, and rapid iteration techniques for product teams.",
      track: "Workshop",
    },
    {
      name: "Indah Widowati",
      image: "/images/indah.jpg",
      title: "Frontend Engineer at INA Digital Edu",
      topic: "Building Modern Frontends and Careers with Firebase Studio",
      detail:
        "Building modern frontends with Firebase Studio: authentication & authorization patterns, scalable Firestore structure, rules & security, plus CI/CD and production hosting.",
      track: "Workshop",
    },
    {
      name: "Farhan Naufal Ghani",
      image: "/images/naufal.jpg",
      title: "DevSecOps Engineer at 99 Group",
      topic: "Bringing AI to Observability: AI-Driven Insights in Grafana",
      detail:
        "Integrating AI into observability: anomaly detection on metrics/logs, automated root-cause analysis, alert noise reduction, and secure practices for ML-based observability pipelines.",
      track: "Workshop",
    },
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
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full mb-3 mt-4 relative flex items-center justify-center">
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
