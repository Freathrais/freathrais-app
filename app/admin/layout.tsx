"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, ShoppingBag, Package,
  Users, MessageSquare, Settings, LogOut, ChevronLeft,
  ChevronRight, Menu, X, TrendingUp, Bell, Search,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/magaza", label: "Mağaza", icon: ShoppingBag },
  { href: "/admin/siparisler", label: "Siparişler", icon: Package },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
  { href: "/admin/yorumlar", label: "Yorumlar", icon: MessageSquare },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

function AdminSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { user, userData, logout } = useAuth();

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-full z-30 flex flex-col"
      style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border)", minHeight: 64 }}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}>
              <span style={{ mixBlendMode: "exclusion", color: "#fff" }}>F</span>
            </div>
            <span className="text-base font-black tracking-tight" style={{ color: "var(--text)" }}>Admin</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black mx-auto"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}>
            <span style={{ mixBlendMode: "exclusion", color: "#fff" }}>F</span>
          </div>
        )}
        <button onClick={onToggle} className="p-1.5 rounded-lg transition-all hover:opacity-70 flex-shrink-0"
          style={{ color: "var(--text-muted)", background: "var(--glass)" }}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
              style={{
                background: active ? "var(--surface)" : "transparent",
                color: active ? "var(--text)" : "var(--text-muted)",
                fontWeight: active ? 600 : 400,
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={17} className="flex-shrink-0" style={{ color: active ? "var(--accent)" : "var(--text-muted)" }} />
              {!collapsed && <span className="text-sm whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-xl" style={{ background: "var(--glass)" }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: "var(--accent)", color: "#fff" }}>
                {user.displayName?.[0] || "A"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>
                {user.displayName || "Admin"}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--text-subtle)" }}>
                {userData?.role || "admin"}
              </p>
            </div>
          </div>
        )}
        <button onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-150 hover:opacity-70"
          style={{ color: "var(--danger)" }}
          title={collapsed ? "Çıkış Yap" : undefined}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && "Çıkış Yap"}
        </button>
      </div>
    </motion.aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/giris");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--accent) transparent" }} />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const sidebarW = collapsed ? 72 : 240;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
              onClick={() => setMobileSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden w-60"
              style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}>
              <AdminSidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-0" style={{ marginLeft: `${sidebarW}px`, transition: "margin-left 0.25s ease" }}>
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{
            background: "var(--glass)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--glass-border)",
            minHeight: 64,
          }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-lg" style={{ color: "var(--text-muted)", background: "var(--glass)" }}>
              <Menu size={18} />
            </button>
            <h1 className="text-base font-semibold" style={{ color: "var(--text)" }}>
              {navItems.find((n) => pathname === n.href || (!n.exact && pathname.startsWith(n.href)))?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button className="p-2 rounded-lg" style={{ color: "var(--text-muted)", background: "var(--glass)" }}>
              <Bell size={16} />
            </button>
            <Link href="/" className="text-xs px-3 py-1.5 rounded-lg" style={{ color: "var(--text-muted)", background: "var(--glass)", border: "1px solid var(--border)" }}>
              Siteye Dön
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

