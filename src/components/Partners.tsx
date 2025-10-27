import { Card, CardContent } from "@/components/ui/card";
import { Handshake } from "lucide-react";

const Partners = () => {
  const collaborators = [
    { name: "Google", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/b44917f2-1b1e-450f-a311-6677c7247a32.png" },
    { name: "Todak", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/593685e8-5b4d-44a6-bb8a-e99446979601.png" },
    { name: "Dicoding", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/0e1e4a64-073c-48b5-9005-4c0e64b73b54.png" },
    { name: "Goers", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/7f6a73c1-b753-4886-8802-8a1dd8d10b0d.png" },
    { name: "Gits.id", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/a6c5b058-f9b8-4c94-916c-83b63004b7f8.png" },
    { name: "Startup Bandung", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/c7e2897c-9c7f-44a2-bd88-062e0bb94474.png" },
    { name: "FlutterFlow", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/e7d7a5b6-71d5-4e78-831d-2309f98f8045.png" },
    { name: "Qwords", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/a195b0c3-f041-477d-949e-13c51817812e.png" },
    { name: "SMKDEV", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/2a73a3c2-07a8-4e11-8260-449e7592f6d5.png" },
    { name: "BenQ", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/1f94a4c6-2c5e-49b5-961d-8547372f5d75.png" },
    { name: "Cloudraya", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/17983637-2598-4c74-a690-344c9b35b1d9.png" },
    { name: "Mangkatsu", logo: "https://storage.googleapisgpt-engineer-file-uploads/lovable-images/08f36c64-d2e3-4f9e-bc4b-e85d8e9e1c0d.png" },
    { name: "Cleo", logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/lovable-images/34190b9f-0c4a-4b0d-b2a5-489370138945.png" },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30" id="partners">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            Our Collaborators
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center max-w-6xl mx-auto">
          {collaborators.map((collaborator, index) => (
            <div key={index} className="flex justify-center items-center">
              <img
                src={collaborator.logo}
                alt={collaborator.name}
                className="max-h-16 object-contain"
              />
            </div>
          ))}
        </div>

        {/* Become a Partner CTA */}
        <div className="mt-20 text-center">
          <Card className="max-w-3xl mx-auto gradient-card border-primary/30">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                Interested in Partnership?
              </h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Join us in supporting the developer community and showcase your organization to 500+ attendees
              </p>
              <a
                href="mailto:gdg@cloudbandung.id?subject=DevFest 2025 Partnership Inquiry"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                <Handshake className="w-5 h-5" />
                Become a Partner
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Partners;
