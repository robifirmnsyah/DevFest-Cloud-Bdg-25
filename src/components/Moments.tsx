import { Card, CardContent } from "@/components/ui/card";

const Moments = () => {
  return (
    <section className="py-20 md:py-32 bg-background" id="moments">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-[hsl(271,76%,53%)] to-secondary bg-clip-text text-transparent">
            Moments From Our Last Event
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            A glimpse into the energy and community at DevFest.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* YouTube Video */}
          <Card className="gradient-card border-primary/20 hover:shadow-[var(--shadow-card)] transition-all duration-300">
            <CardContent className="p-4">
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-md"
                  src="https://www.youtube.com/embed/EWcgnS2DrO4"
                  title="DevFest Cloud Bandung 2024 Highlights"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
};

export default Moments;
