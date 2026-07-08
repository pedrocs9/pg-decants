import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { CartProvider } from '@/components/cart/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsappButton } from '@/components/layout/WhatsappButton';
import { Suspense } from 'react';
import { ProgressBar } from '@/components/layout/ProgressBar';
import "./globals.css";
import type { Metadata } from 'next';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
});


export const metadata: Metadata = {
  metadataBase: new URL('https://pgdecants.cl'), // cambia por tu dominio real cuando lo tengas
  title: {
    default: 'P&G Decants | Decants de Perfumes Originales en Chile',
    template: '%s | P&G Decants',
  },
  description: 'Decants 100% originales de las mejores casas de perfumería. Fragancias de diseñador, árabes y de nicho en formatos de 5ml y 10ml, con envío a todo Chile.',
  keywords: ['decants', 'perfumes originales', 'decants Chile', 'fragancias', 'perfumes de nicho', 'perfumes árabes'],
  openGraph: {
    title: 'P&G Decants | Decants de Perfumes Originales en Chile',
    description: 'Decants 100% originales de las mejores casas de perfumería, con envío a todo Chile.',
    url: 'https://pgdecants.cl',
    siteName: 'P&G Decants',
    locale: 'es_CL',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="min-h-full flex flex-col font-body" suppressHydrationWarning>
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        <SessionProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <WhatsappButton />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}