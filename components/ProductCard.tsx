"use client";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const { user, userData, toggleFavorite } = useAuth();
  const router = useRouter();

  const isFavorite = userData?.favorites?.includes(product.id) || false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // In case it's wrapped in a Link in the future
    if (!user) {
      router.push("/giris");
      return;
    }
    toggleFavorite(product.id);
  };

  return (
    <div className="group h-full rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
      {/* Image placeholder */}
      <div className="relative h-48 overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--surface-hover), var(--bg))" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag size={48} style={{ color: "var(--border-hover)", opacity: 0.5 }} />
        </div>
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: "var(--primary)", color: "var(--primary-fg)" }}>
              {product.badge}
            </span>
          </div>
        )}
        <button onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "var(--glass)", backdropFilter: "blur(8px)" }}>
          <Heart size={14} style={{ color: isFavorite ? "var(--danger)" : "var(--text-muted)", fill: isFavorite ? "var(--danger)" : "none" }} />
        </button>
      </div>
      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} style={{ color: i < Math.floor(product.rating) ? "#f59e0b" : "var(--border)", fill: i < Math.floor(product.rating) ? "#f59e0b" : "none" }} />
          ))}
          <span className="text-xs ml-1" style={{ color: "var(--text-subtle)" }}>({product.reviews})</span>
        </div>
        <h2 className="text-base font-bold mb-3" style={{ color: "var(--text)" }}>{product.name}</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black" style={{ color: "var(--text)" }}>
              ₺{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {product.discountPrice && (
              <span className="text-sm line-through" style={{ color: "var(--text-subtle)" }}>
                ₺{product.price.toLocaleString()}
              </span>
            )}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90 hover:scale-105"
            style={{ background: "var(--primary)", color: "var(--primary-fg)", boxShadow: "0 0 12px var(--glow)" }}>
            <ShoppingBag size={12} /> Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
