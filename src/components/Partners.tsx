import { Card, CardContent } from "@/components/ui/card";
import { Building2, Handshake } from "lucide-react";

const Partners = () => {
  const partnerTiers = [
    {
      tier: "Platinum Partners",
      description: "Our premier partners supporting DevFest 2025",
      partners: [
        { name: "Google Cloud", category: "Cloud Provider" },
        { name: "Google Developer Groups", category: "Community" },
      ],
    },
    {
      tier: "Gold Partners",
      description: "Valued partners helping us build the future",
      partners: [
        { name: "Partner Company 1", category: "Technology" },
        { name: "Partner Company 2", category: "Innovation" },
        { name: "Partner Company 3", category: "Enterprise" },
      ],
    },
    {
      tier: "Community Partners",
      description: "Supporting the developer ecosystem",
      partners: [
        { name: "Tech Community 1", category: "Developer Community" },
        { name: "Tech Community 2", category: "Open Source" },
        { name: "Tech Community 3", category: "Education" },
        { name: "Tech Community 4", category: "Startup" },
      ],
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30" id="partners">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Handshake className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-[hsl(271,76%,53%)] bg-clip-text text-transparent">
            Our Partners
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We're proud to partner with leading organizations who share our vision of empowering developers
          </p>
        </div>

        <div className="space-y-16 max-w-6xl mx-auto">
          {partnerTiers.map((tier, tierIndex) => (
            <div key={tierIndex} className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
                  {tier.tier}
                </h3>
                <p className="text-muted-foreground">{tier.description}</p>
              </div>

              <div className={`grid gap-6 ${
                tier.partners.length <= 2 
                  ? 'md:grid-cols-2' 
                  : tier.partners.length === 3 
                  ? 'md:grid-cols-3' 
                  : 'md:grid-cols-2 lg:grid-cols-4'
              }`}>
                {tier.partners.map((partner, index) => (
                  <Card
                    key={index}
                    className="gradient-card hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-2 border-primary/20"
                  >
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-2">
                        <Building2 className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-foreground mb-2">
                          {partner.name}
                        </h4>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {partner.category}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
