"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { YoutubeIcon, InstagramIcon, TikTokIcon, GithubIcon } from "@/components/SocialIcons";

const socials = [
  { href: "https://youtube.com/@freathrais", icon: YoutubeIcon, label: "YouTube", followers: "10K+", color: "#FF0000" },
  { href: "https://instagram.com/freathrais", icon: InstagramIcon, label: "Instagram", followers: "5K+", color: "#E1306C" },
  { href: "https://tiktok.com/@freathrais", icon: TikTokIcon, label: "TikTok", followers: "8K+", color: "#00FF00" },
  { href: "https://github.com/freathrais", icon: GithubIcon, label: "GitHub", followers: "500+", color: "#FFFFFF" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
};

export default function SocialMediaSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: "var(--text)" }}>
            Sosyal Medyada Bizi Takip Edin
          </h2>
          <p style={{ color: "var(--text-muted)" }}>Her platformda aktif içerik üretiyoruz.</p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {socials.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03, 
                  y: -4, 
                  borderColor: s.color, 
                  boxShadow: `0 8px 25px -5px ${s.color}40, inset 0 0 10px ${s.color}11` 
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group flex flex-col items-center gap-3 p-6 rounded-3xl"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text)"
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ 
                    background: "var(--glass)", 
                    color: "var(--text-muted)" 
                  }}
                >
                  <motion.div style={{ color: "inherit" }} whileHover={{ color: s.color, scale: 1.1 }}>
                    <Icon />
                  </motion.div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm" style={{ color: "inherit" }}>
                    <motion.span whileHover={{ color: s.color }}>{s.label}</motion.span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>
                    {s.followers} takipçi
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
