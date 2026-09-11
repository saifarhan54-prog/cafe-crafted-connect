import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, QrCode, Star } from "lucide-react";

import hero from "@/assets/hero.jpg";
import imgBurrata from "@/assets/dish-burrata.jpg";
import { inr, useElanStore, useMounted } from "@/lib/elan-store";

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
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img
          src={hero}
          alt="Candlelit interior of ÉLAN Restaurant & Bar with leather banquettes and a marble bar"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20">
          <p className="mb-4 font-display text-sm tracking-[0.5em] text-primary uppercase">
            Est. 2019 · Restaurant & Bar
          </p>
          <h1 className="font-display text-6xl font-semibold tracking-tight text-glow sm:text-8xl">
            ÉLAN
          </h1>
          <p className="mt-4 max-w-xl font-display text-2xl text-foreground/90 italic sm:text-3xl">
            Dining, crafted with intention.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Coal-fired plates, slow-built cocktails and a room that glows after dark. Scan the code
            at your table and your order flows straight to our kitchen and bar.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Explore the Menu <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/menu"
              search={{ table: 1 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-accent"
            >
              <QrCode className="size-4 text-primary" /> Order to Your Table
            </Link>
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5 text-xs tracking-widest text-muted-foreground uppercase">
          <span className="flex items-center gap-2">
            <Clock className="size-4 text-primary" /> Tue – Sun · 12:00 – 00:30
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" /> 14 Camac Street, Kolkata
          </span>
          <span className="flex items-center gap-2">
            <Star className="size-4 text-primary" /> 4.8 · Loved by the neighbourhood
          </span>
        </div>
      </section>

      {/* Signature selection */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">From the kitchen & bar</p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">The signature pour & plate</h2>
          </div>
          <Link
            to="/menu"
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            Full menu <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(mounted ? featured : []).map((item) => (
            <Link
              key={item.id}
              to="/menu"
              className="group overflow-hidden rounded-2xl border border-border card-sheen transition-transform hover:-translate-y-1"
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
                  <h3 className="font-display text-lg leading-snug font-medium">{item.name}</h3>
                  <span className="shrink-0 text-sm font-bold text-primary">{inr(item.price)}</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border">
            <img
              src={imgBurrata}
              alt="Burrata with charred tomatoes by candlelight at ÉLAN"
              loading="lazy"
              width={1024}
              height={768}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">Our story</p>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              A room built around fire, brass & patience
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              ÉLAN began as a twelve-seat bar with a single charcoal grill. Today the kitchen still
              cooks over coals, the bar still builds every cocktail to order, and every table carries
              a small brass QR — scan it, order, and watch your plate move from flame to pass in
              real time.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              No apps to install. No waving for the bill. Just dinner, the way it should feel.
            </p>
            <Link
              to="/menu"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Begin an order <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">Word of mouth</p>
        <h2 className="mb-10 font-display text-3xl font-semibold sm:text-4xl">What guests say</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {(mounted ? reviews.slice(0, 3) : []).map((r) => (
            <figure key={r.id} className="rounded-2xl border border-border card-sheen p-6">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i < r.rating ? "fill-primary text-primary" : "text-muted"}`}
                  />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-foreground/90">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {r.name} · Verified guest
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-12 text-center">
          <span className="font-display text-2xl font-semibold tracking-wide">ÉLAN</span>
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
            Restaurant & Bar · Dining, crafted with intention
          </p>
          <p className="text-xs text-muted-foreground">
            14 Camac Street, Kolkata · Tue – Sun · 12:00 – 00:30 · +91 33 4000 2019
          </p>
        </div>
      </footer>
    </div>
  );
}
