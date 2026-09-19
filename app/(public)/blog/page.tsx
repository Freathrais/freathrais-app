"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Eye, ArrowRight, Search } from "lucide-react";
import { useState } from "react";

const posts = [
  { id: 1, title: "Next.js 14 ile Modern Web Geliştirme", excerpt: "App Router ile server components, streaming ve yeni fetch API'larını keşfedin.", category: "Teknoloji", date: "12 Eylül 2026", readTime: "5 dk", views: 4821, slug: "nextjs-14-modern-web" },
  { id: 2, title: "Firebase Auth: Google ve GitHub Entegrasyonu", excerpt: "Firebase Authentication ile sosyal giriş yöntemlerini adım adım nasıl kurarsınız.", category: "Backend", date: "10 Eylül 2026", readTime: "8 dk", views: 3654, slug: "firebase-auth-google-github" },
  { id: 3, title: "Framer Motion ile Animasyon Sanatı", excerpt: "Reaktif ve akıcı animasyonlar oluşturmak için Framer Motion'ın gücünü keşfedin.", category: "Frontend", date: "8 Eylül 2026", readTime: "6 dk", views: 2987, slug: "framer-motion-animasyon" },
  { id: 4, title: "Tailwind CSS v4 Neler Getiriyor?", excerpt: "Tailwind CSS'in yeni versiyonundaki @theme direktifi ve performans iyileştirmeleri.", category: "CSS", date: "5 Eylül 2026", readTime: "4 dk", views: 2100, slug: "tailwind-v4" },
  { id: 5, title: "TypeScript Strict Mode Best Practices", excerpt: "TypeScript'te any kullanmadan nasıl güvenli, tip-safe kod yazarsınız.", category: "TypeScript", date: "2 Eylül 2026", readTime: "7 dk", views: 1856, slug: "typescript-strict" },
  { id: 6, title: "Zustand ile State Yönetimi", excerpt: "Redux'a alternatif, hafif ve kullanımı kolay state management çözümü.", category: "React", date: "28 Ağustos 2026", readTime: "5 dk", views: 1623, slug: "zustand-state" },
];

const categories = ["Tümü", "Teknoloji", "Backend", "Frontend", "CSS", "TypeScript", "React"];
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Tümü" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ paddingTop: "100px", paddingBottom: "80px" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-black mb-4 tracking-tight" style={{ color: "var(--text)" }}>Blog</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Teknoloji, frontend geliştirme ve kişisel gelişim üzerine yazılar.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="relative max-w-xl mx-auto mb-8">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Yazılarda ara..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
        </motion.div>

        {/* Categories */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: activeCategory === cat ? "var(--primary)" : "var(--surface)",
                color: activeCategory === cat ? "var(--primary-fg)" : "var(--text-muted)",
                border: "1px solid var(--border)",
              }}>
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Posts Grid */}
        <motion.div variants={container} initial="hidden" animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <motion.div key={post.id} variants={item}>
              <Link href={`/blog/${post.slug}`}>
                <div className="group h-full p-6 rounded-3xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
                  {/* Category */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: "var(--glass)", color: "var(--accent)" }}>
                      {post.category}
                    </span>
                    <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-subtle)" }}>
                      <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                      <span className="flex items-center gap-1"><Eye size={10} /> {post.views.toLocaleString()}</span>
                    </div>
                  </div>
                  {/* Content */}
                  <h2 className="text-lg font-bold mb-3 leading-snug group-hover:opacity-80 transition-opacity"
                    style={{ color: "var(--text)" }}>
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                    {post.excerpt}
                  </p>
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{post.date}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2"
                      style={{ color: "var(--accent)" }}>
                      Oku <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: "var(--text-muted)" }}>Arama kriterlerinize uygun yazı bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
