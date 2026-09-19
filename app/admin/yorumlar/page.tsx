"use client";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Trash2, MessageSquare } from "lucide-react";

const comments = [
  { id: 1, author: "Ali Veli", content: "Harika bir yazı! Çok faydalı oldu.", target: "Next.js 14 Yazısı", status: "pending", date: "13 Eyl 2026" },
  { id: 2, author: "Ayşe Kaya", content: "Teşekkürler, bu konuda daha fazla yazı bekliyorum.", target: "Firebase Auth", status: "pending", date: "12 Eyl 2026" },
  { id: 3, author: "Mehmet Öz", content: "Ürün gerçekten kaliteli, tekrar alacağım.", target: "Ürün A", status: "approved", date: "11 Eyl 2026" },
];
export default function AdminYorumlarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Yorum Moderasyonu</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>2 onay bekleyen yorum</p>
      </div>
      <div className="space-y-3">
        {comments.map((comment, i) => (
          <motion.div key={comment.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--accent)", color: "#fff" }}>{comment.author[0]}</div>
                  <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{comment.author}</span>
                  <span className="text-xs" style={{ color: "var(--text-subtle)" }}>→ {comment.target}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
                    style={{
                      background: comment.status === "pending" ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)",
                      color: comment.status === "pending" ? "#f59e0b" : "var(--success)",
                    }}>
                    {comment.status === "pending" ? "Bekliyor" : "Onaylı"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{comment.content}</p>
                <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>{comment.date}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--success)" }}><CheckCircle size={16} /></button>
                <button className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--danger)" }}><XCircle size={16} /></button>
                <button className="p-1.5 rounded-lg hover:opacity-70" style={{ color: "var(--text-muted)" }}><Trash2 size={14} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
