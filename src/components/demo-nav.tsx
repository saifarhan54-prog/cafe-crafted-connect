import { Link } from "@tanstack/react-router";
import { LayoutDashboard, QrCode, Store, UtensilsCrossed } from "lucide-react";

const tables = [1, 2, 3, 4, 5];

export function DemoNav() {
  return (
    <nav
      aria-label="Demo navigation"
      className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3"
    >
      <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/90 px-2 py-1.5 shadow-2xl shadow-black/60 backdrop-blur-md">
        <span className="hidden px-2 font-display text-xs tracking-[0.25em] text-primary uppercase sm:block">
          ÉLAN Demo
        </span>
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ className: "bg-primary text-primary-foreground" }}
          inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          <Store className="size-3.5" /> Guest View
        </Link>
        <div className="flex items-center gap-0.5 rounded-full bg-background/60 px-1.5 py-0.5">
          <QrCode className="mx-1 size-3.5 text-muted-foreground" />
          {tables.map((t) => (
            <Link
              key={t}
              to="/menu"
              search={{ table: t }}
              className="rounded-full px-2 py-1 text-[11px] font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              T{String(t).padStart(2, "0")}
            </Link>
          ))}
        </div>
        <Link
          to="/staff"
          activeProps={{ className: "bg-primary text-primary-foreground" }}
          inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          <UtensilsCrossed className="size-3.5" /> Staff KDS
        </Link>
        <Link
          to="/admin"
          activeProps={{ className: "bg-primary text-primary-foreground" }}
          inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          <LayoutDashboard className="size-3.5" /> Owner
        </Link>
      </div>
    </nav>
  );
}
