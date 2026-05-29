import type { StoreData, Category, Product } from "./types";

const STORE_KEY = "ms.store.v2";
const EDITOR_KEY = "ms.editor.unlocked";
const EDITOR_PIN = "139238";

const listeners = new Set<() => void>();
let cache: StoreData | null = null;

function notifyListeners() {
  for (const fn of listeners) fn();
}

function getDefaultData(): StoreData {
  return {
    storeName: "BestFinds",
    tagline: "Your private showroom",
    logoImage: null,
    categories: [
      { id: "cat-1", name: "Sneakers", coverImage: null },
      { id: "cat-2", name: "Outerwear", coverImage: null },
    ],
    products: [
      {
        id: "prod-1",
        categoryId: "cat-1",
        name: "Classic Low Grey",
        price: "€25",
        notes: "Best batch, TTS.",
        mainImage: null,
        extraImages: [],
        qcImages: [],
      },
      {
        id: "prod-2",
        categoryId: "cat-1",
        name: "Chunky Runner Black",
        price: "€32",
        notes: "Reflective hits. Size up half.",
        mainImage: null,
        extraImages: [],
        qcImages: [],
      },
      {
        id: "prod-3",
        categoryId: "cat-2",
        name: "Heavyweight Hoodie",
        price: "€21",
        notes: "1.2kg blank. Boxy fit.",
        mainImage: null,
        extraImages: [],
        qcImages: [],
      },
      {
        id: "prod-4",
        categoryId: "cat-2",
        name: "Cropped Puffer",
        price: "€42",
        notes: "Matte finish. Very warm.",
        mainImage: null,
        extraImages: [],
        qcImages: [],
      },
    ],
  };
}

export function loadStore(): StoreData {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      cache = JSON.parse(raw) as StoreData;
      return cache;
    }
  } catch (e) {
    console.error("Failed to load store data", e);
  }
  const defaults = getDefaultData();
  saveStore(defaults);
  return defaults;
}

function saveStore(data: StoreData) {
  cache = data;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    notifyListeners();
  } catch (e) {
    console.error("Failed to save store data", e);
  }
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Editor auth
export function isEditorUnlocked(): boolean {
  return localStorage.getItem(EDITOR_KEY) === "true";
}

export function unlockEditor(pin: string): boolean {
  if (pin === EDITOR_PIN) {
    localStorage.setItem(EDITOR_KEY, "true");
    return true;
  }
  return false;
}

export function lockEditor() {
  localStorage.removeItem(EDITOR_KEY);
}

// Mutations
export const actions = {
  updateSettings(update: Partial<Pick<StoreData, "storeName" | "tagline" | "logoImage">>) {
    const data = loadStore();
    saveStore({ ...data, ...update });
  },

  addCategory(cat: Omit<Category, "id">) {
    const data = loadStore();
    const newCat: Category = { ...cat, id: crypto.randomUUID() };
    saveStore({ ...data, categories: [...data.categories, newCat] });
    return newCat;
  },

  updateCategory(id: string, update: Partial<Omit<Category, "id">>) {
    const data = loadStore();
    saveStore({
      ...data,
      categories: data.categories.map((c) => (c.id === id ? { ...c, ...update } : c)),
    });
  },

  deleteCategory(id: string) {
    const data = loadStore();
    saveStore({
      ...data,
      categories: data.categories.filter((c) => c.id !== id),
      products: data.products.filter((p) => p.categoryId !== id),
    });
  },

  reorderCategories(ids: string[]) {
    const data = loadStore();
    const map = new Map(data.categories.map((c) => [c.id, c]));
    const reordered: Category[] = [];
    for (const id of ids) {
      const c = map.get(id);
      if (c) { reordered.push(c); map.delete(id); }
    }
    for (const c of map.values()) reordered.push(c);
    saveStore({ ...data, categories: reordered });
  },

  addProduct(prod: Omit<Product, "id">) {
    const data = loadStore();
    const newProd: Product = { ...prod, id: crypto.randomUUID() };
    saveStore({ ...data, products: [...data.products, newProd] });
    return newProd;
  },

  updateProduct(id: string, update: Partial<Omit<Product, "id">>) {
    const data = loadStore();
    saveStore({
      ...data,
      products: data.products.map((p) => (p.id === id ? { ...p, ...update } : p)),
    });
  },

  deleteProduct(id: string) {
    const data = loadStore();
    saveStore({ ...data, products: data.products.filter((p) => p.id !== id) });
  },

  reorderProducts(categoryId: string, ids: string[]) {
    const data = loadStore();
    const catProds = data.products.filter((p) => p.categoryId === categoryId);
    const map = new Map(catProds.map((p) => [p.id, p]));
    const reordered: Product[] = [];
    for (const id of ids) {
      const p = map.get(id);
      if (p) { reordered.push(p); map.delete(id); }
    }
    for (const p of map.values()) reordered.push(p);
    let idx = 0;
    const updated = data.products.map((p) =>
      p.categoryId === categoryId ? reordered[idx++] : p
    );
    saveStore({ ...data, products: updated });
  },
};
