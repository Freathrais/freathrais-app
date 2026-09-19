"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (e: unknown) {
      setError("Şifre sıfırlama bağlantısı gönderilemedi. E-posta adresini kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-md"
    >
      <div
        className="p-8 rounded-3xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text)" }}>
            Şifremi Unuttum
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            E-posta adresini gir, sana sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl mb-6 text-sm"
            style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(34,197,94,0.1)" }}>
              <CheckCircle2 size={32} style={{ color: "var(--success)" }} />
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Bağlantı Gönderildi!</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              {email} adresine şifre sıfırlama bağlantısı gönderdik. Lütfen gelen kutunu kontrol et.
            </p>
            <Link
              href="/giris"
              className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 hover:opacity-90 inline-block"
              style={{ background: "var(--primary)", color: "var(--primary-fg)", boxShadow: "0 0 20px var(--glow)" }}
            >
              Giriş Ekranına Dön
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: "var(--primary)",
                color: "var(--primary-fg)",
                boxShadow: "0 0 20px var(--glow)",
              }}
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : null}
              Sıfırlama Bağlantısı Gönder
            </button>
            
            <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
              Vazgeçtin mi?{" "}
              <Link href="/giris" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--accent)" }}>
                Giriş Ekranına Dön
              </Link>
            </p>
          </form>
        )}
      </div>
    </motion.div>
  );
}
