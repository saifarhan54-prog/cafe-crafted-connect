import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import imgBurrata from "@/assets/dish-burrata.jpg";
import imgLamb from "@/assets/dish-lamb.jpg";
import imgOldFashioned from "@/assets/drink-oldfashioned.jpg";
import imgEspressoMartini from "@/assets/drink-espresso-martini.jpg";
import imgCheesecake from "@/assets/dessert-cheesecake.jpg";

interface GalleryImage {
  src: string;
  alt: string;
  span?: "col" | "row" | "both";
}

const GALLERY: GalleryImage[] = [
  { src: hero, alt: "Candlelit interior of ÉLAN", span: "both" },
  {
    src: "https://images.pexels.com/photos/16806670/pexels-photo-16806670.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Crystal glasses on a dark surface",
  },
  { src: imgBurrata, alt: "Burrata with charred tomatoes" },
  {
    src: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Elegant restaurant interior with candlelight",
  },
  { src: imgOldFashioned, alt: "Smoked old fashioned cocktail" },
  {
    src: "https://images.pexels.com/photos/18007622/pexels-photo-18007622.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Bar counter with citrus and herbs",
  },
  { src: imgLamb, alt: "Coal-fired lamb chops" },
  {
    src: "https://images.pexels.com/photos/16806517/pexels-photo-16806517.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Smoking cocktail on bar counter",
  },
  { src: imgEspressoMartini, alt: "Espresso martini" },
  {
    src: "https://images.pexels.com/photos/24433378/pexels-photo-24433378.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Romantic dinner table setting",
  },
  { src: imgCheesecake, alt: "Basque burnt cheesecake" },
  {
    src: "https://images.pexels.com/photos/13722817/pexels-photo-13722817.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Liquor bottles in dimly lit bar",
  },
];

export function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(() => {
    setLightbox((prev) =>
      prev === null ? prev : (prev + 1) % GALLERY.length,
    );
  }, []);
  const prev = useCallback(() => {
    setLightbox((prev) =>
      prev === null ? prev : (prev - 1 + GALLERY.length) % GALLERY.length,
    );
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, next, prev]);

  return (
    <>
      {/* Desktop: asymmetrical grid */}
      <div
        className="hidden gap-3 sm:grid"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "200px",
          gridAutoFlow: "dense",
        }}
      >
        {GALLERY.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className={`group relative overflow-hidden rounded-lg border border-border ${
              img.span === "both"
                ? "col-span-2 row-span-2"
                : img.span === "col"
                  ? "col-span-2"
                  : img.span === "row"
                    ? "row-span-2"
                    : ""
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-background/0 transition-colors group-hover:bg-background/20" />
          </button>
        ))}
      </div>

      {/* Mobile: horizontal swipe */}
      <div className="elan-no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto sm:hidden">
        {GALLERY.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="group relative w-[80vw] shrink-0 snap-center overflow-hidden rounded-lg border border-border"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md">
          <button
            className="absolute top-6 right-6 rounded-full p-2 text-foreground hover:bg-accent"
            onClick={close}
            aria-label="Close"
          >
            <X className="size-6" />
          </button>
          <button
            className="absolute left-4 rounded-full p-2 text-foreground hover:bg-accent"
            onClick={prev}
            aria-label="Previous"
          >
            <ChevronLeft className="size-8" />
          </button>
          <img
            key={lightbox}
            src={GALLERY[lightbox]?.src}
            alt={GALLERY[lightbox]?.alt ?? ""}
            className="elan-lightbox-img max-h-[85vh] max-w-[90vw] object-contain"
          />
          <button
            className="absolute right-4 rounded-full p-2 text-foreground hover:bg-accent"
            onClick={next}
            aria-label="Next"
          >
            <ChevronRight className="size-8" />
          </button>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-widest text-muted-foreground uppercase">
            {lightbox + 1} / {GALLERY.length}
          </span>
        </div>
      )}
    </>
  );
}
