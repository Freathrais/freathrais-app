"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Edit2, Trash2, Eye, MoreHorizontal, BookOpen } from "lucide-react";

const posts = [
  { id: 1, title: "Next.js 14 ile Modern Web Geliştirme", status: "published", views: 4821, date: "12 Eyl 2026", category: "Teknoloji" },
  { id: 2, title: "Firebase Auth Entegrasyonu", status: "published", views: 3654, date: "10 Eyl 2026", category: "Backend" },
  { id: 3, title: "Framer Motion Animasyonlar", status: "draft", views: 0, date: "8 Eyl 2026", category: "Frontend" },
  { id: 4, title: "Tailwind CSS v4 Yenilikler", status: "published", views: 2100, date: "5 Eyl 2026", category: "CSS" },
  { id: 5, title: "TypeScript Best Practices", status: "scheduled", views: 0, date: "15 Eyl 2026", category: "TypeScript" },
];

const statusMap = {
  published: { label: "Yayında", color: "var(--success)", bg: "rgba(34,197,94,0.1)" },
  draft: { label: "Taslak", color: "var(--text-muted)", bg: "var(--glass)" },
  scheduled: { label: "Zamanlandı", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
};

export default function AdminBlogPage() {
  const [search, setSearch] = useState("");
  const filtered = posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Blog Yönetimi</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{posts.length} yazı toplam</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
          style={{ background: "var(--primary)", color: "var(--primary-fg)", boxShadow: "0 0 16px var(--glow)" }}>
          <Plus size={16} />
          Yeni Yazı
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Yazı ara..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }} />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
          <Filter size={14} /> Filtrele
        </button>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Başlık", "Kategori", "Durum", "Görüntülenme", "Tarih", "İşlemler"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-subtle)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((post, i) => {
                const st = statusMap[post.status as keyof typeof statusMap];
                return (
                  <motion.tr key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="group transition-colors hover:bg-[var(--surface-hover)]"
                    style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "var(--glass)" }}>
                          <BookOpen size={14} style={{ color: "var(--accent)" }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{post.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--glass)", color: "var(--text-muted)" }}>
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--text-muted)" }}>
                      {post.views > 0 ? post.views.toLocaleString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--text-muted)" }}>{post.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--text-muted)" }}><Eye size={14} /></button>
                        <button className="p-1.5 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--accent)" }}><Edit2 size={14} /></button>
                        <button className="p-1.5 rounded-lg transition-all hover:opacity-70" style={{ color: "var(--danger)" }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
