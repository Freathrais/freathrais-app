"use client";
import { useEffect, useState } from "react";
import { AtSign, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { validateUsername } from "@/lib/username";

export type UsernameStatus = "empty" | "invalid" | "checking" | "available" | "taken" | "error";

/** Yazılan kullanıcı adının biçimini ve müsaitliğini (debounce ile) denetler */
export function useUsernameStatus(value: string) {
  const { checkUsernameAvailable } = useAuth();
  const [status, setStatus] = useState<UsernameStatus>("empty");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const v = value.trim();
    if (!v) {
      setStatus("empty");
      setMessage("");
      return;
    }
    const invalid = validateUsername(v);
    if (invalid) {
      setStatus("invalid");
      setMessage(invalid);
      return;
    }
    setStatus("checking");
    setMessage("Müsaitlik kontrol ediliyor...");
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const ok = await checkUsernameAvailable(v);
        if (cancelled) return;
        setStatus(ok ? "available" : "taken");
        setMessage(ok ? "Bu kullanıcı adı müsait." : "Bu kullanıcı adı başkası tarafından kullanılıyor.");
      } catch {
        if (cancelled) return;
        setStatus("error");
        setMessage("Müsaitlik kontrol edilemedi. Lütfen tekrar deneyin.");
      }
    }, 450);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { status, message };
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  status: UsernameStatus;
  message: string;
  id?: string;
  autoFocus?: boolean;
}

export default function UsernameField({ value, onChange, status, message, id, autoFocus }: Props) {
  const color =
    status === "available"
      ? "var(--success)"
      : status === "invalid" || status === "taken" || status === "error"
      ? "var(--danger)"
      : "var(--text-subtle)";

  return (
    <div>
      <div className="relative">
        <AtSign
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-subtle)" }}
        />
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
          placeholder="kullanici_adi"
          maxLength={20}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus={autoFocus}
          required
          className="w-full pl-9 pr-10 py-3 rounded-xl text-sm transition-all duration-200 outline-none !text-black !bg-white"
          style={{
            border: `1px solid ${
              status === "available" ? "var(--success)" : status === "taken" || status === "invalid" ? "var(--danger)" : "var(--border)"
            }`,
          }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color }}>
          {status === "checking" && <Loader2 size={15} className="animate-spin" />}
          {status === "available" && <CheckCircle2 size={15} />}
          {(status === "taken" || status === "invalid" || status === "error") && <AlertCircle size={15} />}
        </span>
      </div>
      <p className="text-xs mt-1.5 min-h-4" style={{ color }}>
        {message || "3-20 karakter; harf, rakam ve _ kullanabilirsiniz."}
      </p>
    </div>
  );
}
