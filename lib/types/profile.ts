// Paylaşılan profil tipleri

export type TabId = "account" | "security" | "favorites" | "orders";

export interface StatusMsg {
  type: "success" | "error";
  msg: string;
}

export const inputStyle = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  outline: "none",
  transition: "border-color 0.2s",
} as const;

export const selectStyle = {
  ...inputStyle,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundPosition: "right 1rem center",
  backgroundSize: "1.25rem",
  backgroundRepeat: "no-repeat",
  backgroundColor: "var(--bg)",
} as const;

// Mock sipariş verisi — gerçek sipariş sistemi kurulunca Firestore'dan gelecek
export const MOCK_ORDERS = [
  {
    id: "ORD-2026-9482",
    date: "15 Eyl 2026",
    total: "2.450 ₺",
    status: "Kargoya Verildi",
    statusColor: "var(--primary)",
    items: [
      { name: "Premium Siyah Hoodie", qty: 1, price: "1.250 ₺", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200" },
      { name: "Basic Beyaz Tişört", qty: 2, price: "600 ₺", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200" },
    ],
    shipping: {
      company: "Yurtiçi Kargo",
      trackingNumber: "482910482910",
      address: "Örnek Mah. Test Sok. No:1 D:2 Kadıköy/İstanbul",
      estimatedDelivery: "18 Eyl 2026",
      steps: [
        { label: "Sipariş Alındı", date: "15 Eyl 14:30", completed: true },
        { label: "Hazırlanıyor", date: "16 Eyl 09:15", completed: true },
        { label: "Kargoya Verildi", date: "16 Eyl 16:45", completed: true },
        { label: "Teslim Edildi", date: "", completed: false },
      ],
    },
  },
  {
    id: "ORD-2026-8173",
    date: "28 Ağu 2026",
    total: "850 ₺",
    status: "Teslim Edildi",
    statusColor: "var(--success)",
    items: [
      { name: "Yazlık Şapka", qty: 1, price: "850 ₺", image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=200" },
    ],
    shipping: {
      company: "Aras Kargo",
      trackingNumber: "918273645102",
      address: "Örnek Mah. Test Sok. No:1 D:2 Kadıköy/İstanbul",
      estimatedDelivery: "30 Ağu 2026",
      steps: [
        { label: "Sipariş Alındı", date: "28 Ağu 10:10", completed: true },
        { label: "Hazırlanıyor", date: "28 Ağu 14:20", completed: true },
        { label: "Kargoya Verildi", date: "29 Ağu 09:00", completed: true },
        { label: "Teslim Edildi", date: "30 Ağu 13:45", completed: true },
      ],
    },
  },
];
