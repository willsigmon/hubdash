import type { Metadata } from "next";
import "./globals.css";
import AppNav from "@/components/layout/AppNav";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "HubDash - HTI Dashboard",
  description: "HUBZone Technology Initiative Dashboard - Track impact, manage operations, and expand digital opportunity",
  icons: {
    icon: '/favicon.svg',
  },
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
          <AppNav />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
