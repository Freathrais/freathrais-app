"use client";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data/products";

interface Props {
  favorites: number[] | undefined;
}

export default function FavoritesTab({ favorites }: Props) {
  const router = useRouter();
  const favoriteProducts = products.filter((p) => favorites?.includes(p.id));

  return (
    <motion.div key="favorites" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Favorilerim</h2>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-16" style={{ background: "var(--bg)", borderRadius: "1rem", border: "1px dashed var(--border)" }}>
          <Heart size={48} className="mx-auto mb-4 opacity-20" style={{ color: "var(--text)" }} />
          <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Henüz favoriniz yok</h3>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Mağazadaki beğendiğiniz ürünleri favorilerinize ekleyebilirsiniz.</p>
          <button onClick={() => router.push("/magaza")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}>
            Mağazaya Git
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {favoriteProducts.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
