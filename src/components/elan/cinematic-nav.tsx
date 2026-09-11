import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useScrollY } from "@/hooks/use-animations";

const SECTION_LINKS = [
  { label: "HOME", id: "home" },
  { label: "RESTAURANT", id: "restaurant" },
  { label: "BAR", id: "bar" },
  { label: "GALLERY", id: "gallery" },
  { label: "ABOUT", id: "about" },
] as const;

export function CinematicNav() {
  const scrollY = useScrollY();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = scrollY > 80;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "border-b border-border bg-background/85 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => scrollTo("home")}
            className="font-display text-xl font-semibold tracking-[0.15em] text-foreground"
          >
            ÉLAN
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {SECTION_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="elan-nav-link text-xs font-semibold tracking-[0.2em] text-foreground/80 uppercase transition-colors hover:text-primary"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/menu"
              className="elan-nav-link text-xs font-semibold tracking-[0.2em] text-foreground/80 uppercase transition-colors hover:text-primary"
            >
              MENU
            </Link>
            <a
              href="tel:+913340002019"
              className="rounded-full border border-primary/40 px-5 py-2 text-xs font-bold tracking-[0.15em] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              RESERVE
            </a>
          </nav>

          <button
            className="flex items-center justify-center rounded-full p-2 text-foreground md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="elan-entrance-fade absolute inset-0 bg-background"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full flex-col items-center justify-center gap-2">
            <button
              className="absolute top-6 right-6 rounded-full p-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-6" />
            </button>
            {SECTION_LINKS.map((link, i) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="elan-entrance font-display text-2xl font-medium tracking-[0.15em] text-foreground/90 uppercase transition-colors hover:text-primary"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/menu"
              onClick={() => setMobileOpen(false)}
              className="elan-entrance font-display text-2xl font-medium tracking-[0.15em] text-foreground/90 uppercase transition-colors hover:text-primary"
              style={{ animationDelay: `${0.1 + SECTION_LINKS.length * 0.08}s` }}
            >
              MENU
            </Link>
            <a
              href="tel:+913340002019"
              className="elan-entrance mt-6 rounded-full border border-primary/40 px-8 py-3 text-sm font-bold tracking-[0.15em] text-primary uppercase"
              style={{
                animationDelay: `${0.1 + (SECTION_LINKS.length + 1) * 0.08}s`,
              }}
            >
              RESERVE A TABLE
            </a>
          </div>
        </div>
      )}
    </>
  );
}
