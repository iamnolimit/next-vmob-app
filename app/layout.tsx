import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/lib/authContext";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vmedis Mobile",
  description: "VMEDIS Apotek/Klinik - Sistem Informasi Klinik",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vmedis Mobile",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e3a8a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="h-full">
        <body className="h-full overflow-hidden bg-[#f4f6f8] relative" suppressHydrationWarning>
        {/* Global Ambient Background */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#035afc]/10 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-[#035afc]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-[#035afc]/10 rounded-full blur-[120px]" />
        </div>

        <AuthProvider>
          {children}
        </AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
