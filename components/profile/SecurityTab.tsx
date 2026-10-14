"use client";
import { Lock, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { motion } from "framer-motion";
import PasswordRequirements from "@/components/PasswordRequirements";
import { isPasswordValid } from "@/lib/password";
import { inputStyle, type StatusMsg } from "@/lib/types/profile";
import type { User as FirebaseUser } from "firebase/auth";

interface Props {
  user: FirebaseUser;
  currentPassword: string; setCurrentPassword: (v: string) => void;
  currentPasswordConfirm: string; setCurrentPasswordConfirm: (v: string) => void;
  newPassword: string; setNewPassword: (v: string) => void;
  securityStatus: StatusMsg | null; setSecurityStatus: (v: StatusMsg | null) => void;
  isUpdatingPassword: boolean; setIsUpdatingPassword: (v: boolean) => void;
}

export default function SecurityTab({
  user,
  currentPassword, setCurrentPassword,
  currentPasswordConfirm, setCurrentPasswordConfirm,
  newPassword, setNewPassword,
  securityStatus, setSecurityStatus,
  isUpdatingPassword, setIsUpdatingPassword,
}: Props) {

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.email) return;
    setSecurityStatus(null);

    if (currentPassword !== currentPasswordConfirm) {
      setSecurityStatus({ type: "error", msg: "Mevcut şifre iki alanda aynı olmalı." });
      return;
    }
    if (!isPasswordValid(newPassword)) {
      setSecurityStatus({ type: "error", msg: "Yeni şifre tüm gereksinimleri karşılamalı." });
      return;
    }
    if (newPassword === currentPassword) {
      setSecurityStatus({ type: "error", msg: "Yeni şifre mevcut şifreyle aynı olamaz." });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSecurityStatus({ type: "success", msg: "Şifreniz başarıyla değiştirildi." });
      setCurrentPassword("");
      setCurrentPasswordConfirm("");
      setNewPassword("");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        setSecurityStatus({ type: "error", msg: "Mevcut şifreniz yanlış." });
      } else if (error.code === "auth/too-many-requests") {
        setSecurityStatus({ type: "error", msg: "Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin." });
      } else {
        setSecurityStatus({ type: "error", msg: "Şifre güncellenirken bir hata oluştu." });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Güvenlik</h2>

      {securityStatus && (
        <div className="flex items-center gap-2 p-4 rounded-xl text-sm mb-6"
          style={{
            background: securityStatus.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: securityStatus.type === "success" ? "var(--success)" : "var(--danger)",
          }}>
          {securityStatus.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {securityStatus.msg}
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Mevcut Şifreniz</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
              autoComplete="current-password" placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Mevcut Şifreniz (Tekrar)</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
            <input type="password" value={currentPasswordConfirm} onChange={(e) => setCurrentPasswordConfirm(e.target.value)} required
              autoComplete="off" placeholder="Mevcut şifrenizi tekrar yazın"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
              style={{
                ...inputStyle,
                borderColor: currentPasswordConfirm && currentPasswordConfirm !== currentPassword ? "var(--danger)" : undefined,
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = currentPasswordConfirm && currentPasswordConfirm !== currentPassword ? "var(--danger)" : "var(--border)")} />
          </div>
          {currentPasswordConfirm && currentPasswordConfirm !== currentPassword && (
            <p className="text-[11px] mt-1.5" style={{ color: "var(--danger)" }}>Şifreler eşleşmiyor.</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>Yeni Şifre</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
              autoComplete="new-password" placeholder="Yeni şifrenizi oluşturun"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
          </div>
          <PasswordRequirements password={newPassword} />
        </div>

        <button type="submit"
          disabled={isUpdatingPassword || !currentPassword || currentPassword !== currentPasswordConfirm || !isPasswordValid(newPassword)}
          className="w-full sm:w-auto mt-4 px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: "var(--primary)", color: "var(--primary-fg)", boxShadow: "0 0 20px var(--glow)" }}>
          {isUpdatingPassword ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Save size={16} />}
          Şifreyi Güncelle
        </button>
      </form>
    </motion.div>
  );
}
