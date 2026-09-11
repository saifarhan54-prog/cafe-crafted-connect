import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ChefHat, Clock3, GlassWater, UtensilsCrossed } from "lucide-react";

import {
  advanceOrder,
  inr,
  timeAgo,
  useElanStore,
  useMounted,
  type Order,
  type OrderStatus,
} from "@/lib/elan-store";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff KDS — ÉLAN Restaurant & Bar" },
      { name: "description", content: "Live kitchen and bar display — accept, prepare and serve tickets." },
      { property: "og:title", content: "Staff KDS — ÉLAN Restaurant & Bar" },
      { property: "og:description", content: "Live kitchen and bar display for ÉLAN staff." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StaffPage,
});

const COLUMNS: { status: OrderStatus; title: string; action: string | null }[] = [
  { status: "received", title: "New Orders", action: "Accept Order" },
  { status: "preparing", title: "Preparing", action: "Mark Ready" },
  { status: "ready", title: "Ready", action: "Mark Served" },
  { status: "served", title: "Completed", action: null },
];

function StaffPage() {
  const { orders } = useElanStore();
  const mounted = useMounted();

  return (
    <div className="min-h-screen pb-32">
      <header className="border-b border-border bg-card/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6">
          <div>
            <p className="mb-1 text-xs tracking-[0.35em] text-primary uppercase">ÉLAN · Kitchen & Bar Display</p>
            <h1 className="font-display text-3xl font-semibold">Live Tickets</h1>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-wider text-primary uppercase">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Service live
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {!mounted ? (
          <p className="py-20 text-center text-sm text-muted-foreground">Firing up the board…</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {COLUMNS.map((col) => {
              const tickets = orders.filter((o) => o.status === col.status);
              return (
                <section key={col.status} className="flex flex-col rounded-2xl border border-border bg-card/40 p-3">
                  <header className="flex items-center justify-between px-2 py-2">
                    <h2 className="font-display text-lg font-semibold">{col.title}</h2>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold">{tickets.length}</span>
                  </header>
                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {tickets.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                        Nothing here
                      </p>
                    ) : (
                      tickets.map((order) => (
                        <Ticket key={order.id} order={order} action={col.action} />
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function Ticket({ order, action }: { order: Order; action: string | null }) {
  const hasKitchen = order.items.some((i) => i.station === "kitchen");
  const hasBar = order.items.some((i) => i.station === "bar");

  return (
    <article className="rounded-xl border border-border bg-background/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-base font-bold">{order.id}</span>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase ${
            order.table ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {order.table ? `TABLE ${String(order.table).padStart(2, "0")}` : "PICKUP"}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Clock3 className="size-3" /> {timeAgo(order.placedAt)}
        <span className="ml-auto flex items-center gap-1.5">
          {hasKitchen && (
            <span className="flex items-center gap-0.5 rounded bg-secondary px-1.5 py-0.5 font-semibold uppercase">
              <UtensilsCrossed className="size-3" /> Kitchen
            </span>
          )}
          {hasBar && (
            <span className="flex items-center gap-0.5 rounded bg-secondary px-1.5 py-0.5 font-semibold uppercase">
              <GlassWater className="size-3" /> Bar
            </span>
          )}
        </span>
      </div>
      <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
        {order.items.map((item, i) => (
          <li key={i} className="text-xs">
            <span className="font-bold text-primary">{item.qty}×</span>{" "}
            <span className="font-semibold">{item.name}</span>
            {item.selections.length > 0 && (
              <span className="block pl-5 text-muted-foreground">{item.selections.join(" · ")}</span>
            )}
          </li>
        ))}
      </ul>
      {order.items.some((i) => i.notes) && (
        <div className="mt-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-[11px] text-gold">
          {order.items
            .filter((i) => i.notes)
            .map((i) => i.notes)
            .join(" · ")}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs font-bold">{inr(order.total)}</span>
        {action ? (
          <button
            onClick={() => advanceOrder(order.id)}
            className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            {action === "Mark Served" ? <CheckCircle2 className="size-3.5" /> : <ChefHat className="size-3.5" />}
            {action}
          </button>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-primary" /> Done
          </span>
        )}
      </div>
    </article>
  );
}
