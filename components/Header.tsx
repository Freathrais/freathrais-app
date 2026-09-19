"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeSwitcher from "./ThemeSwitcher";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/blog", label: "Blog" },
  { href: "/magaza", label: "Mağaza" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, userData, logout, isAdmin } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-3" : "py-5"
        }`}
        style={{
          background: scrolled ? "var(--glass)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--glass-border)" : "none",
          boxShadow: scrolled ? "var(--shadow)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  color: theme === "light" ? "#fff" : "#000",
                  boxShadow: "0 0 20px var(--glow)",
                }}
              >
                F
              </div>
              <span
                className="text-xl font-black tracking-tight"
                style={{ color: "var(--text)" }}
              >
                freathrais
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? "font-semibold"
                      : "hover:opacity-80"
                  }`}
                  style={{
                    color: pathname === link.href ? "var(--primary)" : "var(--text-muted)",
                    background: pathname === link.href ? "var(--surface)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <ThemeSwitcher />

              <button
                aria-label="Sepet"
                className="relative p-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{ color: "var(--text-muted)", background: "var(--glass)" }}
              >
                <ShoppingBag size={18} />
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
                >
                  0
                </span>
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl transition-all duration-200 hover:opacity-80"
                    style={{ background: "var(--glass)", border: "1px solid var(--glass-border)" }}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "Avatar"}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: "var(--accent)", color: "#fff" }}
                      >
                        {user.displayName?.[0] || user.email?.[0] || "U"}
                      </div>
                    )}
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 rounded-xl p-1.5 z-50"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          boxShadow: "var(--shadow-lg)",
                        }}
                      >
                        <div className="px-3 py-2 mb-1">
                          <p className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>
                            {user.displayName || "Kullanıcı"}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                            {user.email}
                          </p>
                        </div>
                        <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150 hover:opacity-80"
                            style={{ color: "var(--accent)" }}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings size={14} />
                            Admin Paneli
                          </Link>
                        )}
                        <Link
                          href="/profil"
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150 hover:opacity-80"
                          style={{ color: "var(--text)" }}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={14} />
                          Profilim
                        </Link>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150 hover:opacity-80"
                          style={{ color: "var(--danger)" }}
                        >
                          <LogOut size={14} />
                          Çıkış Yap
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/giris"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 hover:opacity-90"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-fg)",
                    boxShadow: "0 0 16px var(--glow)",
                  }}
                >
                  Giriş Yap
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                aria-label="Menü"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg transition-all duration-200"
                style={{ color: "var(--text-muted)", background: "var(--glass)" }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "var(--bg)" }}
          >
            <div className="flex flex-col h-full pt-24 px-6 pb-8">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className="block px-5 py-4 rounded-xl text-2xl font-bold transition-all duration-200"
                      style={{
                        color: pathname === link.href ? "var(--primary)" : "var(--text)",
                        background: pathname === link.href ? "var(--surface)" : "transparent",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              {!user && (
                <div className="mt-auto">
                  <Link
                    href="/giris"
                    className="block w-full py-4 rounded-xl text-center text-lg font-bold"
                    style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
                  >
                    Giriş Yap
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
