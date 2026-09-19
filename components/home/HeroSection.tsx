"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, ShoppingBag, Star, TrendingUp, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-muted)",
            }}
          >
            <Zap size={14} style={{ color: "var(--accent)" }} />
            v3.0 — Yeni tasarım ile geldi!
            <ArrowRight size={14} />
          </motion.div>

          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 leading-none"
            style={{ color: "var(--text)" }}
          >
            freat
            <span style={{ color: "var(--accent)" }}>hrais</span>
          </h1>

          <p
            className="text-xl sm:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Blog, mağaza ve daha fazlası. Yaratıcılık, teknoloji ve topluluk burada buluşuyor.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/blog"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 hover:scale-105 hover:opacity-90"
              style={{
                background: "var(--primary)",
                color: "var(--primary-fg)",
                boxShadow: "0 0 30px var(--glow)",
              }}
            >
              <BookOpen size={18} />
              Blog'u Keşfet
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/magaza"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--glass)",
                border: "1px solid var(--glass-border)",
                color: "var(--text)",
              }}
            >
              <ShoppingBag size={18} />
              Mağazaya Git
            </Link>
          </div>
        </motion.div>

        {/* Floating badges */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute left-8 top-1/3 hidden lg:block"
        >
          <div
            className="px-4 py-3 rounded-2xl text-sm font-medium"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(12px)",
              color: "var(--text)",
            }}
          >
            <Star size={14} style={{ color: "#f59e0b", display: "inline", marginRight: "6px" }} />
            500+ Mutlu Müşteri
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="absolute right-8 top-1/3 hidden lg:block"
        >
          <div
            className="px-4 py-3 rounded-2xl text-sm font-medium"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(12px)",
              color: "var(--text)",
            }}
          >
            <TrendingUp size={14} style={{ color: "var(--accent)", display: "inline", marginRight: "6px" }} />
            120+ Blog Yazısı
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="w-1 h-2 rounded-full" style={{ background: "var(--text-muted)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
