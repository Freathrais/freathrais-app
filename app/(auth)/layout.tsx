import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
          >
            <span style={{ mixBlendMode: "exclusion", color: "#fff" }}>F</span>
          </div>
          <span className="text-xl font-black tracking-tight" style={{ color: "var(--text)" }}>
            freathrais
          </span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
