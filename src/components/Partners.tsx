import { Card, CardContent } from "@/components/ui/card";
import { Handshake } from "lucide-react";

const Partners = () => {
  const collaborators = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png" },
    { name: "Todak", logo: "https://cdn-main.todak.com/todak-com/brand/logo-black/Todak-Logo-Black.png" },
    { name: "Dicoding", logo: "https://dicoding-assets.sgp1.cdn.digitaloceanspaces.com/blog/wp-content/uploads/2014/12/dicoding-header-logo.png" },
    { name: "Goers", logo: "https://rec-data.kalibrr.com/www.kalibrr.com/logos/Z3PDNCTU3DKKJPV4CWZG5BPKKFZALDU3R6PX7KTB-5d01cf3a.png" },
    { name: "Gits.id", logo: "https://i0.wp.com/gits.id/wp-content/uploads/2020/11/logo-gits-id-1.png?resize=800%2C363&ssl=1" },
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
        {/* Become a Partner CTA */}
        <div className="text-center mb-20">
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

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            Our Collaboration History
          </h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 items-center max-w-6xl mx-auto">
          {collaborators.map((collaborator, index) => (
            <div key={index} className="flex justify-center items-center h-12 md:h-16 p-2">
              <img
                src={collaborator.logo}
                alt={collaborator.name}
                className="max-h-full max-w-full object-contain hover:scale-110 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
