"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Globe, Bell, Shield, Palette } from "lucide-react";
import { YoutubeIcon, InstagramIcon, GithubIcon } from "@/components/SocialIcons";

function SettingCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-5" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
        <Icon size={16} style={{ color: "var(--accent)" }} />
        <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", prefix }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; prefix?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</label>
      <div className="flex">
        {prefix && (
          <span className="flex items-center px-3 rounded-l-xl text-sm border-r-0"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-subtle)", borderRight: "none" }}>
            {prefix}
          </span>
        )}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={`flex-1 px-3 py-2.5 text-sm outline-none ${prefix ? "rounded-r-xl" : "rounded-xl"}`}
          style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
          onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [social, setSocial] = useState({
    youtube: "freathrais", instagram: "freathrais", tiktok: "freathrais", github: "freathrais",
  });
  const [seo, setSeo] = useState({
    siteTitle: "Freathrais — Blog & Mağaza",
    description: "Kişisel marka, blog ve mağaza. Teknoloji, yaratıcılık ve topluluk.",
    phone: "05380829746",
  });
  const [maintenance, setMaintenance] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Site Ayarları</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Genel site yapılandırması</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
          style={{
            background: saved ? "var(--success)" : "var(--primary)",
            color: saved ? "#fff" : "var(--primary-fg)",
            boxShadow: "0 0 16px var(--glow)",
          }}>
          <Save size={15} />
          {saved ? "Kaydedildi!" : "Kaydet"}
        </button>
      </div>

      {/* SEO Settings */}
      <SettingCard title="SEO & Genel" icon={Globe}>
        <div className="space-y-4">
          <InputField label="Site Başlığı" value={seo.siteTitle} onChange={(v) => setSeo({ ...seo, siteTitle: v })} placeholder="Site başlığı..." />
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Meta Açıklama</label>
            <textarea value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
              rows={3}
              onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
          </div>
          <InputField label="Telefon Numarası" value={seo.phone} onChange={(v) => setSeo({ ...seo, phone: v })} placeholder="05XXXXXXXXX" type="tel" />
        </div>
      </SettingCard>

      {/* Social Links */}
      <SettingCard title="Sosyal Medya Linkleri" icon={Globe}>
        <div className="space-y-4">
          <InputField label="YouTube" value={social.youtube} onChange={(v) => setSocial({ ...social, youtube: v })} placeholder="kanal-adi" prefix="youtube.com/@" />
          <InputField label="Instagram" value={social.instagram} onChange={(v) => setSocial({ ...social, instagram: v })} placeholder="kullanici-adi" prefix="instagram.com/" />
          <InputField label="TikTok" value={social.tiktok} onChange={(v) => setSocial({ ...social, tiktok: v })} placeholder="kullanici-adi" prefix="tiktok.com/@" />
          <InputField label="GitHub" value={social.github} onChange={(v) => setSocial({ ...social, github: v })} placeholder="kullanici-adi" prefix="github.com/" />
        </div>
      </SettingCard>

      {/* Maintenance Mode */}
      <SettingCard title="Bakım Modu" icon={Shield}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Bakım Modu</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Aktif edildiğinde ziyaretçiler bakım sayfasını görür.
            </p>
          </div>
          <button onClick={() => setMaintenance(!maintenance)}
            className="relative w-12 h-6 rounded-full transition-all duration-300"
            style={{ background: maintenance ? "var(--accent)" : "var(--border)" }}>
            <motion.div animate={{ x: maintenance ? 24 : 2 }} transition={{ duration: 0.2 }}
              className="absolute top-1 w-4 h-4 rounded-full"
              style={{ background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
          </button>
        </div>
        {maintenance && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-xs mt-3 px-3 py-2 rounded-xl"
            style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)" }}>
            ⚠️ Bakım modu aktif — site ziyaretçilere kapalı
          </motion.p>
        )}
      </SettingCard>
    </div>
  );
}
