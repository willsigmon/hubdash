import AppNav from "@/components/layout/AppNav";
import QueryProvider from "@/components/providers/QueryProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { CommandPalette } from "@/components/ui/CommandPalette";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HUBDash - HTI Dashboard",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geomanist@1.0.0/geomanist.min.css" />
      </head>
      <body className="font-sans antialiased bg-app text-primary">
        <ThemeProvider>
          <QueryProvider>
            <AppNav />
            <CommandPalette />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
