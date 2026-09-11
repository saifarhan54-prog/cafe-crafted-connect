# ÉLAN Restaurant & Bar — interactive dining ecosystem

A single app with three connected experiences (guest, staff, owner) that share live state, so an order placed at a table appears instantly on the kitchen/bar screen and in the owner's numbers.

## Look and feel

Cinematic, warm and editorial: deep charcoal and oxblood, candlelit amber, brass accents, a serif display face for headlines with a clean sans for everything else. Tagline: "Dining, crafted with intention." Generated imagery for the hero, plates and cocktails. Prices in ₹.

## 1. Guest storefront and table ordering

- Home page: cinematic hero, the restaurant's story, chef's picks and signature cocktails, link into the menu.
- Menu page with four categories: Small Plates, Mains, Bar & Cocktails, Desserts.
- Item detail sheet: dish options (spice level, cooking preference, sides) or drink options (spirit choice, ice, garnish), quantity and special instructions; price updates with choices.
- Table mode: opening the menu with a table preset shows a persistent "TABLE 03" badge and attaches that table to the order.
- Cart and checkout, then a live tracking timeline: Order Received -> Preparing -> Ready -> Served.
- Profile page: past orders, favourites, and a review form that only unlocks after an order is served (verified review).

## 2. Staff dashboard

Board view with four columns — New Orders, Preparing, Ready, Completed. Each ticket shows table number, items with quantities, special requests, whether it's kitchen or bar, and time since it arrived. Buttons move a ticket forward: Accept Order, Start Preparing, Mark Ready, Mark Served. Changes appear immediately on the guest's tracking screen.

## 3. Owner dashboard

- Metric cards: Today's Revenue, Total Orders, Guests, Average Order Value, Average Rating.
- Charts: revenue by day, orders by hour, top-selling items.
- Recent orders table and a review feed.
- Menu management: add, edit, delete items, change prices, toggle availability — reflected in the guest menu right away.

## 4. Demo navigation

A slim switcher bar across the top of every screen: Guest View, Table 01–05, Staff KDS, Owner Dashboard. Ships prepopulated with realistic orders, reviews, and a full menu so every screen looks alive on first load.

## Technical notes

- TanStack Start routes: `/` (storefront), `/menu` (with `?table=`), `/order/$id` (tracking), `/profile`, `/staff`, `/admin`.
- Shared store in `src/lib/elan-store.ts`: typed menu/order/review models, seed data, localStorage persistence, and a `storage` + custom-event bus so all open tabs and views stay in sync via a `useElanStore` hook.
- No backend for this build — everything runs on shared local state, which keeps the demo instant and self-contained. If you later want real multi-device syncing and logins, that becomes a Cloud-backed version.
- Design tokens (colours, gradients, shadows, fonts) defined in `src/styles.css`; charts via Recharts; UI from shadcn components.
- Per-page titles and descriptions for sharing.
