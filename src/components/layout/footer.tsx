import { Code2, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

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
           <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Bandung Dev Community. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
