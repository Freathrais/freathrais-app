"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { YoutubeIcon, InstagramIcon, TikTokIcon, GithubIcon } from "./SocialIcons";

const footerLinks = {
  "Keşfet": [
    { href: "/blog", label: "Blog" },
    { href: "/magaza", label: "Mağaza" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
  ],
  "Hesap": [
    { href: "/giris", label: "Giriş Yap" },
    { href: "/kayit", label: "Kayıt Ol" },
    { href: "/profil", label: "Profilim" },
    { href: "/favoriler", label: "Favoriler" },
  ],
  "Yasal": [
    { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
    { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
  ],
};

const socials = [
  { href: "https://youtube.com/@freathrais", Icon: YoutubeIcon, label: "YouTube", color: "#FF0000" },
  { href: "https://instagram.com/freathrais", Icon: InstagramIcon, label: "Instagram", color: "#E1306C" },
  { href: "https://tiktok.com/@freathrais", Icon: TikTokIcon, label: "TikTok", color: "#00FF00" },
  { href: "https://github.com/freathrais", Icon: GithubIcon, label: "GitHub", color: "#FFFFFF" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}>
                <span style={{ color: "white", fontWeight: 900 }}>F</span>
              </div>
              <span className="text-xl font-black tracking-tight" style={{ color: "var(--text)" }}>freathrais</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
              Kişisel marka, blog ve mağaza. Teknoloji, yaratıcılık ve topluluk.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -4,
                    color: s.color, 
                    borderColor: s.color,
                    boxShadow: `0 8px 20px -4px ${s.color}66`
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  <s.Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-subtle)" }}>{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm transition-all duration-150 hover:opacity-80"
                      style={{ color: "var(--text-muted)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>© 2026 Freathrais. Tüm hakları saklıdır.</p>
          <p className="text-xs flex items-center gap-2" style={{ color: "var(--text-subtle)" }}>
            📧 <a href="mailto:admin@freathrais.com" className="hover:opacity-80 transition-opacity" style={{ color: "var(--text-muted)" }}>admin@freathrais.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
