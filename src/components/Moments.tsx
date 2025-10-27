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

        <Card className="max-w-5xl mx-auto gradient-card border-primary/20 hover:shadow-[var(--shadow-card)] transition-all duration-300">
          <CardContent className="p-4">
            <img
              src="https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/91560946-b633-4f9e-8c38-0ce8d1f27464.png"
              alt="Group photo from a previous DevFest event"
              className="rounded-md w-full"
              data-ai-hint="event crowd"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Moments;
