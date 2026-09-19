"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, ShoppingBag, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Blog",
    description: "Teknoloji, yaratıcılık ve kişisel gelişim üzerine derinlemesine yazılar.",
    href: "/blog",
    color: "var(--accent)",
  },
  {
    icon: ShoppingBag,
    title: "Mağaza",
    description: "Özenle seçilmiş ürünler, hızlı kargo ve güvenli ödeme.",
    href: "/magaza",
    color: "var(--primary)",
  },
  {
    icon: Users,
    title: "Topluluk",
    description: "Sosyal medyada binlerce takipçiyle büyüyen bir topluluk.",
    href: "/hakkimizda",
    color: "var(--accent)",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
};

export default function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: "var(--text)" }}>
            Ne sunuyoruz?
          </h2>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            İçerik üretiminden e-ticarete, tek platformda her şey.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} variants={itemVariants}>
                <Link href={f.href}>
                  <div
                    className="group p-8 rounded-3xl h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
                    style={{
                      background: "var(--gradient-card)",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--shadow)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                      style={{ background: "var(--surface)", color: f.color }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text)" }}>
                      {f.title}
                    </h3>
                    <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {f.description}
                    </p>
                    <div
                      className="flex items-center gap-1 mt-6 text-sm font-semibold transition-all duration-200 group-hover:gap-2"
                      style={{ color: "var(--accent)" }}
                    >
                      Keşfet <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
