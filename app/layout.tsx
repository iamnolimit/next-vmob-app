import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/lib/authContext";
import KonstaApp from "@/components/KonstaApp";
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
      <body className="h-full overflow-hidden bg-gray-50">
        <AuthProvider>
          <KonstaApp>
            {children}
          </KonstaApp>
        </AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
