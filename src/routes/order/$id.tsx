import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChefHat, ConciergeBell, PackageCheck, Star } from "lucide-react";

import {
  STATUS_FLOW,
  STATUS_LABEL,
  inr,
  timeAgo,
  useElanStore,
  useMounted,
  type OrderStatus,
} from "@/lib/elan-store";

export const Route = createFileRoute("/order/$id")({
  head: () => ({
    meta: [
      { title: "Track Your Order — ÉLAN Restaurant & Bar" },
      { name: "description", content: "Follow your order from the pass to your table, live." },
      { property: "og:title", content: "Track Your Order — ÉLAN Restaurant & Bar" },
      { property: "og:description", content: "Follow your order from the pass to your table, live." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderTrackingPage,
});

const STEP_ICONS = [PackageCheck, ChefHat, ConciergeBell, Star];

function OrderTrackingPage() {
  const { id } = Route.useParams();
  const { orders } = useElanStore();
  const mounted = useMounted();
  const order = orders.find((o) => o.id === id);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Finding your order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-3xl font-semibold">Order not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn't find order {id}. It may have been cleared from this device.
        </p>
        <Link to="/menu" className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
          Back to the menu
        </Link>
      </div>
    );
  }

  const activeIdx = STATUS_FLOW.indexOf(order.status as OrderStatus);

  return (
    <div className="min-h-screen pb-32">
      <header className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-3xl px-6 py-10 text-center">
          <p className="mb-2 text-xs tracking-[0.35em] text-primary uppercase">Live from the pass</p>
          <h1 className="font-display text-4xl font-semibold">Order {order.id}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {order.table ? `Table ${String(order.table).padStart(2, "0")}` : "Counter pickup"} · placed{" "}
            {timeAgo(order.placedAt)}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6">
        {/* Timeline */}
        <ol className="mt-12 space-y-0">
          {STATUS_FLOW.map((status, i) => {
            const Icon = STEP_ICONS[i]!;
            const done = i < activeIdx;
            const active = i === activeIdx;
            return (
              <li key={status} className="relative flex gap-5 pb-10 last:pb-0">
                {i < STATUS_FLOW.length - 1 && (
                  <span
                    className={`absolute top-11 left-[22px] h-[calc(100%-44px)] w-px ${
                      done ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border transition-all ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-[0_0_30px_-5px_var(--color-primary)]"
                      : done
                        ? "border-primary bg-card text-primary"
                        : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="size-5" /> : <Icon className="size-5" />}
                </span>
                <div className="pt-2">
                  <p
                    className={`font-display text-lg font-semibold ${
                      active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {STATUS_LABEL[status]}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {status === "received" && "Your order is with our team."}
                    {status === "preparing" && "On the coals and at the shaker."}
                    {status === "ready" && "At the pass — on its way to you."}
                    {status === "served" && "Enjoy. Dessert is never a bad idea."}
                  </p>
                  {active && (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold tracking-wider text-primary uppercase">
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                        <span className="relative inline-flex size-2 rounded-full bg-primary" />
                      </span>
                      Live
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Items */}
        <section className="mt-10 rounded-2xl border border-border card-sheen p-6">
          <h2 className="mb-4 font-display text-xl font-semibold">Your order</h2>
          <ul className="divide-y divide-border">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-semibold">
                    {item.qty} × {item.name}
                  </p>
                  {item.selections.length > 0 && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.selections.join(" · ")}</p>
                  )}
                  {item.notes && <p className="mt-0.5 text-xs text-gold italic">“{item.notes}”</p>}
                </div>
                <span className="shrink-0 text-sm font-bold">{inr(item.qty * item.unitPrice)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-bold">
            <span>Total</span>
            <span className="text-primary">{inr(order.total)}</span>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {order.status === "served" ? (
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              <Star className="size-4" /> Leave a verified review
            </Link>
          ) : (
            <Link
              to="/menu"
              search={{ table: order.table ?? undefined }}
              className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Add more to your table
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
