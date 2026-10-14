"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AtSign, AlertCircle, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UsernameField, { useUsernameStatus } from "./UsernameField";

/**
 * Giriş yapmış ama kullanıcı adı olmayan herkes için tüm siteyi kaplayan zorunlu ekran.
 * Kullanıcı adı oluşturulmadan site kullanılamaz; vazgeçilirse yeni hesap silinir.
 */
export default function UsernameGate() {
  const { needsUsername, isFreshAccount, user, claimUsername, cancelRegistration } = useAuth();
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { status, message } = useUsernameStatus(value);

  useEffect(() => {
    if (!needsUsername) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [needsUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "available" || submitting) return;
    setError("");
    setSubmitting(true);
    try {
      await claimUsername(value);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("username-taken")) setError("Bu kullanıcı adı az önce başkası tarafından alındı. Lütfen başka bir ad seçin.");
      else if (msg.includes("username-invalid")) setError("Geçersiz kullanıcı adı.");
      else setError("Kullanıcı adı oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setSubmitting(true);
    try {
      await cancelRegistration();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {needsUsername && (
        <motion.div
          key="username-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="username-gate-title"
        >
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-md p-8 rounded-3xl"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  color: "var(--primary-fg)",
                  boxShadow: "0 0 24px var(--glow)",
                }}
              >
                <AtSign size={24} />
              </div>
              <h2 id="username-gate-title" className="text-2xl font-black mb-1" style={{ color: "var(--text)" }}>
                Kullanıcı adını seç
              </h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {user?.displayName ? `Hoş geldin ${user.displayName.split(" ")[0]}! ` : ""}
                Devam etmek için sana özel bir kullanıcı adı oluşturman gerekiyor.
              </p>
            </div>

            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
              Kullanıcı Adı
            </label>
            <UsernameField
              id="gate-username"
              value={value}
              onChange={(v) => {
                setValue(v);
                setError("");
              }}
              status={status}
              message={message}
              autoFocus
            />

            <div
              className="flex items-start gap-2 p-3 rounded-xl text-xs mt-2 mb-4"
              style={{
                background: "var(--glass)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-muted)",
              }}
            >
              <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" style={{ color: "var(--warning)" }} />
              <span>
                Her kullanıcı adı yalnızca <b>1 kişiye</b> aittir ve oluşturduktan sonra <b>bir daha değiştirilemez</b>.
              </span>
            </div>

            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              id="btn-claim-username"
              disabled={status !== "available" || submitting}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: "var(--primary)", color: "var(--primary-fg)", boxShadow: "0 0 20px var(--glow)" }}
            >
              {submitting && (
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              )}
              Kullanıcı adını oluştur
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="w-full mt-3 text-xs hover:opacity-80 disabled:opacity-40"
              style={{ color: "var(--text-subtle)" }}
            >
              {isFreshAccount ? "Vazgeç (kaydı iptal et ve hesabı sil)" : "Vazgeç ve çıkış yap"}
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
