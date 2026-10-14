"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useCart, MAX_QTY } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const FREE_SHIPPING_LIMIT = 500;
const fmt = (n: number) => `₺${n.toLocaleString("tr-TR")}`;

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    savings,
    isOpen,
    lastAddedId,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) setNotice(null);
  }, [isOpen]);

  const remaining = Math.max(FREE_SHIPPING_LIMIT - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_LIMIT) * 100, 100);

  const handleCheckout = () => {
    if (!user) {
      closeCart();
      router.push("/giris");
      return;
    }
    setNotice("Ödeme altyapısı çok yakında aktif olacak. Sepetiniz sizin için saklanıyor.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={closeCart}
            aria-hidden="true"
          />
          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Alışveriş sepeti"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[440px] flex flex-col"
            style={{
              background: "var(--bg)",
              borderLeft: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, var(--primary), var(--accent))",
                    color: "var(--primary-fg)",
                    boxShadow: "0 0 20px var(--glow)",
                  }}
                >
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-black leading-tight" style={{ color: "var(--text)" }}>
                    Sepetim
                  </h2>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {itemCount === 0 ? "Henüz ürün yok" : `${itemCount} ürün`}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                aria-label="Sepeti kapat"
                className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{ background: "var(--glass)", color: "var(--text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <ShoppingBag size={40} style={{ color: "var(--border-hover)" }} />
                </motion.div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
                  Sepetin boş
                </h3>
                <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--text-muted)" }}>
                  Mağazadaki özenle seçilmiş ürünlere göz atıp beğendiklerini sepete ekleyebilirsin.
                </p>
                <Link
                  href="/magaza"
                  onClick={closeCart}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-fg)",
                    boxShadow: "0 0 16px var(--glow)",
                  }}
                >
                  Alışverişe Başla <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <>
                {/* Free shipping progress */}
                <div className="px-6 pt-5">
                  <div
                    className="rounded-2xl p-4"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center gap-2 mb-3 text-xs font-medium" style={{ color: "var(--text)" }}>
                      <Truck size={14} style={{ color: "var(--accent)" }} />
                      {remaining === 0
                        ? "Tebrikler! Ücretsiz kargo kazandın 🎉"
                        : `Ücretsiz kargo için ${fmt(remaining)} daha ekle`}
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{ background: "linear-gradient(90deg, var(--accent), var(--primary))" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Items */}
                <ul className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map(({ product, quantity }) => {
                      const unit = product.discountPrice ?? product.price;
                      const highlighted = product.id === lastAddedId;
                      return (
                        <motion.li
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 60 }}
                          transition={{ duration: 0.25 }}
                          className="flex gap-4 p-3 rounded-2xl"
                          style={{
                            background: "var(--surface)",
                            border: `1px solid ${highlighted ? "var(--accent)" : "var(--border)"}`,
                          }}
                        >
                          <div
                            className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, var(--surface-hover), var(--bg))" }}
                          >
                            <ShoppingBag size={26} style={{ color: "var(--border-hover)", opacity: 0.6 }} />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>
                                  {product.name}
                                </p>
                                <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
                                  {product.category}
                                </p>
                              </div>
                              <button
                                onClick={() => removeItem(product.id)}
                                aria-label={`${product.name} ürününü kaldır`}
                                className="p-1.5 rounded-lg transition-all hover:scale-110"
                                style={{ color: "var(--danger)" }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div
                                className="flex items-center rounded-lg overflow-hidden"
                                style={{ border: "1px solid var(--border)" }}
                              >
                                <button
                                  onClick={() => updateQuantity(product.id, quantity - 1)}
                                  aria-label="Azalt"
                                  className="w-7 h-7 flex items-center justify-center transition-colors hover:opacity-70"
                                  style={{ color: "var(--text)" }}
                                >
                                  <Minus size={12} />
                                </button>
                                <span
                                  className="w-8 text-center text-sm font-semibold"
                                  style={{ color: "var(--text)" }}
                                >
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(product.id, quantity + 1)}
                                  disabled={quantity >= MAX_QTY}
                                  aria-label="Artır"
                                  className="w-7 h-7 flex items-center justify-center transition-colors hover:opacity-70 disabled:opacity-30"
                                  style={{ color: "var(--text)" }}
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black" style={{ color: "var(--text)" }}>
                                  {fmt(unit * quantity)}
                                </p>
                                {product.discountPrice && (
                                  <p className="text-xs line-through" style={{ color: "var(--text-subtle)" }}>
                                    {fmt(product.price * quantity)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                  <li className="pt-1">
                    <button
                      onClick={clearCart}
                      className="text-xs underline-offset-2 hover:underline"
                      style={{ color: "var(--text-subtle)" }}
                    >
                      Sepeti temizle
                    </button>
                  </li>
                </ul>

                {/* Summary */}
                <div
                  className="px-6 py-5 space-y-3"
                  style={{ borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }}
                >
                  {savings > 0 && (
                    <div
                      className="flex items-center justify-between text-sm"
                      style={{ color: "var(--success)" }}
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={14} /> İndirim kazancın
                      </span>
                      <span className="font-semibold">-{fmt(savings)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      Ara toplam
                    </span>
                    <span className="text-2xl font-black" style={{ color: "var(--text)" }}>
                      {fmt(subtotal)}
                    </span>
                  </div>
                  <AnimatePresence>
                    {notice && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs rounded-xl px-3 py-2.5"
                        style={{
                          background: "var(--glass)",
                          border: "1px solid var(--glass-border)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {notice}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "var(--primary)",
                      color: "var(--primary-fg)",
                      boxShadow: "0 0 20px var(--glow)",
                    }}
                  >
                    {user ? "Ödemeye Geç" : "Giriş Yap ve Ödemeye Geç"} <ArrowRight size={15} />
                  </button>
                  <Link
                    href="/magaza"
                    onClick={closeCart}
                    className="block text-center text-sm font-medium py-1 hover:opacity-80"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Alışverişe devam et
                  </Link>
                  <p
                    className="flex items-center justify-center gap-1.5 text-xs"
                    style={{ color: "var(--text-subtle)" }}
                  >
                    <ShieldCheck size={12} /> Güvenli ödeme · Hızlı kargo
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
