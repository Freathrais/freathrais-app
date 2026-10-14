"use client";
import { User, Shield, ShoppingBag, Heart } from "lucide-react";
import type { TabId } from "@/lib/types/profile";

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "account",   label: "Hesap Bilgileri", Icon: User },
  { id: "orders",    label: "Siparişlerim",    Icon: ShoppingBag },
  { id: "security",  label: "Güvenlik",        Icon: Shield },
  { id: "favorites", label: "Favorilerim",     Icon: Heart },
];

export default function ProfileSidebar({ activeTab, onTabChange }: Props) {
  return (
    <div className="w-full md:w-64 flex-shrink-0 space-y-2">
      {tabs.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${
              active ? "scale-[1.02]" : "hover:scale-[1.02] opacity-70 hover:opacity-100"
            }`}
            style={{
              background: active ? "var(--surface)" : "transparent",
              border: active ? "1px solid var(--border)" : "1px solid transparent",
              color: active ? "var(--text)" : "var(--text-muted)",
            }}
          >
            <Icon size={18} style={{ color: active ? "var(--accent)" : "inherit" }} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
