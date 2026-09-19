"use client";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, ShoppingBag, BookOpen,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, Truck, XCircle,
  AlertTriangle, Eye, Star,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";

const salesData = [
  { month: "Mar", sales: 4200, orders: 38 },
  { month: "Nis", sales: 5800, orders: 52 },
  { month: "May", sales: 4900, orders: 44 },
  { month: "Haz", sales: 7200, orders: 65 },
  { month: "Tem", sales: 8900, orders: 78 },
  { month: "Ağu", sales: 11200, orders: 96 },
  { month: "Eyl", sales: 9800, orders: 84 },
];

const statsCards = [
  {
    title: "Toplam Satış (Bu Ay)",
    value: "₺9,842",
    change: "+18.2%",
    positive: true,
    icon: TrendingUp,
    color: "var(--accent)",
    bg: "rgba(99,102,241,0.1)",
  },
  {
    title: "Toplam Sipariş",
    value: "84",
    change: "+7.4%",
    positive: true,
    icon: ShoppingBag,
    color: "var(--success)",
    bg: "rgba(34,197,94,0.1)",
  },
  {
    title: "Aktif Kullanıcı",
    value: "1,284",
    change: "+24.1%",
    positive: true,
    icon: Users,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  {
    title: "Blog Görüntülenme",
    value: "28,491",
    change: "-3.2%",
    positive: false,
    icon: Eye,
    color: "var(--danger)",
    bg: "rgba(239,68,68,0.1)",
  },
];

const recentOrders = [
  { id: "#1084", customer: "Ali Veli", amount: "₺299", status: "delivered", product: "Ürün A" },
  { id: "#1083", customer: "Ayşe Kaya", amount: "₺149", status: "shipping", product: "Ürün B" },
  { id: "#1082", customer: "Mehmet Öz", amount: "₺89", status: "pending", product: "Ürün C" },
  { id: "#1081", customer: "Fatma Ak", amount: "₺520", status: "cancelled", product: "Ürün D" },
  { id: "#1080", customer: "Can Demir", amount: "₺175", status: "delivered", product: "Ürün E" },
];

const topPosts = [
  { title: "Next.js 14 ile Modern Web", views: 4821, likes: 142 },
  { title: "Firebase Auth Entegrasyonu", views: 3654, likes: 98 },
  { title: "Framer Motion Animasyonlar", views: 2987, likes: 76 },
];

const statusMap = {
  delivered: { label: "Teslim Edildi", icon: CheckCircle, color: "var(--success)" },
  shipping: { label: "Kargoda", icon: Truck, color: "#f59e0b" },
  pending: { label: "Bekliyor", icon: Clock, color: "var(--text-muted)" },
  cancelled: { label: "İptal", icon: XCircle, color: "var(--danger)" },
};

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{value: number}>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
        <p className="font-semibold mb-1">{label}</p>
        <p style={{ color: "var(--accent)" }}>₺{payload[0]?.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Alert banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm"
        style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}>
        <AlertTriangle size={15} />
        <span>3 onay bekleyen yorum var. <a href="/admin/yorumlar" className="underline font-semibold">İncele →</a></span>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={container} initial="hidden" animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} variants={item}
              className="p-6 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                  <Icon size={18} style={{ color: card.color }} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-semibold"
                  style={{ color: card.positive ? "var(--success)" : "var(--danger)" }}>
                  {card.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {card.change}
                </span>
              </div>
              <p className="text-2xl font-black mb-1" style={{ color: "var(--text)" }}>{card.value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{card.title}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="xl:col-span-2 p-6 rounded-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>Satış Grafiği</h2>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--glass)", color: "var(--text-muted)" }}>Son 7 Ay</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sales" stroke="var(--accent)" strokeWidth={2} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>Sipariş Adedi</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="xl:col-span-3 rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>Son Siparişler</h2>
            <a href="/admin/siparisler" className="text-xs font-semibold" style={{ color: "var(--accent)" }}>Tümünü Gör →</a>
          </div>
          <div className="divide-y" style={{ "--divide-color": "var(--border)" } as React.CSSProperties}>
            {recentOrders.map((order) => {
              const st = statusMap[order.status as keyof typeof statusMap];
              const StatusIcon = st.icon;
              return (
                <div key={order.id} className="flex items-center justify-between px-6 py-3.5">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{order.id} — {order.customer}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{order.product}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{order.amount}</span>
                    <span className="flex items-center gap-1 text-xs font-medium" style={{ color: st.color }}>
                      <StatusIcon size={12} /> {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Posts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="xl:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>En Çok Okunan</h2>
          </div>
          <div className="p-4 space-y-3">
            {topPosts.map((post, i) => (
              <div key={post.title} className="p-4 rounded-xl" style={{ background: "var(--bg)" }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold leading-snug" style={{ color: "var(--text)" }}>
                    {i + 1}. {post.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1"><Eye size={11} /> {post.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Star size={11} style={{ color: "#f59e0b" }} /> {post.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
