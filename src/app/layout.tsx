import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppNav from "@/components/layout/AppNav";
import QueryProvider from "@/components/providers/QueryProvider";
import PWARegistration from "@/components/providers/PWARegistration";
import AccessibilityProvider from "@/components/providers/AccessibilityProvider";
import PWAInstallPrompt from "@/components/ui/PWAInstallPrompt";
import AccessibilitySettings from "@/components/ui/AccessibilitySettings";

export const metadata: Metadata = {
  title: "HUBDash - HTI Dashboard",
  description: "HUBZone Technology Initiative Dashboard - Track impact, manage operations, and expand digital opportunity",
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HUBDash',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#008080',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <PWARegistration />
          <AccessibilityProvider />
          <AppNav />
          {children}
          <PWAInstallPrompt />
          <AccessibilitySettings />
        </QueryProvider>
      </body>
    </html>
  );
}
