import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, Star } from "lucide-react";

import imgBurrata from "@/assets/dish-burrata.jpg";
import { inr, useElanStore, useMounted } from "@/lib/elan-store";
import { CinematicNav } from "@/components/elan/cinematic-nav";
import { HeroSection } from "@/components/elan/hero-section";
import { CocktailShowcase } from "@/components/elan/cocktail-showcase";
import { Gallery } from "@/components/elan/gallery";
import { Reveal } from "@/components/elan/reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ÉLAN — Restaurant & Bar | Dining, Crafted with Intention" },
      {
        name: "description",
        content:
          "Candlelit small plates, coal-fired mains and signature cocktails. Browse the menu, order to your table with a QR scan, and track your order live at ÉLAN.",
      },
      { property: "og:title", content: "ÉLAN — Restaurant & Bar" },
      {
        property: "og:description",
        content:
          "Candlelit small plates, coal-fired mains and signature cocktails. Dining, crafted with intention.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { menu, reviews } = useElanStore();
  const mounted = useMounted();
  const featured = menu.filter((m) => m.featured).slice(0, 4);

  return (
    <div className="min-h-screen">
      <CinematicNav />
      <HeroSection />

      {/* Info strip */}
      <section className="border-y border-border bg-card/40">
        <Reveal className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5 text-xs tracking-widest text-muted-foreground uppercase">
          <span className="flex items-center gap-2">
            <Clock className="size-4 text-primary" /> Tue – Sun · 12:00 – 00:30
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" /> 14 Camac Street, Kolkata
          </span>
          <span className="flex items-center gap-2">
            <Star className="size-4 text-primary" /> 4.8 · Loved by the
            neighbourhood
          </span>
        </Reveal>
      </section>

      {/* Restaurant section */}
      <section id="restaurant" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal variant="mask" className="overflow-hidden rounded-2xl border border-border">
            <img
              src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Elegant restaurant interior with candlelight"
              loading="lazy"
              width={940}
              height={650}
              className="h-full w-full object-cover"
            />
          </Reveal>
          <div>
            <Reveal>
              <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">
                The Restaurant
              </p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                Thoughtfully designed plates.
                <br />
                Unhurried evenings.
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Coal-fired plates, slow-built cocktails and a room that glows
                after dark. Every dish is cooked over coals, every cocktail
                built to order, and every table carries a small brass QR — scan
                it, order, and watch your plate move from flame to pass in real
                time.
              </p>
              <Link
                to="/menu"
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold tracking-[0.15em] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Explore Dining <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Bar section */}
      <section
        id="bar"
        className="relative border-y border-border bg-card/30 py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-10">
            <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">
              The Bar
            </p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Where the evening begins.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Signature cocktails, premium spirits, mocktails and bar
              atmosphere. Every drink is built to order — smoke, foam, fire and
              ice.
            </p>
          </Reveal>
          <Reveal>
            <CocktailShowcase />
          </Reveal>
        </div>
      </section>

      {/* Signature selection */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">
              From the kitchen & bar
            </p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              The signature pour & plate
            </h2>
          </div>
          <Link
            to="/menu"
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            Full menu <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(mounted ? featured : []).map((item, i) => (
            <Reveal key={item.id} delay={i * 100}>
              <Link
                to="/menu"
                className="group block overflow-hidden rounded-2xl border border-border card-sheen transition-transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg leading-snug font-medium">
                      {item.name}
                    </h3>
                    <span className="shrink-0 text-sm font-bold text-primary">
                      {inr(item.price)}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Story / About */}
      <section id="about" className="border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
          <Reveal variant="mask" className="overflow-hidden rounded-2xl border border-border">
            <img
              src={imgBurrata}
              alt="Burrata with charred tomatoes by candlelight at ÉLAN"
              loading="lazy"
              width={1024}
              height={768}
              className="h-full w-full object-cover"
            />
          </Reveal>
          <Reveal>
            <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">
              Our story
            </p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              A room built around fire, brass & patience
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              ÉLAN began as a twelve-seat bar with a single charcoal grill. Today
              the kitchen still cooks over coals, the bar still builds every
              cocktail to order, and every table carries a small brass QR — scan
              it, order, and watch your plate move from flame to pass in real
              time.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              No apps to install. No waving for the bill. Just dinner, the way
              it should feel.
            </p>
            <Link
              to="/menu"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Begin an order <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="mb-10">
          <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">
            The Gallery
          </p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            An evening in frames
          </h2>
        </Reveal>
        <Reveal>
          <Gallery />
        </Reveal>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="mb-10">
          <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">
            Word of mouth
          </p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            What guests say
          </h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {(mounted ? reviews.slice(0, 3) : []).map((r, i) => (
            <Reveal key={r.id} delay={i * 100}>
              <figure className="rounded-2xl border border-border card-sheen p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`size-4 ${j < r.rating ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/90">
                  "{r.text}"
                </blockquote>
                <figcaption className="mt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {r.name} · Verified guest
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-12 text-center">
          <span className="font-display text-2xl font-semibold tracking-wide">
            ÉLAN
          </span>
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
            Restaurant & Bar · Dining, crafted with intention
          </p>
          <p className="text-xs text-muted-foreground">
            14 Camac Street, Kolkata · Tue – Sun · 12:00 – 00:30 · +91 33 4000
            2019
          </p>
        </div>
      </footer>
    </div>
  );
}
