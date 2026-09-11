import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus, QrCode, ShoppingBag, Star, X } from "lucide-react";
import { useMemo, useState } from "react";

import {
  CATEGORIES,
  addToCart,
  clearCart,
  inr,
  placeOrder,
  removeFromCart,
  toggleFavorite,
  updateCartQty,
  useElanStore,
  useMounted,
  type Category,
  type MenuItem,
} from "@/lib/elan-store";

export const Route = createFileRoute("/menu")({
  validateSearch: (search: Record<string, unknown>): { table?: number } => {
    const t = Number(search.table);
    return { table: Number.isInteger(t) && t >= 1 && t <= 5 ? t : undefined };
  },
  head: () => ({
    meta: [
      { title: "Menu — ÉLAN Restaurant & Bar" },
      {
        name: "description",
        content:
          "Small plates, coal-fired mains, signature cocktails and desserts. Order to your table at ÉLAN.",
      },
      { property: "og:title", content: "Menu — ÉLAN Restaurant & Bar" },
      {
        property: "og:description",
        content: "Small plates, coal-fired mains, signature cocktails and desserts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { table } = Route.useSearch();
  const { menu, cart, favorites, guestName } = useElanStore();
  const mounted = useMounted();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | "All">("All");
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const items = useMemo(
    () => menu.filter((m) => category === "All" || m.category === category),
    [menu, category],
  );
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.qty * c.unitPrice, 0);

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">ÉLAN · Restaurant & Bar</p>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">The Menu</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Everything is cooked over coals or built to order at the bar. Prices include GST.
          </p>
        </div>
      </header>

      {/* Table indicator */}
      {table && (
        <div className="sticky top-3 z-40 mt-4 flex justify-center px-4">
          <div className="flex items-center gap-2 rounded-full border border-primary/50 bg-card/95 px-5 py-2 shadow-lg shadow-black/50 backdrop-blur">
            <QrCode className="size-4 text-primary" />
            <span className="text-sm font-bold tracking-[0.2em] text-primary">
              TABLE {String(table).padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground">· orders attach automatically</span>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="mx-auto mt-8 max-w-6xl px-6">
        <div className="flex flex-wrap gap-2">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors ${
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <main className="mx-auto mt-8 max-w-6xl px-6">
        {!mounted ? (
          <div className="py-20 text-center text-sm text-muted-foreground">Setting the tables…</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const fav = favorites.includes(item.id);
              return (
                <article
                  key={item.id}
                  className={`group relative overflow-hidden rounded-2xl border border-border card-sheen transition-transform ${
                    item.available ? "hover:-translate-y-1" : "opacity-60"
                  }`}
                >
                  <button
                    className="block w-full text-left"
                    onClick={() => item.available && setSelected(item)}
                    disabled={!item.available}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        width={1024}
                        height={768}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {!item.available && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                          <span className="rounded-full border border-border px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
                            Sold out tonight
                          </span>
                        </div>
                      )}
                      {item.tags.includes("Signature") && item.available && (
                        <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-widest text-primary-foreground uppercase">
                          Signature
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg leading-snug font-medium">{item.name}</h3>
                        <span className="shrink-0 text-sm font-bold text-primary">{inr(item.price)}</span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-secondary-foreground uppercase"
                          >
                            {t}
                          </span>
                        ))}
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-secondary-foreground uppercase">
                          {item.station === "bar" ? "Bar" : "Kitchen"}
                        </span>
                      </div>
                    </div>
                  </button>
                  <button
                    aria-label={fav ? "Remove from favourites" : "Add to favourites"}
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-3 right-3 rounded-full bg-background/70 p-2 backdrop-blur transition-colors hover:bg-background"
                  >
                    <Heart
                      className={`size-4 ${fav ? "fill-wine text-wine" : "text-foreground/80"}`}
                    />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating cart button */}
      {mounted && cartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed right-5 bottom-20 z-40 flex items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-2xl shadow-black/60 transition-transform hover:scale-105"
        >
          <ShoppingBag className="size-5" />
          {cartCount} item{cartCount > 1 ? "s" : ""} · {inr(cartTotal)}
        </button>
      )}

      {/* Item detail modal */}
      {selected && (
        <ItemModal
          item={selected}
          onClose={() => setSelected(null)}
          onAdded={() => {
            setSelected(null);
            setCartOpen(true);
          }}
        />
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <aside className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-display text-xl font-semibold">Your Order</h2>
                {table ? (
                  <p className="mt-0.5 text-xs font-bold tracking-[0.2em] text-primary">
                    TABLE {String(table).padStart(2, "0")}
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs text-muted-foreground">Counter pickup · no table</p>
                )}
              </div>
              <button
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
                className="rounded-full p-2 hover:bg-accent"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  Your order is empty — the menu is waiting.
                </p>
              ) : (
                <ul className="space-y-4">
                  {cart.map((line) => (
                    <li key={line.key} className="flex gap-3 rounded-xl border border-border bg-background/40 p-3">
                      <img
                        src={line.image}
                        alt={line.name}
                        loading="lazy"
                        width={1024}
                        height={768}
                        className="size-16 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold">{line.name}</p>
                          <p className="text-sm font-bold text-primary">{inr(line.qty * line.unitPrice)}</p>
                        </div>
                        {line.selections.length > 0 && (
                          <p className="mt-0.5 text-[11px] text-muted-foreground">{line.selections.join(" · ")}</p>
                        )}
                        {line.notes && (
                          <p className="mt-0.5 text-[11px] text-gold italic">“{line.notes}”</p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => updateCartQty(line.key, -1)}
                            className="rounded-full border border-border p-1 hover:bg-accent"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-5 text-center text-sm font-bold">{line.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => updateCartQty(line.key, 1)}
                            className="rounded-full border border-border p-1 hover:bg-accent"
                          >
                            <Plus className="size-3.5" />
                          </button>
                          <button
                            onClick={() => removeFromCart(line.key)}
                            className="ml-auto text-[11px] font-semibold text-muted-foreground hover:text-destructive"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border px-6 py-5">
                <div className="mb-1 flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{inr(cartTotal)}</span>
                </div>
                <div className="mb-4 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{inr(cartTotal)}</span>
                </div>
                <button
                  onClick={() => {
                    const id = placeOrder(table ?? null);
                    setCartOpen(false);
                    navigate({ to: "/order/$id", params: { id } });
                  }}
                  className="w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  Place Order {table ? `· Table ${String(table).padStart(2, "0")}` : ""} · {inr(cartTotal)}
                </button>
                <button
                  onClick={clearCart}
                  className="mt-2 w-full py-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
                >
                  Clear order
                </button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Ordering as {guestName}
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function ItemModal({
  item,
  onClose,
  onAdded,
}: {
  item: MenuItem;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [choices, setChoices] = useState<Record<string, number>>(() =>
    Object.fromEntries(item.options.map((g) => [g.name, 0])),
  );

  const unitPrice =
    item.price +
    item.options.reduce((sum, g) => {
      const idx = choices[g.name] ?? 0;
      return sum + (g.choices[idx]?.delta ?? 0);
    }, 0);

  const selections = item.options
    .map((g) => g.choices[choices[g.name] ?? 0]?.label)
    .filter((l): l is string => Boolean(l) && l !== "None");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-border bg-card sm:rounded-3xl">
        <div className="relative h-52 shrink-0">
          <img src={item.image} alt={item.name} width={1024} height={768} className="h-full w-full object-cover" />
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full bg-background/70 p-2 backdrop-blur hover:bg-background"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold">{item.name}</h2>
            <span className="shrink-0 font-display text-xl font-bold text-primary">{inr(unitPrice)}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

          {item.options.map((g) => (
            <div key={g.name} className="mt-5">
              <p className="mb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">{g.name}</p>
              <div className="flex flex-wrap gap-2">
                {g.choices.map((c, i) => (
                  <button
                    key={c.label}
                    onClick={() => setChoices((prev) => ({ ...prev, [g.name]: i }))}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      (choices[g.name] ?? 0) === i
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.label}
                    {c.delta > 0 && <span className="ml-1 opacity-80">+{inr(c.delta)}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-5">
            <p className="mb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Special instructions
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, extra hot, dressing on the side…"
              rows={2}
              className="w-full resize-none rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-border p-5">
          <div className="flex items-center gap-3 rounded-full border border-border px-3 py-2">
            <button aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-0.5 hover:text-primary">
              <Minus className="size-4" />
            </button>
            <span className="w-4 text-center font-bold">{qty}</span>
            <button aria-label="Increase" onClick={() => setQty((q) => q + 1)} className="p-0.5 hover:text-primary">
              <Plus className="size-4" />
            </button>
          </div>
          <button
            onClick={() => {
              addToCart({
                itemId: item.id,
                name: item.name,
                image: item.image,
                qty,
                selections,
                notes: notes.trim(),
                unitPrice,
                station: item.station,
              });
              onAdded();
            }}
            className="flex-1 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Add to Order · {inr(unitPrice * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}
