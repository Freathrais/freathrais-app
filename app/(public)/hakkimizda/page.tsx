"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Phone, Mail, Heart } from "lucide-react";
import { YoutubeIcon, InstagramIcon, TikTokIcon, GithubIcon } from "@/components/SocialIcons";

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count.toLocaleString("tr-TR")}</span>;
}

const stats = [
  { label: "Mutlu Müşteri", value: 500, suffix: "+" },
  { label: "Blog Yazısı", value: 120, suffix: "+" },
  { label: "Yıl Deneyim", value: 5, suffix: "" },
  { label: "Ürün Satıldı", value: 2000, suffix: "+" },
];

const socials = [
  { href: "https://youtube.com/@freathrais", Icon: YoutubeIcon, label: "YouTube", color: "#FF0000" },
  { href: "https://instagram.com/freathrais", Icon: InstagramIcon, label: "Instagram", color: "#E1306C" },
  { href: "https://tiktok.com/@freathrais", Icon: TikTokIcon, label: "TikTok", color: "#25F4EE" },
  { href: "https://github.com/freathrais", Icon: GithubIcon, label: "GitHub", color: "#FFFFFF" },
];

const timeline = [
  { year: "2021", title: "Başlangıç", desc: "Kişisel blog ile dijital yolculuk başladı." },
  { year: "2022", title: "Büyüme", desc: "YouTube kanalı ve sosyal medya hesapları açıldı." },
  { year: "2023", title: "Mağaza", desc: "E-ticaret modülü ile mağaza hayata geçirildi." },
  { year: "2024", title: "Topluluk", desc: "10.000+ takipçi ile aktif bir topluluk oluştu." },
  { year: "2026", title: "Yeni Platform", desc: "Freathrais v3.0 ile tamamen yenilendi!" },
];

export default function HakkimizdaPage() {
  return (
    <div style={{ paddingTop: "100px", paddingBottom: "80px" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-24">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
            style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
          >
            <Heart size={14} style={{ color: "var(--danger)" }} />
            Bizi tanıyın
          </div>
          <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight" style={{ color: "var(--text)" }}>
            Hakkımızda
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Freathrais, teknoloji tutkunları için blog, mağaza ve topluluk platformu.
            Yaratıcılık, kalite ve açık kaynak değerlerimiz üzerine kurulu.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-3xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-4xl font-black mb-2" style={{ color: "var(--text)" }}>
                <CountUp end={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24">
          <h2 className="text-3xl font-black mb-12 text-center" style={{ color: "var(--text)" }}>
            Yolculuğumuz
          </h2>
          <div className="relative">
            <div
              className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px"
              style={{ background: "var(--border)" }}
            />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={"flex items-center gap-8 " + (i % 2 === 0 ? "flex-row" : "flex-row-reverse")}
                >
                  <div className="flex-1" style={{ textAlign: i % 2 === 0 ? "right" : "left" }}>
                    <div
                      className="inline-block p-5 rounded-2xl"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <div className="text-sm font-black mb-1" style={{ color: "var(--accent)" }}>{t.year}</div>
                      <div className="text-base font-bold mb-1" style={{ color: "var(--text)" }}>{t.title}</div>
                      <div className="text-sm" style={{ color: "var(--text-muted)" }}>{t.desc}</div>
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 z-10"
                    style={{ background: "var(--accent)", boxShadow: "0 0 12px var(--glow)" }}
                  />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl font-black mb-4 text-center" style={{ color: "var(--text)" }}>
            Sosyal Medyada Biz
          </h2>
          <p className="text-center mb-10" style={{ color: "var(--text-muted)" }}>
            Her platformda aktif içerik üretiyoruz.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.03, 
                  y: -4, 
                  borderColor: s.color, 
                  boxShadow: `0 8px 25px -5px ${s.color}40` 
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl group"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--glass)", color: "var(--text-muted)" }}
                >
                  <motion.div style={{ color: "inherit" }} whileHover={{ color: s.color }}>
                    <s.Icon size={22} />
                  </motion.div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm" style={{ color: "inherit" }}><motion.span whileHover={{ color: s.color }}>{s.label}</motion.span></div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-subtle)" }}>@freathrais</div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-12 rounded-3xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-3xl font-black mb-4" style={{ color: "var(--text)" }}>
            Bize Ulaşın
          </h2>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            Sorularınız, önerileriniz veya iş birliği teklifleri için buradayız.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/iletisim"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background: "var(--primary)", color: "var(--primary-fg)", boxShadow: "0 0 20px var(--glow)" }}
            >
              <Mail size={16} />
              İletişim Formu
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}