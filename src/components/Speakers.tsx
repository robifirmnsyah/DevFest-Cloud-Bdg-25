import { Card, CardContent } from "@/components/ui/card";

const Speakers = () => {
  const speakers = [
    { name: "Angga Agia", image: "/images/Angga.jpg", topic: "IT Manager Langham Hospitality Group & Google Cloud Dev Expert", track: "Workshop" },
    { name: "M Ghifary", image: "/images/Ghifary.jpg", topic: "CTO GovTech Edu & Google AI Dev Expert", track: "Workshop" },
    { name: "Luqman Aljundi", image: "/images/Luqman.jpg", topic: "Business Lead GITS Cloud", track: "Techtalk" },
    { name: "Azhar Fuad", image: "/images/Azhar.jpg", topic: "CEO Curaweda", track: "Techtalk" },
    { name: "Meyta Jennis", image: "/images/Meyta.jpg", topic: "Act Principal Coordinator ITSEC Asia", track: "Workshop" },
    { name: "Natali Ardianto", image: "/images/Natali.jpg", topic: "Founder Tiket.com & CEO Lifepack", track: "Workshop" },
    { name: "Farah Clara", image: "/images/Farah.jpg", topic: "Community Organizer PythonID", track: "Techtalk" },
    { name: "Rendra Toro", image: "/images/Rendra.jpg", topic: "CEO Lintas Media Danawa", track: "Workshop" },
    { name: "Cendekia Luthfieta", image: "/images/Cendekia.png", topic: "Contact System Center Officer PLN", track: "Techtalk" },
    { name: "Ibnu Wardy", image: "/images/Ibnu.jpg", topic: "CTO Carte WMS & Google AI & Cloud Dev Expert", track: "Techtalk" },
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
                {/* Use explicit image file per speaker */}
                <div className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-2">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      // fallback ke Angga.jpg jika file tidak ditemukan di folder /public/images
                      (e.currentTarget.src = "/images/Angga.jpg")
                    }
                  />
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
