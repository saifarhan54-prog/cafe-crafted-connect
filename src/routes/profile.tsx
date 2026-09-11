import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Heart, Star, User } from "lucide-react";
import { useState } from "react";

import {
  STATUS_LABEL,
  addReview,
  inr,
  setGuestName,
  timeAgo,
  useElanStore,
  useMounted,
} from "@/lib/elan-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — ÉLAN Restaurant & Bar" },
      {
        name: "description",
        content: "Your past orders, favourite plates and verified reviews at ÉLAN.",
      },
      { property: "og:title", content: "Your Profile — ÉLAN Restaurant & Bar" },
      { property: "og:description", content: "Your past orders, favourites and verified reviews." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { orders, favorites, menu, guestName, reviews } = useElanStore();
  const mounted = useMounted();
  const [nameDraft, setNameDraft] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [justReviewed, setJustReviewed] = useState(false);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Pouring your profile…
      </div>
    );
  }

  const favoriteItems = menu.filter((m) => favorites.includes(m.id));
  const hasServed = orders.some((o) => o.status === "served");
  const canReview = hasServed && !justReviewed;

  return (
    <div className="min-h-screen pb-32">
      <header className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">ÉLAN · Guest Profile</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/15">
              <User className="size-7 text-primary" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-semibold">{guestName}</h1>
              <p className="text-sm text-muted-foreground">
                {orders.length} orders · {favorites.length} favourites
              </p>
            </div>
          </div>
          <form
            className="mt-5 flex max-w-sm gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (nameDraft.trim()) {
                setGuestName(nameDraft.trim());
                setNameDraft("");
              }
            }}
          >
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="Set your display name"
              className="flex-1 rounded-full border border-input bg-background/60 px-4 py-2 text-sm placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:outline-none"
            />
            <button type="submit" className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground">
              Save
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-14 px-6 py-12">
        {/* Past orders */}
        <section>
          <h2 className="mb-5 font-display text-2xl font-semibold">Past orders</h2>
          {orders.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No orders yet — your first plate is one tap away.
            </p>
          ) : (
            <ul className="space-y-3">
              {orders.slice(0, 8).map((o) => (
                <li key={o.id}>
                  <Link
                    to="/order/$id"
                    params={{ id: o.id }}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border card-sheen p-4 transition-colors hover:bg-accent/40"
                  >
                    <div>
                      <p className="text-sm font-bold">
                        {o.id}{" "}
                        <span className="ml-1 font-normal text-muted-foreground">
                          · {o.table ? `Table ${String(o.table).padStart(2, "0")}` : "Pickup"} · {timeAgo(o.placedAt)}
                        </span>
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${
                          o.status === "served" ? "bg-secondary text-secondary-foreground" : "bg-primary/15 text-primary"
                        }`}
                      >
                        {STATUS_LABEL[o.status]}
                      </span>
                      <span className="text-sm font-bold text-primary">{inr(o.total)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Favourites */}
        <section>
          <h2 className="mb-5 font-display text-2xl font-semibold">Your favourites</h2>
          {favoriteItems.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Tap the heart on any dish or drink to keep it here.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteItems.map((item) => (
                <Link
                  key={item.id}
                  to="/menu"
                  className="group flex items-center gap-3 rounded-2xl border border-border card-sheen p-3 transition-transform hover:-translate-y-0.5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="size-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-xs font-bold text-primary">{inr(item.price)}</p>
                  </div>
                  <Heart className="ml-auto size-4 shrink-0 fill-wine text-wine" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Review */}
        <section>
          <h2 className="mb-2 font-display text-2xl font-semibold">Share your evening</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Reviews open once an order has been served — every word here is from a verified guest.
          </p>
          {canReview ? (
            <form
              className="rounded-2xl border border-border card-sheen p-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reviewText.trim()) return;
                addReview({ name: guestName, rating, text: reviewText.trim(), verified: true });
                setReviewText("");
                setRating(5);
                setJustReviewed(true);
              }}
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${i + 1} star${i > 0 ? "s" : ""}`}
                    onClick={() => setRating(i + 1)}
                  >
                    <Star
                      className={`size-7 transition-colors ${i < rating ? "fill-primary text-primary" : "text-muted hover:text-primary"}`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                placeholder="How was the room, the plate, the pour?"
                className="w-full resize-none rounded-xl border border-input bg-background/60 px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:outline-none"
              />
              <button
                type="submit"
                className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Post verified review
              </button>
            </form>
          ) : (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {justReviewed
                ? "Thank you — your review is live below."
                : "The review form unlocks after your first served order."}
            </p>
          )}

          {reviews.length > 0 && (
            <ul className="mt-8 space-y-3">
              {reviews.slice(0, 4).map((r) => (
                <li key={r.id} className="rounded-2xl border border-border card-sheen p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`size-3.5 ${i < r.rating ? "fill-primary text-primary" : "text-muted"}`} />
                      ))}
                    </div>
                    <span className="text-xs font-bold">{r.name}</span>
                    {r.verified && (
                      <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-primary uppercase">
                        <BadgeCheck className="size-3.5" /> Verified
                      </span>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">{timeAgo(r.date)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{r.text}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
