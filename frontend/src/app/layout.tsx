import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MGN Marketing Dubai | Luxury Real Estate & Enterprise Management OS',
  description:
    'Premier Dubai luxury real estate brokerage & all-in-one business management platform for properties, CRM leads, DLD deals, marketing ROAS, and RERA advisors.',
  icons: {
    icon: '/mgn-logo.png',
    apple: '/mgn-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-[#070A12] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950"
      >
        {children}
      </body>
    </html>
  );
}
