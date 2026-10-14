"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, RefreshCw, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const COOLDOWN_S = 90;
const LS_SENT_KEY = "freathrais-verif-sent-at";
const LS_DISMISSED_KEY = "freathrais-verif-banner-dismissed";

export default function EmailVerificationBanner() {
  const { user, sendVerificationEmail } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [lastSent, setLastSent] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // localStorage'dan kalıcı kapatılmış ve son gönderim bilgisini oku
  useEffect(() => {
    try {
      if (localStorage.getItem(LS_DISMISSED_KEY) === "true") setDismissed(true);
      const sent = Number(localStorage.getItem(LS_SENT_KEY));
      if (sent) {
        setLastSent(sent);
        const elapsed = Math.floor((Date.now() - sent) / 1000);
        const remaining = COOLDOWN_S - elapsed;
        if (remaining > 0) setCooldown(remaining);
      }
    } catch { /* yok say */ }
  }, []);

  // Geri sayım tickerı
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(t); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const show = !!user && !user.emailVerified && !dismissed;

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem(LS_DISMISSED_KEY, "true"); } catch { /* yok say */ }
  };

  const handleSend = async () => {
    if (sending || cooldown > 0) return;
    setError("");
    setSending(true);
    try {
      await sendVerificationEmail();
      const now = Date.now();
      setLastSent(now);
      setCooldown(COOLDOWN_S);
      try { localStorage.setItem(LS_SENT_KEY, String(now)); } catch { /* yok say */ }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      if (code === "auth/too-many-requests") {
        setError("Biraz bekleyin, çok fazla istek gönderildi.");
        setCooldown(COOLDOWN_S);
      } else {
        setError("Mail gönderilemedi. Lütfen tekrar deneyin.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.35 }}
          className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between gap-3 px-4 py-2.5 text-xs font-medium"
          style={{
            background: "linear-gradient(90deg, rgba(234,179,8,0.18) 0%, rgba(245,158,11,0.22) 100%)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(234,179,8,0.35)",
            color: "var(--text)",
            paddingTop: "calc(0.625rem + env(safe-area-inset-top, 0px))",
          }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Mail size={14} className="flex-shrink-0" style={{ color: "#f59e0b" }} />
            <span className="truncate">
              <span className="font-semibold" style={{ color: "#b45309" }}>E-posta adresiniz henüz doğrulanmadı.</span>
              {" "}
              {error ? (
                <span style={{ color: "var(--danger)" }}>{error}</span>
              ) : lastSent ? (
                <span style={{ color: "var(--text-muted)" }}>Mail gönderildi, spam klasörünü de kontrol edin.</span>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>Doğrulama maili almak için &ldquo;Mail Gönder&rdquo; butonuna tıklayın.</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {cooldown > 0 ? (
              <span className="text-xs font-semibold tabular-nums" style={{ color: "#92400e" }}>
                {lastSent && !error ? "Gönderildi ✓" : "Bekleyin"} ({cooldown}s)
              </span>
            ) : (
              <button
                id="btn-send-verification"
                onClick={handleSend}
                disabled={sending}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                style={{ background: "rgba(234,179,8,0.25)", color: "#92400e", border: "1px solid rgba(234,179,8,0.4)" }}
              >
                <RefreshCw size={11} className={sending ? "animate-spin" : ""} />
                Mail Gönder
              </button>
            )}
            <button
              id="btn-dismiss-verification-banner"
              onClick={dismiss}
              className="p-1 rounded-lg transition-all hover:opacity-60"
              style={{ color: "var(--text-muted)" }}
              aria-label="Kapat"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
