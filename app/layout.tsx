import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: {
    default: "Freathrais — Blog & Mağaza",
    template: "%s | Freathrais",
  },
  description: "Freathrais kişisel marka sitesi — Blog, mağaza, ve daha fazlası.",
  keywords: ["freathrais", "blog", "mağaza", "teknoloji"],
  authors: [{ name: "Freathrais" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Freathrais",
    title: "Freathrais — Blog & Mağaza",
    description: "Freathrais kişisel marka sitesi — Blog, mağaza, ve daha fazlası.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('freathrais-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
      </head>
      <body style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
      {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} />
      )}
    </html>
  );
}

