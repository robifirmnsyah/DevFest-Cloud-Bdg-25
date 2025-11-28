import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isRegisterPage = location.pathname === "/register";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: isHomePage ? "#about" : "/#about" },
    { label: "Tickets", href: isHomePage ? "#presale" : "/#presale" },
    { label: "Speakers", href: isHomePage ? "#speakers" : "/#speakers" },
    { label: "Job Fair", href: isHomePage ? "#jobfair" : "/#jobfair" },
    { label: "Partners", href: isHomePage ? "#partners" : "/#partners" },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);

    // Jika link ke section di homepage dan kita sedang di halaman lain
    if (href.startsWith("/#") && !isHomePage) {
      window.location.href = href;
    }
  };

  // Determine background style based on page and scroll state
  const getNavBackground = () => {
    if (isRegisterPage) {
      return "bg-white/95 backdrop-blur-xl shadow-xl border-b border-[#4285F4]/20";
    }
    
    return isScrolled
      ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-[#4285F4]/20"
      : "bg-gradient-to-b from-[#4285F4]/10 to-transparent backdrop-blur-sm";
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavBackground()}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group relative z-50">
              <div className="flex items-center gap-2">
                <img src="/gdg_logo.jpg" alt="GDG Cloud Bandung" className="h-8 w-auto" />
                <span className={`text-xl md:text-2xl font-bold transition-all text-[#4285F4]`}>
                  Cloud DevFest 2025
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                item.href === "/" ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`font-semibold transition-all hover:scale-105 ${
                      isRegisterPage || isScrolled
                        ? "text-[#4285F4] hover:text-[#1a73e8]"
                        : "text-[#4285F4] hover:text-[#1a73e8] drop-shadow-lg"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`font-semibold transition-all hover:scale-105 ${
                      isRegisterPage || isScrolled
                        ? "text-[#4285F4] hover:text-[#1a73e8]"
                        : "text-[#4285F4] hover:text-[#1a73e8] drop-shadow-lg"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              ))}
              <a
                href="https://www.goersapp.com/events/indonesia-premier-cloud-and-ai-festival-dev-fest-cloud-bandung-2025--devfestcloudbdg25"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className={`bg-[#4285F4] text-white hover:bg-[#1a73e8] shadow-xl hover:shadow-2xl font-black rounded-full px-8 py-3 text-base transition-all hover:scale-105`}
                >
                  Register
                </Button>
              </a>
              {/* Login Button */}
              <Link to="/auth">
                <Button
                  variant="outline"
                  className="border-[#4285F4] text-[#4285F4] hover:bg-[#4285F4]/10 font-bold rounded-full px-8 py-3 text-base transition-all hover:scale-105"
                >
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-all relative z-50 ${
                isRegisterPage || isScrolled ? "hover:bg-muted" : "hover:bg-white/10"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className={`w-6 h-6 ${isRegisterPage || isScrolled ? "text-foreground" : "text-white drop-shadow-lg"}`} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel - Slide from Top */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 bg-background z-40 md:hidden transform transition-transform duration-500 ease-in-out shadow-2xl ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 pb-8 px-6">
          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              item.href === "/" ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block py-4 px-4 font-semibold text-lg text-foreground hover:text-primary hover:bg-muted rounded-xl transition-all transform hover:translate-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-4 px-4 font-semibold text-lg text-foreground hover:text-primary hover:bg-muted rounded-xl transition-all transform hover:translate-x-2"
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </a>
              )
            ))}
          </nav>

          {/* Register & Login Buttons */}
          <div className="pt-6 border-t border-border">
            <a
              href="https://www.goersapp.com/events/indonesia-premier-cloud-and-ai-festival-dev-fest-cloud-bandung-2025--devfestcloudbdg25"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button className="w-full bg-[#4285F4] text-white hover:bg-[#1a73e8] font-black text-lg py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                Register Now
              </Button>
            </a>
            {/* Login Button */}
            <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full mt-4 border-[#4285F4] text-[#4285F4] hover:bg-[#4285F4]/10 font-bold text-lg py-6 rounded-full shadow hover:scale-105 transition-all" variant="outline">
                Login
              </Button>
            </Link>
            {/* Social Links or Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                GDG Cloud Bandung
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                December 6, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
