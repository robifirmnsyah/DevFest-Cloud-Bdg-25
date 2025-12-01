import { Card, CardContent } from "@/components/ui/card";
import { Handshake } from "lucide-react";

const Partners = () => {
  const sponsors = [
    { 
      name: "Durianpay", 
      logo: "/images/sponsors/durianpay.png",
      tier: "main"
    },
    { 
      name: "Qwords", 
      logo: "/images/sponsors/qwords.png",
      tier: "secondary"
    },
    { 
      name: "Goers", 
      logo: "/images/sponsors/goers.png",
      tier: "secondary"
    },
    { 
      name: "Cleo", 
      logo: "/images/sponsors/cleo.png",
      tier: "secondary"
    },
    { 
      name: "Fiora", 
      logo: "/images/sponsors/iora.png",
      tier: "secondary"
    }
  ];

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
        {/* Sponsored By Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
            Sponsored By
          </h2>
          
          {/* Main Sponsor - Much Larger */}
          <div className="flex justify-center mb-12">
            <img
              src={sponsors[0].logo}
              alt={sponsors[0].name}
              className="h-32 md:h-40 lg:h-48 w-auto object-contain max-w-[90vw]"
              onError={(e) => {
                console.error('Failed to load main sponsor logo:', sponsors[0].name);
                e.currentTarget.src = '/gdg_logo.jpg';
              }}
            />
          </div>
          
          {/* Secondary Sponsors - Much Larger, Perfectly Aligned */}
          <div className="flex justify-center items-center gap-8 md:gap-12 lg:gap-16 flex-wrap max-w-6xl mx-auto">
            {sponsors.slice(1).map((sponsor, index) => (
              <div 
                key={index}
                className="flex items-center justify-center"
                style={{ 
                  width: '180px',
                  height: '100px'
                }}
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="max-w-full max-h-full object-contain hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    console.error('Failed to load sponsor logo:', sponsor.name);
                    // Try alternative extensions
                    const currentSrc = e.currentTarget.src;
                    if (currentSrc.includes('.png')) {
                      e.currentTarget.src = currentSrc.replace('.png', '.jpg');
                    } else if (currentSrc.includes('.jpg')) {
                      e.currentTarget.src = currentSrc.replace('.jpg', '.jpeg');
                    } else {
                      e.currentTarget.src = '/gdg_logo.jpg';
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

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
                href="https://docs.google.com/forms/d/e/1FAIpQLSfrIKq5A8o77uVww8Yj_DARd17kI_lPyZsPvYeHa-M4L8-DcA/viewform"
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

        {/* Infinite Scrolling Logos */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-infinite">
            {/* First set of logos */}
            {collaborators.map((collaborator, index) => (
              <div 
                key={`first-${index}`} 
                className="flex-shrink-0 flex justify-center items-center mx-8 md:mx-12"
                style={{ width: '150px', height: '80px' }}
              >
                <img
                  src={collaborator.logo}
                  alt={collaborator.name}
                  className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {collaborators.map((collaborator, index) => (
              <div 
                key={`second-${index}`} 
                className="flex-shrink-0 flex justify-center items-center mx-8 md:mx-12"
                style={{ width: '150px', height: '80px' }}
              >
                <img
                  src={collaborator.logo}
                  alt={collaborator.name}
                  className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
