import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Tickets", href: "#presale" },
    { label: "Speakers", href: "#speakers" },
    { label: "Partners", href: "#partners" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2">
            <div className="text-xl md:text-2xl font-bold">
              <span className={`${isScrolled ? "text-primary" : "text-white"}`}>
                DevFest
              </span>
              <span className={`${isScrolled ? "text-secondary" : "text-white/90"}`}>
                {" "}2025
              </span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a href="https://www.goersapp.com/events/indonesia-premier-cloud-and-ai-festival-dev-fest-cloud-bandung-2025--devfestcloudbdg25" target="_blank" rel="noopener noreferrer">
              <Button
                className={`${
                  isScrolled
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-white text-primary hover:bg-white/90"
                } font-semibold rounded-full`}
              >
                Register
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/20">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-2 font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a href="https://www.goersapp.com/events/indonesia-premier-cloud-and-ai-festival-dev-fest-cloud-bandung-2025--devfestcloudbdg25" target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full">
                Register
              </Button>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
