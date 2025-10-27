import { Card, CardContent } from "@/components/ui/card";
import { Handshake } from "lucide-react";

const Partners = () => {
  const collaborators = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png" },
    { name: "Todak", logo: "https://cdn-main.todak.com/todak-com/brand/logo-black/Todak-Logo-Black.png" },
    { name: "Dicoding", logo: "https://dicoding-assets.sgp1.cdn.digitaloceanspaces.com/blog/wp-content/uploads/2014/12/dicoding-header-logo.png" },
    { name: "Goers", logo: "https://rec-data.kalibrr.com/www.kalibrr.com/logos/Z3PDNCTU3DKKJPV4CWZG5BPKKFZALDU3R6PX7KTB-5d01cf3a.png" },
    { name: "Gits.id", logo: "data:image/png;base64,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" },
    { name: "Startup Bandung", logo: "https://smkcoding.id/assets/images/startupbandung.png" },
    { name: "FlutterFlow", logo: "https://cdn.prod.website-files.com/64c7a317aea92912392c0420/6797bc3da6569c846c184b4d_logo_primary_color_onLight%402x.png" },
    { name: "Qwords", logo: "https://qwords.co.id/wp-content/uploads/2025/03/logo.webp" },
    { name: "SMKDEV", logo: "https://smkdev.storage.googleapis.com/wp/SMKDEV-Logo-Long-150x38.png" },
    { name: "BenQ", logo: "https://download.logo.wine/logo/BenQ/BenQ-Logo.wine.png" },
    { name: "Cloudraya", logo: "https://cp.cloudraya.com/images/theme/cloudraya/logo_text.png" },
    { name: "Mangkatsu", logo: "https://so.sagalagroup.id/_nuxt/mk.Hc-dTVyz.png" },
    { name: "Cleo", logo: "https://images.seeklogo.com/logo-png/50/1/cleo-logo-png_seeklogo-500137.png" },
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
