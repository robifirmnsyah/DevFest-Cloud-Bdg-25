import { Mail, MapPin, ExternalLink, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Cloud DevFest 2025</h3>
            <p className="text-background/80 leading-relaxed">
              Organized by GDG Cloud Bandung, bringing together the best of cloud computing and AI innovation.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-background/80">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Bandung, Indonesia</span>
              </div>
              <a href="mailto:gdg@cloudbandung.id" className="flex items-center gap-2 text-background/80 hover:text-background transition-colors">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>gdg@cloudbandung.id</span>
              </a>
              <a href="https://instagram.com/gdgcloudbandung" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-background/80 hover:text-background transition-colors">
                <Instagram className="w-5 h-5 flex-shrink-0" />
                <span>@gdgcloudbandung</span>
              </a>
              <a href="https://bit.ly/wa-cloudbdg" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-background/80 hover:text-background transition-colors">
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <span>WhatsApp Channel</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold">Quick Links</h4>
            <div className="space-y-2">
              <a href="#about" className="flex items-center gap-2 text-background/80 hover:text-background transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>About DevFest</span>
              </a>
              <a href="#schedule" className="flex items-center gap-2 text-background/80 hover:text-background transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>Schedule</span>
              </a>
              <a href="#speakers" className="flex items-center gap-2 text-background/80 hover:text-background transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>Speakers</span>
              </a>
              <a href="#presale" className="flex items-center gap-2 text-background/80 hover:text-background transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>Tickets</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center">
          <p className="text-background/60">
            © 2025 GDG Cloud Bandung. Part of Google Developer Groups.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
