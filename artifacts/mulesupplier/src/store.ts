import type { StoreData, Category, Product } from "./types";

const STORE_KEY = "mule-store-v1";
const EDITOR_KEY = "mule-editor-unlocked";
export const EDITOR_PIN = "139238";

function defaultStore(): StoreData {
  return {
    storeName: "My Showroom",
    tagline: "Premium finds, curated for you",
    logoImage: null,
    categories: [],
    products: [],
  };
}

function loadStore(): StoreData {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultStore();
    return JSON.parse(raw) as StoreData;
  } catch {
    return defaultStore();
  }
}

function saveStore(data: StoreData) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
  storeCache = data;
  listeners.forEach((l) => l());
}

const listeners = new Set<() => void>();

let storeCache: StoreData | null = null;

export function subscribeStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getStore(): StoreData {
  if (!storeCache) {
    storeCache = loadStore();
  }
  return storeCache;
}

// ─── Store info ──────────────────────────────────────────────────────────────

export function updateStoreInfo(patch: Partial<Pick<StoreData, "storeName" | "tagline" | "logoImage">>) {
  const data = loadStore();
  saveStore({ ...data, ...patch });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function addCategory(name: string, coverImage: string | null = null): Category {
  const data = loadStore();
  const cat: Category = { id: crypto.randomUUID(), name, coverImage };
  saveStore({ ...data, categories: [...data.categories, cat] });
  return cat;
}

export function updateCategory(id: string, patch: Partial<Omit<Category, "id">>) {
  const data = loadStore();
  saveStore({
    ...data,
    categories: data.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
  });
}

export function deleteCategory(id: string) {
  const data = loadStore();
  saveStore({
    ...data,
    categories: data.categories.filter((c) => c.id !== id),
    products: data.products.filter((p) => p.categoryId !== id),
  });
}

export function reorderCategories(newOrder: Category[]) {
  const data = loadStore();
  saveStore({ ...data, categories: newOrder });
}

// ─── Products ────────────────────────────────────────────────────────────────

export function addProduct(categoryId: string, input: Omit<Product, "id" | "categoryId">): Product {
  const data = loadStore();
  const product: Product = { id: crypto.randomUUID(), categoryId, ...input };
  saveStore({ ...data, products: [...data.products, product] });
  return product;
}

export function updateProduct(id: string, patch: Partial<Omit<Product, "id" | "categoryId">>) {
  const data = loadStore();
  saveStore({
    ...data,
    products: data.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  });
}

export function deleteProduct(id: string) {
  const data = loadStore();
  saveStore({ ...data, products: data.products.filter((p) => p.id !== id) });
}

export function reorderProducts(categoryId: string, newOrder: Product[]) {
  const data = loadStore();
  const others = data.products.filter((p) => p.categoryId !== categoryId);
  saveStore({ ...data, products: [...others, ...newOrder] });
}

// ─── Editor mode ─────────────────────────────────────────────────────────────

export function isEditorUnlocked(): boolean {
  return localStorage.getItem(EDITOR_KEY) === "true";
}

export function setEditorUnlocked(value: boolean) {
  if (value) {
    localStorage.setItem(EDITOR_KEY, "true");
  } else {
    localStorage.removeItem(EDITOR_KEY);
  }
  listeners.forEach((l) => l());
}
