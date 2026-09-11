import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, Pencil, Plus, Star, Trash2, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CATEGORIES,
  STATUS_LABEL,
  deleteMenuItem,
  inr,
  timeAgo,
  toggleAvailability,
  upsertMenuItem,
  useElanStore,
  useMounted,
  type Category,
  type MenuItem,
  type Station,
} from "@/lib/elan-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Owner Dashboard — ÉLAN Restaurant & Bar" },
      {
        name: "description",
        content: "Revenue, orders, ratings and menu management for ÉLAN Restaurant & Bar.",
      },
      { property: "og:title", content: "Owner Dashboard — ÉLAN Restaurant & Bar" },
      { property: "og:description", content: "Revenue, orders, ratings and menu management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const tooltipStyle = {
  backgroundColor: "oklch(0.205 0.015 58)",
  border: "1px solid oklch(1 0 0 / 12%)",
  borderRadius: "0.75rem",
  fontSize: "12px",
  color: "oklch(0.93 0.02 90)",
};

function AdminPage() {
  const { orders, reviews, menu } = useElanStore();
  const mounted = useMounted();
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [adding, setAdding] = useState(false);

  const stats = useMemo(() => {
    if (!mounted) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const t0 = today.getTime();

    const todayOrders = orders.filter((o) => o.placedAt >= t0);
    const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
    const aov = orders.length ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0;
    const customers = new Set(orders.map((o) => o.customer)).size;
    const avgRating = reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

    const revenueByDay = Array.from({ length: 7 }, (_, i) => {
      const dayStart = t0 - (6 - i) * 86400_000;
      const dayEnd = dayStart + 86400_000;
      const revenue = orders
        .filter((o) => o.placedAt >= dayStart && o.placedAt < dayEnd)
        .reduce((s, o) => s + o.total, 0);
      return {
        day: new Date(dayStart).toLocaleDateString("en-IN", { weekday: "short" }),
        revenue,
      };
    });

    const ordersByHour = Array.from({ length: 13 }, (_, i) => {
      const hour = i + 11; // 11:00 – 23:00
      const count = orders.filter((o) => {
        if (o.placedAt < t0) return false;
        return new Date(o.placedAt).getHours() === hour;
      }).length;
      return { hour: `${hour}:00`, orders: count };
    });

    const tally = new Map<string, number>();
    for (const o of orders) for (const i of o.items) tally.set(i.name, (tally.get(i.name) ?? 0) + i.qty);
    const topItems = [...tally.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, qty]) => ({ name: name.length > 18 ? `${name.slice(0, 17)}…` : name, qty }));

    return { todayRevenue, todayOrders: todayOrders.length, totalOrders: orders.length, aov, customers, avgRating, revenueByDay, ordersByHour, topItems };
  }, [mounted, orders, reviews]);

  return (
    <div className="min-h-screen pb-32">
      <header className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="mb-1 text-xs tracking-[0.35em] text-primary uppercase">ÉLAN · Owner Dashboard</p>
          <h1 className="font-display text-3xl font-semibold">Tonight at a glance</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-10 px-6 py-8">
        {!mounted || !stats ? (
          <p className="py-20 text-center text-sm text-muted-foreground">Counting the till…</p>
        ) : (
          <>
            {/* Metric cards */}
            <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              <Metric icon={<IndianRupee className="size-4" />} label="Today's Revenue" value={inr(stats.todayRevenue)} />
              <Metric icon={<IndianRupee className="size-4" />} label="Total Orders" value={String(stats.totalOrders)} sub={`${stats.todayOrders} today`} />
              <Metric icon={<Users className="size-4" />} label="Customers" value={String(stats.customers)} />
              <Metric icon={<IndianRupee className="size-4" />} label="Avg Order Value" value={inr(stats.aov)} />
              <Metric icon={<Star className="size-4" />} label="Avg Rating" value={stats.avgRating} sub={`${reviews.length} reviews`} />
            </section>

            {/* Charts */}
            <section className="grid gap-5 lg:grid-cols-3">
              <ChartCard title="Revenue by day">
                <BarChart data={stats.revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "oklch(0.7 0.03 80)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "oklch(0.7 0.03 80)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} tickFormatter={(v: number) => `₹${Math.round(v / 1000)}k`} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 5%)" }} formatter={(v) => [inr(Number(v)), "Revenue"]} />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="oklch(0.76 0.1 80)" />
                </BarChart>
              </ChartCard>
              <ChartCard title="Orders by hour (today)">
                <BarChart data={stats.ordersByHour}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: "oklch(0.7 0.03 80)", fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fill: "oklch(0.7 0.03 80)", fontSize: 11 }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 5%)" }} />
                  <Bar dataKey="orders" radius={[6, 6, 0, 0]} fill="oklch(0.7 0.12 40)" />
                </BarChart>
              </ChartCard>
              <ChartCard title="Top-selling items">
                <BarChart data={stats.topItems} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "oklch(0.7 0.03 80)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "oklch(0.7 0.03 80)", fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 5%)" }} />
                  <Bar dataKey="qty" radius={[0, 6, 6, 0]}>
                    {stats.topItems.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "oklch(0.76 0.1 80)" : "oklch(0.42 0.09 22)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartCard>
            </section>

            {/* Recent orders + reviews */}
            <section className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-border card-sheen p-5">
                <h2 className="mb-4 font-display text-xl font-semibold">Recent orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground uppercase">
                        <th className="pb-2 pr-3 font-semibold">Order</th>
                        <th className="pb-2 pr-3 font-semibold">Table</th>
                        <th className="pb-2 pr-3 font-semibold">Guest</th>
                        <th className="pb-2 pr-3 font-semibold">Status</th>
                        <th className="pb-2 font-semibold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 8).map((o) => (
                        <tr key={o.id} className="border-b border-border/50 last:border-0">
                          <td className="py-2.5 pr-3 font-bold">{o.id}</td>
                          <td className="py-2.5 pr-3">{o.table ? `T${String(o.table).padStart(2, "0")}` : "Pickup"}</td>
                          <td className="py-2.5 pr-3">{o.customer}</td>
                          <td className="py-2.5 pr-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                o.status === "served" ? "bg-secondary text-secondary-foreground" : "bg-primary/15 text-primary"
                              }`}
                            >
                              {STATUS_LABEL[o.status]}
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-bold text-primary">{inr(o.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-border card-sheen p-5">
                <h2 className="mb-4 font-display text-xl font-semibold">Review feed</h2>
                <ul className="space-y-3">
                  {reviews.slice(0, 5).map((r) => (
                    <li key={r.id} className="rounded-xl border border-border bg-background/40 p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`size-3 ${i < r.rating ? "fill-primary text-primary" : "text-muted"}`} />
                          ))}
                        </div>
                        <span className="text-xs font-bold">{r.name}</span>
                        <span className="ml-auto text-[11px] text-muted-foreground">{timeAgo(r.date)}</span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-foreground/85">{r.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Menu management */}
            <section className="rounded-2xl border border-border card-sheen p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Menu management</h2>
                <button
                  onClick={() => setAdding(true)}
                  className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-transform hover:scale-105"
                >
                  <Plus className="size-3.5" /> Add item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase">
                      <th className="pb-2 pr-3 font-semibold">Item</th>
                      <th className="pb-2 pr-3 font-semibold">Category</th>
                      <th className="pb-2 pr-3 font-semibold">Station</th>
                      <th className="pb-2 pr-3 font-semibold text-right">Price</th>
                      <th className="pb-2 pr-3 font-semibold text-center">Available</th>
                      <th className="pb-2 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menu.map((m) => (
                      <tr key={m.id} className="border-b border-border/50 last:border-0">
                        <td className="py-2.5 pr-3">
                          <span className="font-semibold">{m.name}</span>
                        </td>
                        <td className="py-2.5 pr-3 text-muted-foreground">{m.category}</td>
                        <td className="py-2.5 pr-3 text-muted-foreground capitalize">{m.station}</td>
                        <td className="py-2.5 pr-3 text-right font-bold text-primary">{inr(m.price)}</td>
                        <td className="py-2.5 pr-3 text-center">
                          <button
                            role="switch"
                            aria-checked={m.available}
                            aria-label={`Toggle availability of ${m.name}`}
                            onClick={() => toggleAvailability(m.id)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              m.available ? "bg-primary" : "bg-muted"
                            }`}
                          >
                            <span
                              className={`inline-block size-3.5 transform rounded-full bg-primary-foreground transition-transform ${
                                m.available ? "translate-x-4.5" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            aria-label={`Edit ${m.name}`}
                            onClick={() => setEditing(m)}
                            className="mr-1 rounded-full p-1.5 hover:bg-accent"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            aria-label={`Delete ${m.name}`}
                            onClick={() => deleteMenuItem(m.id)}
                            className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      {(editing || adding) && (
        <MenuItemForm
          item={editing}
          onClose={() => {
            setEditing(null);
            setAdding(false);
          }}
        />
      )}
    </div>
  );
}

function Metric({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border card-sheen p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        <span className="text-primary">{icon}</span> {label}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="rounded-2xl border border-border card-sheen p-5">
      <h3 className="mb-4 font-display text-lg font-semibold">{title}</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MenuItemForm({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { menu } = useElanStore();
  const [name, setName] = useState(item?.name ?? "");
  const [price, setPrice] = useState(item?.price ?? 495);
  const [category, setCategory] = useState<Category>(item?.category ?? "Small Plates");
  const [station, setStation] = useState<Station>(item?.station ?? "kitchen");
  const [description, setDescription] = useState(item?.description ?? "");

  const save = () => {
    if (!name.trim()) return;
    const base: MenuItem =
      item ??
      ({
        id: `custom-${Date.now()}`,
        image: menu[0]?.image ?? "",
        tags: [],
        options: [],
        available: true,
      } as MenuItem);
    upsertMenuItem({ ...base, name: name.trim(), price, category, station, description: description.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">{item ? "Edit item" : "New item"}</h2>
          <button aria-label="Close" onClick={onClose} className="rounded-full p-2 hover:bg-accent">
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-4">
          <label className="block text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm font-normal normal-case focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Price (₹)
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm font-normal focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </label>
            <label className="block text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Station
              <select
                value={station}
                onChange={(e) => setStation(e.target.value as Station)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm font-normal focus:ring-2 focus:ring-ring focus:outline-none"
              >
                <option value="kitchen">Kitchen</option>
                <option value="bar">Bar</option>
              </select>
            </label>
          </div>
          <label className="block text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm font-normal focus:ring-2 focus:ring-ring focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1.5 w-full resize-none rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm font-normal normal-case focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </label>
        </div>
        <button
          onClick={save}
          className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          {item ? "Save changes" : "Add to menu"}
        </button>
      </div>
    </div>
  );
}
