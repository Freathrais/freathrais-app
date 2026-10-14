"use client";
import { useState } from "react";
import { Package, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MOCK_ORDERS } from "@/lib/types/profile";

export default function OrdersTab() {
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (MOCK_ORDERS.length === 0) {
    return (
      <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
        <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Siparişlerim</h2>
        <div className="text-center py-16" style={{ background: "var(--bg)", borderRadius: "1rem", border: "1px dashed var(--border)" }}>
          <Package size={48} className="mx-auto mb-4 opacity-20" style={{ color: "var(--text)" }} />
          <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Henüz siparişiniz yok</h3>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Mağazamızdaki ürünleri inceleyip ilk siparişinizi oluşturabilirsiniz.</p>
          <button onClick={() => router.push("/magaza")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}>
            Alışverişe Başla
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Siparişlerim</h2>
      <div className="space-y-6">
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{ border: "1px solid var(--border)", background: "var(--bg)" }}>
            <div
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex-1 flex flex-wrap items-center gap-x-8 gap-y-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Sipariş No</p>
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{order.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Tarih</p>
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{order.date}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Tutar</p>
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{order.total}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <div className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: `${order.statusColor}15`, color: order.statusColor }}>
                  {order.status}
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "var(--surface)", color: "var(--text)" }}>
                  {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedOrder === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 border-t" style={{ borderColor: "var(--border)" }}>
                    {/* Items */}
                    <div className="mb-8">
                      <h4 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
                        <Package size={16} style={{ color: "var(--accent)" }} /> Sipariş Özeti
                      </h4>
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                            <div className="flex-1">
                              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{item.name}</p>
                              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{item.qty} Adet</p>
                            </div>
                            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping */}
                    <div>
                      <h4 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
                        <Truck size={16} style={{ color: "var(--accent)" }} /> Kargo Durumu
                      </h4>
                      <div className="p-4 rounded-xl mb-6 flex flex-col sm:flex-row gap-4 justify-between" style={{ background: "var(--surface)" }}>
                        <div>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Kargo Firması</p>
                          <p className="text-sm font-bold mt-0.5" style={{ color: "var(--text)" }}>{order.shipping.company}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Takip Numarası</p>
                          <p className="text-sm font-bold mt-0.5" style={{ color: "var(--text)" }}>{order.shipping.trackingNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Tahmini Teslimat</p>
                          <p className="text-sm font-bold mt-0.5" style={{ color: "var(--text)" }}>{order.shipping.estimatedDelivery}</p>
                        </div>
                      </div>
                      {/* Tracking Steps */}
                      <div className="relative pl-4 space-y-6">
                        <div className="absolute left-[1.125rem] top-2 bottom-2 w-0.5" style={{ background: "var(--border)" }} />
                        {order.shipping.steps.map((step, idx) => (
                          <div key={idx} className="relative flex items-center gap-4">
                            <div className="w-5 h-5 rounded-full border-[3px] flex-shrink-0 z-10"
                              style={{ borderColor: "var(--surface)", background: step.completed ? "var(--accent)" : "var(--border)" }} />
                            <div>
                              <p className={`text-sm font-bold ${step.completed ? "" : "opacity-50"}`} style={{ color: "var(--text)" }}>{step.label}</p>
                              {step.date && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{step.date}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
