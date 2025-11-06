import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HTI Dashboard - Grant Compliance & Device Tracking',
  description: 'HUBZone Technology Initiative Dashboard Intelligence Suite - Secure. Simple. Socially Good.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-hti-navy antialiased">
        <header className="bg-hti-navy text-white shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">HUBZone Technology Initiative</h1>
            <p className="text-hti-blue text-sm mt-1">Secure. Simple. Socially Good.</p>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {children}
        </main>

        <footer className="bg-hti-navy text-white mt-16 py-6">
          <div className="container mx-auto px-6 text-center text-sm">
            <p className="mb-2">
              Supported by the NC Department of Information Technology Digital Champion Grant
            </p>
            <p className="text-gray-400">
              Funded by the American Rescue Plan Act (ARPA)
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
