import type { Metadata, Viewport } from "next";
import "./globals.css";
import FullscreenController from "@/components/FullscreenController";
import AppProvider from "@/components/AppProvider";

export const metadata: Metadata = {
  title: "Lumina Lock - Premium Flashlight",
  description: "Turn ON for free. Turn OFF with Premium.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Lumina Lock", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async defer />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased bg-[#030303] overflow-hidden touch-manipulation">
        <AppProvider>
          <FullscreenController />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
