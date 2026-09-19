"use client";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, AlertTriangle } from "lucide-react";

const products = [
  { id: 1, name: "Ürün A", price: "₺299", stock: 45, status: "active", category: "Kategori 1" },
  { id: 2, name: "Ürün B", price: "₺149", stock: 3, status: "active", category: "Kategori 2" },
  { id: 3, name: "Ürün C", price: "₺89", stock: 0, status: "outOfStock", category: "Kategori 1" },
  { id: 4, name: "Ürün D", price: "₺520", stock: 12, status: "active", category: "Kategori 3" },
];
export default function AdminMagazaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Mağaza Yönetimi</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{products.length} ürün</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "var(--primary)", color: "var(--primary-fg)", boxShadow: "0 0 16px var(--glow)" }}>
          <Plus size={16} /> Yeni Ürün
        </button>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Ürün", "Kategori", "Fiyat", "Stok", "Durum", "İşlemler"].map(h => (
                <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-subtle)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="hover:bg-[var(--surface-hover)]"
                style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="px-6 py-4 text-sm font-medium" style={{ color: "var(--text)" }}>{product.name}</td>
                <td className="px-6 py-4 text-xs">
                  <span className="px-2.5 py-1 rounded-full" style={{ background: "var(--glass)", color: "var(--text-muted)" }}>
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold" style={{ color: "var(--text)" }}>{product.price}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-sm"
                    style={{ color: product.stock <= 5 ? "var(--danger)" : "var(--text-muted)" }}>
                    {product.stock <= 5 && product.stock > 0 && <AlertTriangle size={12} />}
                    {product.stock === 0 ? "Tükendi" : product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: product.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      color: product.status === "active" ? "var(--success)" : "var(--danger)",
                    }}>
                    {product.status === "active" ? "Aktif" : "Tükendi"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--accent)" }}><Edit2 size={14} /></button>
                    <button className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--danger)" }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
