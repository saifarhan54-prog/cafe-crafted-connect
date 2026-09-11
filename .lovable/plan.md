# ÉLAN Coffee House — interactive café ecosystem

A single app with three connected experiences (customer, staff, owner) that share live state, so an order placed at a table appears instantly on the staff screen and in the owner's numbers.

## Look and feel

Cinematic, warm and editorial: deep espresso browns, cream paper, brass accents, a serif display face for headlines paired with a clean sans for everything else. Tagline: "Coffee, crafted with intention." Generated imagery for hero and menu items. Prices in ₹.

## 1. Customer storefront and table ordering

- Home page: cinematic hero, house story, featured drinks, link into the menu.
- Menu page with the four categories: Signature Brews, Espresso Bar, Artisanal Bakes, Savory Plates.
- Item detail sheet: milk choice, temperature, syrups, quantity, special instructions; price updates with options.
- Table mode: opening the menu with a table preset shows a persistent "TABLE 03" badge and attaches that table to the order.
- Cart and checkout, then a live tracking timeline: Order Received -> Preparing -> Ready -> Served.
- Profile page: past orders, favourites, and a review form that only unlocks after an order is served (verified review).

## 2. Staff dashboard

Board view with four columns — New Orders, Preparing, Ready, Completed. Each ticket shows table number, items with quantities, special requests, and time since it arrived. Buttons move a ticket forward: Accept Order, Start Preparing, Mark Ready, Mark Served. Changes appear immediately on the customer's tracking screen.

## 3. Owner dashboard

- Metric cards: Today's Revenue, Total Orders, Customers, Average Order Value, Average Rating.
- Charts: revenue by day, orders by hour, top-selling items.
- Recent orders table and a review feed.
- Menu management: add, edit, delete items, change prices, toggle availability — reflected in the customer menu right away.

## 4. Demo navigation

A slim switcher bar across the top of every screen: Customer View, Table 01–05, Staff KDS, Owner Dashboard. Ships prepopulated with realistic orders, reviews, and a full menu so every screen looks alive on first load.

## Technical notes

- TanStack Start routes: `/` (storefront), `/menu` (with `?table=`), `/order/$id` (tracking), `/profile`, `/staff`, `/admin`.
- Shared store in `src/lib/cafe-store.ts`: typed menu/order/review models, seed data, localStorage persistence, and a `storage` + custom-event bus so all open tabs and views stay in sync via a `useCafeStore` hook.
- No backend for this build — everything runs on shared local state, which keeps the demo instant and self-contained. If you later want real multi-device syncing and logins, that becomes a Cloud-backed version.
- Design tokens (colours, gradients, shadows, fonts) defined in `src/styles.css`; charts via Recharts; UI from shadcn components.
- Per-page titles and descriptions for sharing.
