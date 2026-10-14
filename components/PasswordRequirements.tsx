"use client";
import { Check, Circle } from "lucide-react";
import { passwordRequirements } from "@/lib/password";

/** Şifre alanının hemen altında gösterilen, sağlandıkça yeşil tik çıkan gereksinim listesi */
export default function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul className="mt-2 space-y-1" aria-label="Şifre gereksinimleri">
      {passwordRequirements.map((r) => {
        const ok = r.test(password);
        return (
          <li
            key={r.id}
            className="flex items-center gap-1.5 text-[11px] transition-colors duration-200"
            style={{ color: ok ? "var(--success)" : "var(--text-subtle)" }}
          >
            {ok ? (
              <Check size={12} strokeWidth={3} aria-label="Sağlandı" />
            ) : (
              <Circle size={10} className="mx-px" aria-label="Eksik" />
            )}
            {r.label}
          </li>
        );
      })}
    </ul>
  );
}
