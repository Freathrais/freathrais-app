"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield, UserX, MoreHorizontal, Crown, User, ShoppingBag } from "lucide-react";

const users = [
  { id: 1, name: "Admin User", email: "admin@freathrais.com", role: "admin", orders: 0, joined: "1 Oca 2026", photoURL: null },
  { id: 2, name: "Ali Veli", email: "ali@example.com", role: "customer", orders: 5, joined: "15 Şub 2026", photoURL: null },
  { id: 3, name: "Ayşe Kaya", email: "ayse@example.com", role: "editor", orders: 2, joined: "20 Mar 2026", photoURL: null },
  { id: 4, name: "Mehmet Öz", email: "mehmet@example.com", role: "customer", orders: 8, joined: "5 Nis 2026", photoURL: null },
  { id: 5, name: "Fatma Ak", email: "fatma@example.com", role: "customer", orders: 3, joined: "10 May 2026", photoURL: null },
];

const roleMap = {
  admin: { label: "Admin", icon: Crown, color: "var(--accent)", bg: "rgba(99,102,241,0.1)" },
  editor: { label: "Editör", icon: Shield, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  customer: { label: "Müşteri", icon: User, color: "var(--text-muted)", bg: "var(--glass)" },
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Kullanıcı Yönetimi</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{users.length} kullanıcı toplam</p>
        </div>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="İsim veya e-posta ara..."
          className="w-full max-w-sm pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Kullanıcı", "Rol", "Sipariş", "Katılım", "İşlemler"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-subtle)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const r = roleMap[user.role as keyof typeof roleMap];
                const RIcon = r.icon;
                return (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="hover:bg-[var(--surface-hover)] transition-colors"
                    style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={{ background: "var(--accent)", color: "#fff" }}>
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{user.name}</p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: r.bg, color: r.color }}>
                        <RIcon size={10} /> {r.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-muted)" }}>
                        <ShoppingBag size={12} /> {user.orders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--text-muted)" }}>{user.joined}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <select className="text-xs px-2 py-1 rounded-lg outline-none"
                          style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                          defaultValue={user.role}>
                          <option value="customer">Müşteri</option>
                          <option value="editor">Editör</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--danger)" }}>
                          <UserX size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
