import { Code2, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary">
      <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <p className="text-sm font-medium font-headline">
            Bandung DevFest 2025
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Bandung Dev Community. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
