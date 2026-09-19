"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default function LoginPage() {
  const { signInWithGoogle, signInWithGithub, signInWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<"google" | "github" | "email" | null>(null);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setError("");
    setLoading("google");
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (e: unknown) {
      setError("Google ile giriş başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(null);
    }
  };

  const handleGithub = async () => {
    setError("");
    setLoading("github");
    try {
      await signInWithGithub();
      router.push("/");
    } catch (e: unknown) {
      setError("GitHub ile giriş başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(null);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading("email");
    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch (e: unknown) {
      setError("E-posta veya şifre hatalı. Lütfen kontrol edin.");
    } finally {
      setLoading(null);
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text)" }}>
            Tekrar Hoş Geldin
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Hesabına giriş yap ve keşfetmeye devam et.
          </p>
        </div>

        {/* Error */}
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

        {/* Social Login Buttons — PROMINENT */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogle}
            disabled={loading !== null}
            id="btn-google-login"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "white",
              color: "#1f1f1f",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {loading === "google" ? (
              <div className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            Google ile Devam Et
          </button>

          <button
            onClick={handleGithub}
            disabled={loading !== null}
            id="btn-github-login"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "#24292e",
              color: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {loading === "github" ? (
              <div className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
            ) : (
              <GithubIcon />
            )}
            GitHub ile Devam Et
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-xs px-2" style={{ color: "var(--text-subtle)" }}>
            veya e-posta ile
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmail} className="space-y-4">
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
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none !text-black !bg-white"
                style={{
                  border: "1px solid var(--border)",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                Şifre
              </label>
              <Link href="/sifremi-unuttum" className="text-xs transition-opacity hover:opacity-70" style={{ color: "var(--accent)" }}>
                Şifremi Unuttum
              </Link>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-10 py-3 rounded-xl text-sm transition-all duration-200 outline-none !text-black !bg-white"
                style={{
                  border: "1px solid var(--border)",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: "var(--text-subtle)" }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading !== null}
            id="btn-email-login"
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: "var(--primary)",
              color: "var(--primary-fg)",
              boxShadow: "0 0 20px var(--glow)",
            }}
          >
            {loading === "email" ? (
              <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : null}
            Giriş Yap
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          Hesabın yok mu?{" "}
          <Link href="/kayit" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--accent)" }}>
            Kayıt Ol
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
