import { Instagram, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const WhatsAppIcon = () => (
    <svg role="img" className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>WhatsApp</title>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.77.46 3.44 1.28 4.92L2 22l5.25-1.38c1.44.75 3.06 1.18 4.79 1.18h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM9.54 8.5c-.25-.01-.5-.02-.75.33-.27.37-.9 1.1-1.1 1.32-.2.22-.4.24-.6.24-.2 0-.4-.06-.58-.12-.24-.08-1.02-.45-1.93-1.4-1.23-1.28-1.9-2.8-2.03-3.04-.13-.24-.03-.4.1-.53.1-.1.22-.24.3-.32.08-.07.15-.14.22-.22.1-.1.15-.2.2-.3.07-.12.04-.24-.02-.34-.06-.1-.58-1.6-1.18-2.6-.58-1-.97-1.1-1.32-1.1-.33 0-.7.08-1.02.42s-1.1 1.28-1.1 2.7c0 1.43 1.13 3.12 1.28 3.32.15.2 2.25 3.82 5.48 5.37 3.23 1.55 3.8.97 4.47.9.67-.07 1.95-.97 2.22-1.87.27-.9.27-1.66.18-1.87-.1-.22-.34-.34-.7-.42z"/>
    </svg>
)

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary">
      <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium font-headline">
            DevFest Bandung 2024
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="mailto:gdg@cloudbandung.id" target="_blank">
                    <Mail className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="https://instagram.com/gdgcloudbandung" target="_blank">
                    <Instagram className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="https://bit.ly/wa-cloudbdg" target="_blank">
                    <WhatsAppIcon />
                </Link>
            </Button>
        </div>
        <div className="flex items-center gap-2">
           <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Bandung Dev Community. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
