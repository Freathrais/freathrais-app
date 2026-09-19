"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Clock, CheckCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import { YoutubeIcon, InstagramIcon, TikTokIcon, GithubIcon } from "@/components/SocialIcons";

const faqs = [
  { q: "Siparişim ne zaman kargoya verilir?", a: "Siparişler genellikle 1-2 iş günü içinde kargoya verilir. Kargo takip bilgisi e-posta ile iletilir." },
  { q: "İade politikanız nedir?", a: "14 gün içinde ücretsiz iade hakkınız vardır. Ürünün orijinal ambalajında olması yeterlidir." },
  { q: "İş birliği teklifleri için nasıl iletişime geçebilirim?", a: "İletişim formu veya doğrudan e-posta ile ulaşabilirsiniz. 24 saat içinde yanıt veriyoruz." },
  { q: "Blog yazısı önerebilir miyim?", a: "Evet! İletişim formundan konu seçiminde 'Diğer' seçeneğiyle önerinizi iletebilirsiniz." },
];

const socials = [
  { href: "https://youtube.com/@freathrais", Icon: YoutubeIcon, label: "YouTube", color: "#FF0000" },
  { href: "https://instagram.com/freathrais", Icon: InstagramIcon, label: "Instagram", color: "#E1306C" },
  { href: "https://tiktok.com/@freathrais", Icon: TikTokIcon, label: "TikTok", color: "#00FF00" },
  { href: "https://github.com/freathrais", Icon: GithubIcon, label: "GitHub", color: "#FFFFFF" },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3 mt-16">
      <h2 className="text-2xl font-black mb-6 text-center" style={{ color: "var(--text)" }}>Sık Sorulan Sorular</h2>
      {faqs.map((faq, i) => (
        <motion.div key={i} className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex items-center justify-between w-full px-6 py-4 text-left"
            style={{ color: "var(--text)" }}>
            <span className="text-sm font-semibold">{faq.q}</span>
            {openIndex === i ? <ChevronUp size={16} style={{ color: "var(--accent)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />}
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

export default function IletisimPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "Genel Bilgi", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1500));
    setStatus("success");
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: "0.75rem",
    padding: "12px 14px",
    width: "100%",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ paddingTop: "100px", paddingBottom: "80px" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-black mb-4 tracking-tight" style={{ color: "var(--text)" }}>İletişim</h1>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>Sorularınız için bize ulaşın. 24 saat içinde yanıt veriyoruz.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 relative p-8 rounded-3xl overflow-hidden"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-hero)", pointerEvents: "none" }} />
            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text)" }}>Bize Ulaşın</h2>
              <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
                Her türlü soru, öneri veya iş birliği teklifleri için hazırız.
              </p>
              <div className="space-y-5 mb-8">
                <a href="mailto:admin@freathrais.com" className="flex items-center gap-4 group">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                    style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--accent)" }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-subtle)" }}>E-posta</div>
                    <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>admin@freathrais.com</div>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--accent)" }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--text-subtle)" }}>Yanıt Süresi</div>
                    <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>Genellikle 24 saat içinde</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-8">
                {["Güvenli İletişim", "Hızlı Yanıt", "500+ Mutlu Müşteri"].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    <CheckCircle size={12} style={{ color: "var(--success)" }} /> {b}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {socials.map((s) => (
                  <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    whileHover={{ 
                      scale: 1.1, 
                      y: -4, 
                      color: s.color, 
                      borderColor: s.color,
                      boxShadow: `0 8px 20px -4px ${s.color}66`
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--glass)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}>
                    <s.Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-3 p-8 rounded-3xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }} className="text-center py-12">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ background: "rgba(34,197,94,0.1)" }}>
                    <CheckCircle size={40} style={{ color: "var(--success)" }} />
                  </motion.div>
                  <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text)" }}>Mesajınız İletildi!</h2>
                  <p className="mb-6" style={{ color: "var(--text-muted)" }}>En kısa sürede dönüş yapacağız.</p>
                  <button onClick={() => { setStatus("idle"); setForm({ name: "", email: "", topic: "Genel Bilgi", message: "" }); }}
                    className="px-6 py-3 rounded-2xl text-sm font-semibold"
                    style={{ background: "var(--glass)", border: "1px solid var(--border)", color: "var(--text)" }}>
                    Yeni Mesaj Gönder
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Mesaj Gönder</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Ad Soyad</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Adınız Soyadınız" required style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>E-posta</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="ornek@email.com" required className="!text-black" style={{...inputStyle, color: "#000"}}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Konu</label>
                    <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      style={{ ...inputStyle, cursor: "pointer" }}>
                      <option>Genel Bilgi</option>
                      <option>Sipariş / Kargo</option>
                      <option>İş Birliği</option>
                      <option>Diğer</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Mesaj</label>
                      <span className="text-xs" style={{ color: form.message.length > 450 ? "var(--danger)" : "var(--text-subtle)" }}>
                        {form.message.length}/500
                      </span>
                    </div>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Mesajınızı yazın..." required maxLength={500} rows={5}
                      style={{ ...inputStyle, resize: "none" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
                  </div>
                  <button type="submit" disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-105 disabled:opacity-60"
                    style={{ background: "var(--primary)", color: "var(--primary-fg)", boxShadow: "0 0 20px var(--glow)" }}>
                    {status === "loading" ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Send size={15} />}
                    {status === "loading" ? "Gönderiliyor..." : "Mesaj Gönder"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        <FAQ />
      </div>
    </div>
  );
}