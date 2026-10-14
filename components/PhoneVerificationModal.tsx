"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, ShieldCheck, X, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  phone: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PhoneVerificationModal({ isOpen, phone, onSuccess, onClose }: Props) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isSending, setIsSending] = useState(false);
  const [mockSmsBanner, setMockSmsBanner] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Yeni doğrulama kodu üret ve gönder
  const sendCode = () => {
    setIsSending(true);
    setError("");
    setDigits(["", "", "", "", "", ""]);
    
    // 6 haneli rastgele kod üret
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    
    // Gerçekçi SMS simülasyonu / bildirim
    setTimeout(() => {
      setIsSending(false);
      setMockSmsBanner(code);
      setTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    }, 600);
  };

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError("");
      sendCode();
    } else {
      setMockSmsBanner(null);
    }
  }, [isOpen, phone]);

  // Geri sayım
  useEffect(() => {
    if (!isOpen || timer <= 0) {
      if (timer === 0) setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setError("");

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // 6 haneli tamamlandıysa otomatik kontrol et
    const full = newDigits.join("");
    if (full.length === 6) {
      verifyCode(full);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    if (pasted.length === 6) {
      verifyCode(pasted);
    } else {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const verifyCode = (codeToVerify?: string) => {
    const code = codeToVerify || digits.join("");
    if (code.length < 6) {
      setError("Lütfen 6 haneli doğrulama kodunun tamamını girin.");
      return;
    }

    if (code === generatedCode) {
      setError("");
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 700);
    } else {
      setError("Girdiğiniz doğrulama kodu hatalı. Lütfen tekrar deneyin.");
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl z-10"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl transition-colors hover:opacity-70"
            style={{ color: "var(--text-muted)", background: "var(--glass)" }}
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                color: "var(--primary-fg)",
                boxShadow: "0 0 24px var(--glow)",
              }}
            >
              <Phone size={24} />
            </div>
            <h3 className="text-2xl font-black mb-1.5" style={{ color: "var(--text)" }}>
              Telefonu Doğrula
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
              <span className="font-semibold" style={{ color: "var(--text)" }}>{phone}</span> numarasına 6 haneli bir SMS doğrulama kodu gönderildi.
            </p>
          </div>

          {/* SMS Notification Banner (Dev / Simulation Preview) */}
          {mockSmsBanner && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl text-xs mb-6 flex items-start gap-2.5"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "var(--text)",
              }}
            >
              <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
              <div>
                <p className="font-semibold mb-0.5">SMS Doğrulama Mesajı</p>
                <p style={{ color: "var(--text-muted)" }}>
                  Doğrulama kodunuz: <strong className="text-sm font-black tracking-widest px-2 py-0.5 rounded-md" style={{ background: "var(--surface-hover)", color: "var(--accent)" }}>{mockSmsBanner}</strong>
                </p>
              </div>
            </motion.div>
          )}

          {/* Error / Success message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl mb-5 text-xs font-semibold"
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "var(--danger)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl mb-5 text-xs font-semibold"
              style={{
                background: "rgba(34,197,94,0.1)",
                color: "var(--success)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <CheckCircle2 size={15} className="flex-shrink-0" />
              Telefon numaranız başarıyla doğrulandı!
            </motion.div>
          )}

          {/* 6-Digit OTP Inputs */}
          <div className="flex justify-between gap-2 sm:gap-2.5 mb-6">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                autoFocus={idx === 0}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl outline-none transition-all duration-200 !text-black !bg-white"
                style={{
                  border: digit
                    ? "2px solid var(--accent)"
                    : error
                    ? "2px solid var(--danger)"
                    : "1px solid var(--border)",
                  boxShadow: digit ? "0 0 12px var(--glow)" : "none",
                }}
              />
            ))}
          </div>

          {/* Confirm Button */}
          <button
            onClick={() => verifyCode()}
            disabled={digits.join("").length < 6 || success}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
            style={{
              background: success ? "var(--success)" : "var(--primary)",
              color: success ? "#fff" : "var(--primary-fg)",
              boxShadow: "0 0 20px var(--glow)",
            }}
          >
            {success ? <CheckCircle2 size={16} /> : <ShieldCheck size={16} />}
            {success ? "Doğrulandı" : "Kodu Onayla"}
          </button>

          {/* Resend Link */}
          <div className="text-center text-xs" style={{ color: "var(--text-subtle)" }}>
            {canResend ? (
              <button
                type="button"
                onClick={sendCode}
                disabled={isSending}
                className="inline-flex items-center gap-1.5 font-semibold hover:underline"
                style={{ color: "var(--accent)" }}
              >
                <RefreshCw size={12} className={isSending ? "animate-spin" : ""} />
                Yeni Kod Gönder
              </button>
            ) : (
              <span>Tekrar kod göndermek için: <strong style={{ color: "var(--text)" }}>{timer}s</strong></span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
