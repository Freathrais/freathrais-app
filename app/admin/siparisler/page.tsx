"use client";
import { motion } from "framer-motion";
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";

const orders = [
  { id: "#1084", customer: "Ali Veli", amount: "₺299", status: "delivered", date: "13 Eyl 2026", items: 2 },
  { id: "#1083", customer: "Ayşe Kaya", amount: "₺149", status: "shipping", date: "12 Eyl 2026", items: 1 },
  { id: "#1082", customer: "Mehmet Öz", amount: "₺89", status: "pending", date: "11 Eyl 2026", items: 3 },
  { id: "#1081", customer: "Fatma Ak", amount: "₺520", status: "cancelled", date: "10 Eyl 2026", items: 4 },
  { id: "#1080", customer: "Can Demir", amount: "₺175", status: "delivered", date: "9 Eyl 2026", items: 1 },
];
const statusMap = {
  delivered: { label: "Teslim Edildi", icon: CheckCircle, color: "var(--success)", bg: "rgba(34,197,94,0.1)" },
  shipping: { label: "Kargoda", icon: Truck, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  pending: { label: "Bekliyor", icon: Clock, color: "var(--text-muted)", bg: "var(--glass)" },
  cancelled: { label: "İptal", icon: XCircle, color: "var(--danger)", bg: "rgba(239,68,68,0.1)" },
};
export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Sipariş Yönetimi</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{orders.length} sipariş</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Sipariş", "Müşteri", "Tutar", "Ürün Adedi", "Durum", "Tarih"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-subtle)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const st = statusMap[order.status as keyof typeof statusMap];
                const Icon = st.icon;
                return (
                  <tr key={order.id} className="hover:bg-[var(--surface-hover)]"
                    style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="px-6 py-4 text-sm font-mono font-semibold" style={{ color: "var(--accent)" }}>{order.id}</td>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "var(--text)" }}>{order.customer}</td>
                    <td className="px-6 py-4 text-sm font-bold" style={{ color: "var(--text)" }}>{order.amount}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--text-muted)" }}>{order.items}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: st.bg, color: st.color }}>
                        <Icon size={10} /> {st.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--text-muted)" }}>{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
