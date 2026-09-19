"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const recentPosts = [
  { title: "Next.js 14 ile Modern Web Geliştirme", category: "Teknoloji", date: "12 Eylül 2026", readTime: "5 dk" },
  { title: "Firebase Auth: Google ve GitHub Entegrasyonu", category: "Backend", date: "10 Eylül 2026", readTime: "8 dk" },
  { title: "Framer Motion ile Animasyon Sanatı", category: "Frontend", date: "8 Eylül 2026", readTime: "6 dk" },
];

export default function RecentPostsSection() {
  return (
    <section className="py-24" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black"
            style={{ color: "var(--text)" }}
          >
            Son Yazılar
          </motion.h2>
          <Link
            href="/blog"
            className="flex items-center gap-1 text-sm font-semibold transition-all duration-200 hover:gap-2"
            style={{ color: "var(--accent)" }}
          >
            Tümünü Gör <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {recentPosts.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href="/blog">
                <div
                  className="group flex items-center justify-between p-6 rounded-2xl transition-all duration-200 hover:scale-[1.01]"
                  style={{
                    background: "var(--glass)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: "var(--surface)", color: "var(--accent)" }}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
                        {post.date} · {post.readTime} okuma
                      </span>
                    </div>
                    <h3
                      className="text-lg font-semibold transition-all duration-200 group-hover:opacity-80"
                      style={{ color: "var(--text)" }}
                    >
                      {post.title}
                    </h3>
                  </div>
                  <ArrowRight
                    size={18}
                    className="ml-4 transition-all duration-200 group-hover:translate-x-1"
                    style={{ color: "var(--text-muted)" }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
