export interface Category {
  id: string;
  name: string;
  coverImage: string | null;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: string;
  notes: string;
  mainImage: string | null;
  extraImages: string[];
  qcImages: string[];
}

export interface StoreData {
  storeName: string;
  tagline: string;
  logoImage: string | null;
  categories: Category[];
  products: Product[];
}
