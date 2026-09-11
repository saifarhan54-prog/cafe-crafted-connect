import { useEffect, useState, useSyncExternalStore } from "react";

import imgArancini from "@/assets/dish-arancini.jpg";
import imgBurrata from "@/assets/dish-burrata.jpg";
import imgLamb from "@/assets/dish-lamb.jpg";
import imgPasta from "@/assets/dish-pasta.jpg";
import imgPrawn from "@/assets/dish-prawn.jpg";
import imgOldFashioned from "@/assets/drink-oldfashioned.jpg";
import imgEspressoMartini from "@/assets/drink-espresso-martini.jpg";
import imgCheesecake from "@/assets/dessert-cheesecake.jpg";

// ---------- Types ----------

export type Category = "Small Plates" | "Mains" | "Bar & Cocktails" | "Desserts";
export const CATEGORIES: Category[] = ["Small Plates", "Mains", "Bar & Cocktails", "Desserts"];

export type Station = "kitchen" | "bar";
export type OrderStatus = "received" | "preparing" | "ready" | "served";
export const STATUS_FLOW: OrderStatus[] = ["received", "preparing", "ready", "served"];
export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Order Received",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
};

export interface OptionChoice {
  label: string;
  delta: number;
}
export interface OptionGroup {
  name: string;
  choices: OptionChoice[];
}
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  available: boolean;
  station: Station;
  tags: string[];
  featured?: boolean;
  options: OptionGroup[];
}
export interface CartLine {
  key: string;
  itemId: string;
  name: string;
  image: string;
  qty: number;
  selections: string[];
  notes: string;
  unitPrice: number;
  station: Station;
}
export interface OrderItem {
  name: string;
  qty: number;
  selections: string[];
  notes: string;
  unitPrice: number;
  station: Station;
}
export interface Order {
  id: string;
  table: number | null;
  customer: string;
  items: OrderItem[];
  status: OrderStatus;
  placedAt: number;
  total: number;
}
export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: number;
  verified: boolean;
}

export interface ElanState {
  menu: MenuItem[];
  orders: Order[];
  reviews: Review[];
  cart: CartLine[];
  favorites: string[];
  guestName: string;
}

// ---------- Option presets ----------

const spice: OptionGroup = {
  name: "Spice Level",
  choices: [
    { label: "Mild", delta: 0 },
    { label: "Medium", delta: 0 },
    { label: "Fiery", delta: 0 },
  ],
};
const extras: OptionGroup = {
  name: "Extras",
  choices: [
    { label: "None", delta: 0 },
    { label: "Truffle Shave", delta: 250 },
    { label: "Garlic Bread", delta: 95 },
    { label: "Aged Balsamic", delta: 75 },
  ],
};
const doneness: OptionGroup = {
  name: "Cooking Preference",
  choices: [
    { label: "Medium Rare", delta: 0 },
    { label: "Medium", delta: 0 },
    { label: "Well Done", delta: 0 },
  ],
};
const spirit: OptionGroup = {
  name: "Spirit",
  choices: [
    { label: "House Pour", delta: 0 },
    { label: "Premium", delta: 150 },
    { label: "Top Shelf", delta: 300 },
  ],
};
const ice: OptionGroup = {
  name: "Serve",
  choices: [
    { label: "Large Cube", delta: 0 },
    { label: "Crushed Ice", delta: 0 },
    { label: "Straight Up", delta: 0 },
  ],
};

// ---------- Seed data ----------

function seedMenu(): MenuItem[] {
  return [
    { id: "sp-burrata", name: "Burrata & Charred Tomato", description: "Creamy Puglian burrata, blistered heirloom tomatoes, basil oil, grilled sourdough.", price: 545, category: "Small Plates", image: imgBurrata, available: true, station: "kitchen", tags: ["Vegetarian"], featured: true, options: [extras] },
    { id: "sp-arancini", name: "Truffle Arancini", description: "Golden risotto balls, molten taleggio heart, black truffle aioli.", price: 425, category: "Small Plates", image: imgArancini, available: true, station: "kitchen", tags: ["Vegetarian"], options: [extras] },
    { id: "sp-paneer", name: "Paneer Tikka Skewers", description: "Charred malai paneer, smoked yoghurt, pickled red onion, mint chutney.", price: 445, category: "Small Plates", image: imgArancini, available: true, station: "kitchen", tags: ["Vegetarian", "Spicy"], options: [spice] },
    { id: "sp-lotus", name: "Crispy Lotus Stem", description: "Honey-chilli glazed lotus root, toasted sesame, scallion.", price: 395, category: "Small Plates", image: imgArancini, available: true, station: "kitchen", tags: ["Vegan"], options: [spice] },
    { id: "mn-lamb", name: "Smoked Lamb Chops", description: "Coal-fired lamb, rosemary jus, smoked garlic purée, charred lemon.", price: 1145, category: "Mains", image: imgLamb, available: true, station: "kitchen", tags: ["Signature"], featured: true, options: [doneness, extras] },
    { id: "mn-pasta", name: "Truffle Tagliatelle", description: "Hand-cut pasta, wild mushroom, 24-month parmesan, white truffle butter.", price: 845, category: "Mains", image: imgPasta, available: true, station: "kitchen", tags: ["Vegetarian"], featured: true, options: [extras] },
    { id: "mn-prawn", name: "Goan Prawn Curry", description: "Tiger prawns, coconut-tamarind curry, curry leaf oil, steamed rice.", price: 895, category: "Mains", image: imgPrawn, available: true, station: "kitchen", tags: ["Spicy"], options: [spice] },
    { id: "mn-chicken", name: "ÉLAN Butter Chicken", description: "Slow-simmered tomato-makhani, charcoal chicken, saffron cream, naan crisp.", price: 745, category: "Mains", image: imgPrawn, available: true, station: "kitchen", tags: ["House Classic"], options: [spice, extras] },
    { id: "ck-oldfashioned", name: "Smoked Old Fashioned", description: "Bourbon, demerara, angostura, applewood smoke trapped under glass.", price: 695, category: "Bar & Cocktails", image: imgOldFashioned, available: true, station: "bar", tags: ["Signature"], featured: true, options: [spirit, ice] },
    { id: "ck-espresso", name: "ÉLAN Espresso Martini", description: "Vodka, single-estate espresso, coffee liqueur, velvet crema.", price: 645, category: "Bar & Cocktails", image: imgEspressoMartini, available: true, station: "bar", tags: ["House Classic"], options: [spirit] },
    { id: "ck-saffron", name: "Saffron Gin Fizz", description: "Saffron-infused gin, citrus, cardamom bitters, silky foam.", price: 595, category: "Bar & Cocktails", image: imgOldFashioned, available: true, station: "bar", tags: [], options: [spirit, ice] },
    { id: "ck-margarita", name: "Mango Chilli Margarita", description: "Blanco tequila, Alphonso purée, bird's-eye chilli, black salt rim.", price: 625, category: "Bar & Cocktails", image: imgEspressoMartini, available: true, station: "bar", tags: ["Spicy"], options: [spirit, ice] },
    { id: "ds-cheesecake", name: "Basque Burnt Cheesecake", description: "Caramelised top, molten centre, macerated berries.", price: 445, category: "Desserts", image: imgCheesecake, available: true, station: "kitchen", tags: ["Signature"], options: [] },
    { id: "ds-fondant", name: "Dark Chocolate Fondant", description: "70% single-origin ganache core, sea salt, cocoa-nib tuile.", price: 475, category: "Desserts", image: imgCheesecake, available: true, station: "kitchen", tags: [], options: [] },
    { id: "ds-brulee", name: "Cardamom Crème Brûlée", description: "Slow-baked custard, green cardamom, torched sugar glass.", price: 425, category: "Desserts", image: imgCheesecake, available: false, station: "kitchen", tags: [], options: [] },
    { id: "ds-tiramisu", name: "Espresso Tiramisu", description: "Mascarpone cloud, espresso-soaked savoiardi, cocoa dust.", price: 445, category: "Desserts", image: imgCheesecake, available: true, station: "kitchen", tags: [], options: [] },
  ];
}

const NAMES = ["Aarav Mehta", "Priya Sharma", "Rohan Kapoor", "Ananya Iyer", "Vikram Malhotra", "Ishita Bose", "Kabir Anand", "Meera Nair", "Arjun Reddy", "Sana Sheikh", "Dev Patel", "Nisha Rao"];

const H = 3600_000;
const D = 24 * H;

function seedOrders(): Order[] {
  const now = Date.now();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const t0 = today.getTime();

  const mk = (
    n: number,
    table: number | null,
    customer: string,
    status: OrderStatus,
    placedAt: number,
    items: [string, number, number, Station][],
    notes = "",
  ): Order => ({
    id: `ELN-${1040 + n}`,
    table,
    customer,
    status,
    placedAt,
    items: items.map(([name, qty, price, station]) => ({ name, qty, selections: [], notes, unitPrice: price, station })),
    total: items.reduce((s, [, q, p]) => s + q * p, 0),
  });

  return [
    // Live board (today)
    mk(1, 2, "Aarav Mehta", "received", now - 4 * 60_000, [["Smoked Lamb Chops", 1, 1145, "kitchen"], ["Smoked Old Fashioned", 2, 695, "bar"]], "Lamb well done, please"),
    mk(2, 5, "Priya Sharma", "received", now - 9 * 60_000, [["Truffle Arancini", 1, 425, "kitchen"], ["Saffron Gin Fizz", 1, 595, "bar"]]),
    mk(3, 3, "Rohan Kapoor", "preparing", now - 14 * 60_000, [["Goan Prawn Curry", 1, 895, "kitchen"], ["ÉLAN Butter Chicken", 1, 745, "kitchen"], ["Mango Chilli Margarita", 2, 625, "bar"]], "Extra spicy curry"),
    mk(4, 1, "Ananya Iyer", "preparing", now - 21 * 60_000, [["Truffle Tagliatelle", 2, 845, "kitchen"], ["Burrata & Charred Tomato", 1, 545, "kitchen"]]),
    mk(5, 4, "Vikram Malhotra", "ready", now - 27 * 60_000, [["ÉLAN Espresso Martini", 2, 645, "bar"], ["Dark Chocolate Fondant", 1, 475, "kitchen"]]),
    // Completed earlier today (spread across service hours)
    mk(6, 1, "Ishita Bose", "served", t0 + 11 * H + 20 * 60_000, [["Burrata & Charred Tomato", 1, 545, "kitchen"], ["Saffron Gin Fizz", 1, 595, "bar"]]),
    mk(7, 3, "Kabir Anand", "served", t0 + 12 * H + 45 * 60_000, [["Smoked Lamb Chops", 2, 1145, "kitchen"], ["Smoked Old Fashioned", 1, 695, "bar"]]),
    mk(8, null, "Meera Nair", "served", t0 + 13 * H + 10 * 60_000, [["Truffle Tagliatelle", 1, 845, "kitchen"], ["Basque Burnt Cheesecake", 1, 445, "kitchen"]]),
    mk(9, 5, "Arjun Reddy", "served", t0 + 14 * H + 5 * 60_000, [["ÉLAN Butter Chicken", 1, 745, "kitchen"], ["Paneer Tikka Skewers", 1, 445, "kitchen"], ["Mango Chilli Margarita", 1, 625, "bar"]]),
    mk(10, 2, "Sana Sheikh", "served", t0 + 16 * H + 30 * 60_000, [["Goan Prawn Curry", 1, 895, "kitchen"], ["ÉLAN Espresso Martini", 2, 645, "bar"], ["Espresso Tiramisu", 1, 445, "kitchen"]]),
    // Previous days
    mk(11, 4, "Dev Patel", "served", now - 1 * D - 2 * H, [["Smoked Lamb Chops", 1, 1145, "kitchen"], ["Truffle Arancini", 1, 425, "kitchen"], ["Smoked Old Fashioned", 2, 695, "bar"]]),
    mk(12, 1, "Nisha Rao", "served", now - 1 * D - 4 * H, [["Truffle Tagliatelle", 2, 845, "kitchen"], ["Dark Chocolate Fondant", 1, 475, "kitchen"]]),
    mk(13, 3, "Aarav Mehta", "served", now - 2 * D - 3 * H, [["ÉLAN Butter Chicken", 2, 745, "kitchen"], ["Saffron Gin Fizz", 2, 595, "bar"], ["Basque Burnt Cheesecake", 1, 445, "kitchen"]]),
    mk(14, 2, "Priya Sharma", "served", now - 3 * D - 5 * H, [["Burrata & Charred Tomato", 2, 545, "kitchen"], ["Goan Prawn Curry", 1, 895, "kitchen"], ["Mango Chilli Margarita", 2, 625, "bar"]]),
    mk(15, 5, "Vikram Malhotra", "served", now - 4 * D - 2 * H, [["Smoked Lamb Chops", 1, 1145, "kitchen"], ["Crispy Lotus Stem", 1, 395, "kitchen"], ["ÉLAN Espresso Martini", 1, 645, "bar"]]),
    mk(16, 1, "Ananya Iyer", "served", now - 5 * D - 6 * H, [["Paneer Tikka Skewers", 2, 445, "kitchen"], ["ÉLAN Butter Chicken", 1, 745, "kitchen"], ["Espresso Tiramisu", 2, 445, "kitchen"]]),
    mk(17, 4, "Kabir Anand", "served", now - 6 * D - 3 * H, [["Truffle Tagliatelle", 1, 845, "kitchen"], ["Smoked Old Fashioned", 1, 695, "bar"], ["Dark Chocolate Fondant", 1, 475, "kitchen"]]),
  ];
}

function seedReviews(): Review[] {
  const now = Date.now();
  return [
    { id: "rv-1", name: "Ananya Iyer", rating: 5, text: "The smoked old fashioned is theatre in a glass. Lamb chops were perfect — candlelit room makes it a whole evening.", date: now - 5 * H, verified: true },
    { id: "rv-2", name: "Kabir Anand", rating: 5, text: "Truffle tagliatelle is the best plate of pasta in the city. Service felt personal, never rushed.", date: now - 1 * D, verified: true },
    { id: "rv-3", name: "Ishita Bose", rating: 4, text: "Beautiful room, burrata was lovely. Bar gets busy after nine — book the banquette if you can.", date: now - 2 * D, verified: true },
    { id: "rv-4", name: "Dev Patel", rating: 5, text: "Ordered from the table QR, food tracked live to the pass. Butter chicken lives up to the hype.", date: now - 3 * D, verified: true },
    { id: "rv-5", name: "Meera Nair", rating: 4, text: "Basque cheesecake with the espresso martini is a dangerous combination. Will be back.", date: now - 4 * D, verified: true },
  ];
}

function seedState(): ElanState {
  return {
    menu: seedMenu(),
    orders: seedOrders(),
    reviews: seedReviews(),
    cart: [],
    favorites: ["mn-lamb", "ck-oldfashioned"],
    guestName: "Guest",
  };
}

// ---------- Store ----------

const KEY = "elan-state-v1";
const EVENT = "elan:changed";

const EMPTY: ElanState = { menu: [], orders: [], reviews: [], cart: [], favorites: [], guestName: "" };

let state: ElanState | null = null;

function load(): ElanState {
  if (typeof window === "undefined") return seedState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ElanState;
      if (parsed && Array.isArray(parsed.menu)) return parsed;
    }
  } catch {
    // fall through to seed
  }
  const fresh = seedState();
  try {
    window.localStorage.setItem(KEY, JSON.stringify(fresh));
  } catch {
    // storage unavailable
  }
  return fresh;
}

function getState(): ElanState {
  if (!state) state = load();
  return state;
}

function setState(next: ElanState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVENT, cb);
  };
}

export function useElanStore(): ElanState {
  return useSyncExternalStore(subscribe, getState, () => EMPTY);
}

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

// ---------- Actions ----------

export function addToCart(line: Omit<CartLine, "key">) {
  const s = getState();
  const key = `${line.itemId}|${line.selections.join(",")}|${line.notes}`;
  const existing = s.cart.find((c) => c.key === key);
  const cart = existing
    ? s.cart.map((c) => (c.key === key ? { ...c, qty: c.qty + line.qty } : c))
    : [...s.cart, { ...line, key }];
  setState({ ...s, cart });
}

export function updateCartQty(key: string, delta: number) {
  const s = getState();
  const cart = s.cart
    .map((c) => (c.key === key ? { ...c, qty: c.qty + delta } : c))
    .filter((c) => c.qty > 0);
  setState({ ...s, cart });
}

export function removeFromCart(key: string) {
  const s = getState();
  setState({ ...s, cart: s.cart.filter((c) => c.key !== key) });
}

export function clearCart() {
  const s = getState();
  setState({ ...s, cart: [] });
}

export function placeOrder(table: number | null): string {
  const s = getState();
  const num = 1041 + s.orders.length + Math.floor(Math.random() * 3);
  const id = `ELN-${num}`;
  const order: Order = {
    id,
    table,
    customer: s.guestName || "Guest",
    items: s.cart.map((c) => ({ name: c.name, qty: c.qty, selections: c.selections, notes: c.notes, unitPrice: c.unitPrice, station: c.station })),
    status: "received",
    placedAt: Date.now(),
    total: s.cart.reduce((sum, c) => sum + c.qty * c.unitPrice, 0),
  };
  setState({ ...s, orders: [order, ...s.orders], cart: [] });
  return id;
}

export function advanceOrder(id: string) {
  const s = getState();
  const orders = s.orders.map((o) => {
    if (o.id !== id) return o;
    const idx = STATUS_FLOW.indexOf(o.status);
    return idx < STATUS_FLOW.length - 1 ? { ...o, status: STATUS_FLOW[idx + 1] } : o;
  });
  setState({ ...s, orders });
}

export function upsertMenuItem(item: MenuItem) {
  const s = getState();
  const exists = s.menu.some((m) => m.id === item.id);
  const menu = exists ? s.menu.map((m) => (m.id === item.id ? item : m)) : [...s.menu, item];
  setState({ ...s, menu });
}

export function deleteMenuItem(id: string) {
  const s = getState();
  setState({ ...s, menu: s.menu.filter((m) => m.id !== id) });
}

export function toggleAvailability(id: string) {
  const s = getState();
  setState({ ...s, menu: s.menu.map((m) => (m.id === id ? { ...m, available: !m.available } : m)) });
}

export function toggleFavorite(id: string) {
  const s = getState();
  const favorites = s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id];
  setState({ ...s, favorites });
}

export function addReview(review: Omit<Review, "id" | "date">) {
  const s = getState();
  setState({ ...s, reviews: [{ ...review, id: `rv-${Date.now()}`, date: Date.now() }, ...s.reviews] });
}

export function setGuestName(name: string) {
  const s = getState();
  setState({ ...s, guestName: name });
}

// ---------- Helpers ----------

export function inr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export { seedMenu };
