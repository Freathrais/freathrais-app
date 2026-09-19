"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 rounded-3xl relative overflow-hidden"
          style={{
            background: "var(--gradient-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.5 }} />
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: "var(--text)" }}>
              Topluluğa Katıl
            </h2>
            <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
              Ücretsiz hesap oluştur, blog yaz, alışveriş yap.
            </p>
            <Link
              href="/kayit"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:scale-105"
              style={{
                background: "var(--primary)",
                color: "var(--primary-fg)",
                boxShadow: "0 0 40px var(--glow)",
              }}
            >
              Hemen Başla
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
