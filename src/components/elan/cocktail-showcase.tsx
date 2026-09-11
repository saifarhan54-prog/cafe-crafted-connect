import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import {
  addToCart,
  inr,
  useElanStore,
  useMounted,
  type MenuItem,
} from "@/lib/elan-store";
import { BottomSheet } from "@/components/elan/reveal";

export function CocktailShowcase() {
  const { menu } = useElanStore();
  const mounted = useMounted();
  const [selected, setSelected] = useState<MenuItem | null>(null);

  const cocktails = menu.filter((m) => m.category === "Bar & Cocktails");

  return (
    <div>
      <div className="elan-no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {(mounted ? cocktails : []).map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="group w-[280px] shrink-0 snap-center overflow-hidden rounded-lg border border-border card-sheen text-left transition-transform hover:-translate-y-1 sm:w-[320px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {item.tags.includes("Signature") && (
                <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-widest text-primary-foreground uppercase">
                  Signature
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg leading-snug font-medium">
                {item.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-primary">
                  {inr(item.price)}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <Plus className="size-3.5" /> Add
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
        <span className="tracking-widest uppercase">Swipe to explore</span>
        <ArrowRight className="size-3" />
      </div>

      <BottomSheet
        open={selected !== null}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div className="overflow-y-auto">
            <div className="relative h-64 shrink-0">
              <img
                src={selected.image}
                alt={selected.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="px-6 pb-8 pt-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold">
                  {selected.name}
                </h2>
                <span className="shrink-0 font-display text-xl font-bold text-primary">
                  {inr(selected.price)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {selected.description}
              </p>

              {selected.options.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Options available
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.options.map((g) => (
                      <span
                        key={g.name}
                        className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  addToCart({
                    itemId: selected.id,
                    name: selected.name,
                    image: selected.image,
                    qty: 1,
                    selections: [],
                    notes: "",
                    unitPrice: selected.price,
                    station: selected.station,
                  });
                  setSelected(null);
                }}
                className="mt-6 w-full rounded-full bg-primary py-4 text-sm font-bold tracking-[0.15em] text-primary-foreground uppercase transition-transform hover:scale-[1.02]"
              >
                Add to Order · {inr(selected.price)}
              </button>
              <Link
                to="/menu"
                className="mt-2 block text-center text-xs font-semibold tracking-widest text-muted-foreground uppercase hover:text-primary"
              >
                View Full Menu
              </Link>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
