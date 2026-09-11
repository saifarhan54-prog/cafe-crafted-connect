# Élan Café Connect

Build ÉLAN Coffee House, an interactive digital café ecosystem with three connected experiences:

1. Customer Storefront & QR Table Ordering:
- Cinematic luxury aesthetic ("Coffee, crafted with intention"), warm editorial typography, polished food/drink imagery.
- Menu browsing by category (Signature Brews, Espresso Bar, Artisanal Bakes, Savory Plates).
- Item details with customization (milk choice, temperature, syrups) and special instructions.
- Table ordering simulation via `/menu?table=1` through `5` with visible table indicator (e.g., "TABLE 03") that automatically attaches to orders.
- Cart, checkout, and live visual order tracking timeline (Order Received -> Preparing -> Ready -> Served).
- Customer profile with past orders, favorites, and post-service verified review submission.
- Realistic Indian café pricing in INR (₹).

2. Staff Order Dashboard:
- Live Kanban/board view separated by status: New Orders, Preparing, Ready, Completed.
- Ticket details with table number, order items, quantities, special requests, and timestamps.
- Action controls that actively transition status (Accept Order, Start Preparing, Mark Ready, Mark Served).

3. Owner Admin Dashboard:
- Key metrics: Today's Revenue, Total Orders, Customers, AOV, and Average Rating.
- Visual charts: Revenue by day, orders by hour, and top-selling items.
- Recent orders table, customer review feed, and full menu management CRUD (add, edit, delete, adjust prices, toggle availability).

4. Ecosystem Integration & Demo Navigation:
- Shared reactive state (localStorage + events) so placing an order or advancing ticket status syncs instantly across the customer view, staff screen, and owner analytics.
- A demo navigation switcher bar to easily hop between Customer View, Table QR presets (Table 01–05), Staff KDS, and Owner Dashboard.
- Prepopulated with rich mock orders, reviews, and menu data.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6cc34674-e2f7-41e3-98fe-7422be30ab82).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
