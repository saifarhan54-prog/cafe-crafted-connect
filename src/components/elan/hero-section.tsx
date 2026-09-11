import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Wine } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { useScrollY, useMediaQuery, useReducedMotion } from "@/hooks/use-animations";
import { BottomSheet } from "@/components/elan/reveal";

export function HeroSection() {
  const scrollY = useScrollY();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const isTouch = useMediaQuery("(hover: none)");
  const reducedMotion = useReducedMotion();
  const parallax = Math.min(scrollY * 0.15, 80);

  useEffect(() => {
    if (reducedMotion) {
      setShowIntro(false);
      return;
    }
    const timer = setTimeout(() => setShowIntro(false), 1800);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <>
      {showIntro && (
        <div className="elan-intro">
          <div className="elan-intro-logo">ÉLAN</div>
          <div className="elan-intro-line" />
        </div>
      )}
      <section
        id="home"
        className="relative flex h-[85vh] min-h-[600px] items-end overflow-hidden sm:h-[92vh]"
      >
        <div
          className="absolute -top-[10%] left-0 h-[120%] w-full"
          style={{ transform: `translateY(${parallax}px)` }}
        >
          <img
            src={hero}
            alt="Candlelit interior of ÉLAN Restaurant & Bar with leather banquettes and a marble bar"
            className="elan-ken-burns h-full w-full object-cover"
            width={1920}
            height={1080}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />

        <div
          className={`absolute inset-0 bg-background/30 transition-opacity duration-700 ${
            hovered || sheetOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <button
          className="absolute z-10 cursor-pointer"
          style={{ left: "30%", top: "32%", width: "40%", height: "38%" }}
          onMouseEnter={() => {
            if (!isTouch) setHovered(true);
          }}
          onMouseLeave={() => {
            if (!isTouch) setHovered(false);
          }}
          onClick={() => setSheetOpen(true)}
          aria-label="Explore the bar"
        >
          <div
            className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
              hovered
                ? "bg-primary/5 opacity-100 ring-1 ring-primary/20"
                : "bg-primary/0 opacity-0"
            }`}
          />
          {isTouch && !sheetOpen && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <div className="elan-hotspot-pulse mx-auto mb-2 h-2 w-2 rounded-full bg-primary" />
              <p className="font-display text-xs tracking-[0.4em] text-primary/80 uppercase">
                The Bar
              </p>
            </div>
          )}
          {!isTouch && hovered && (
            <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="font-display text-sm tracking-[0.4em] text-primary uppercase">
                THE BAR
              </p>
              <p className="mt-1.5 text-xs tracking-wide text-muted-foreground">
                Signature cocktails · Fine spirits · Late evenings
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                Explore the Bar <ArrowRight className="size-3" />
              </span>
            </div>
          )}
        </button>

        <div className="relative z-20 mx-auto w-full max-w-6xl px-6 pb-20">
          <p className="elan-entrance elan-delay-1 mb-4 font-display text-sm tracking-[0.5em] text-primary uppercase">
            Est. 2019 · Restaurant & Bar
          </p>
          <h1 className="elan-entrance elan-delay-2 font-display text-6xl font-semibold tracking-tight text-glow sm:text-8xl">
            ÉLAN
          </h1>
          <p className="elan-entrance elan-delay-3 mt-3 font-display text-xl text-foreground/90 sm:text-2xl">
            Restaurant &amp; Bar
          </p>
          <p className="elan-entrance elan-delay-4 mt-3 max-w-xl font-display text-lg text-foreground/80 italic sm:text-xl">
            An evening worth remembering.
          </p>
          <div className="elan-entrance elan-delay-5 mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold tracking-[0.15em] text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
            >
              Explore <ArrowRight className="size-4" />
            </Link>
            <a
              href="tel:+913340002019"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 text-sm font-semibold tracking-[0.15em] backdrop-blur transition-colors hover:bg-accent uppercase"
            >
              Reserve a Table
            </a>
          </div>
        </div>

        <div className="elan-entrance elan-delay-7 absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:flex">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              Scroll
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-primary/50 to-transparent" />
          </div>
        </div>
      </section>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div className="px-6 pb-8 pt-4">
          <div className="mb-4 flex items-center gap-3">
            <Wine className="size-6 text-primary" />
            <h2 className="font-display text-2xl font-semibold tracking-wide">
              THE BAR
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Signature cocktails, fine spirits and late evenings.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/menu"
              className="flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-bold tracking-[0.15em] text-primary-foreground uppercase transition-transform hover:scale-[1.02]"
            >
              View Bar <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/menu"
              className="flex items-center justify-center gap-2 rounded-full border border-border bg-card/60 py-4 text-sm font-semibold tracking-[0.15em] backdrop-blur transition-colors hover:bg-accent uppercase"
            >
              View Menu
            </Link>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
