export interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice: number | null;
  rating: number;
  reviews: number;
  category: string;
  badge: string | null;
  slug: string;
}

export const products: Product[] = [
  { id: 1, name: "Premium Ürün A", price: 299, discountPrice: 249, rating: 4.8, reviews: 124, category: "Kategori 1", badge: "Bestseller", slug: "premium-urun-a" },
  { id: 2, name: "Özel Ürün B", price: 149, discountPrice: null, rating: 4.6, reviews: 87, category: "Kategori 2", badge: null, slug: "ozel-urun-b" },
  { id: 3, name: "Koleksiyon C", price: 399, discountPrice: 329, rating: 4.9, reviews: 203, category: "Kategori 1", badge: "Yeni", slug: "koleksiyon-c" },
  { id: 4, name: "Limited D", price: 89, discountPrice: null, rating: 4.4, reviews: 56, category: "Kategori 3", badge: "Sınırlı", slug: "limited-d" },
  { id: 5, name: "Premium E", price: 520, discountPrice: 450, rating: 4.7, reviews: 92, category: "Kategori 2", badge: null, slug: "premium-e" },
  { id: 6, name: "Özel Seri F", price: 175, discountPrice: null, rating: 4.5, reviews: 68, category: "Kategori 3", badge: "Yeni", slug: "ozel-seri-f" },
];
