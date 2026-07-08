import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CheckoutPendingPage() {
  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32 text-center px-4">
        <h1 className="font-display italic text-4xl text-brand-text-dark">Pago en proceso</h1>
        <p className="text-brand-text-muted max-w-md">
          Tu pago está siendo procesado. Te notificaremos por correo cuando se confirme.
        </p>
        <Link href="/decants" className="text-brand-gold-dark hover:underline mt-4">
          Seguir comprando
        </Link>
      </div>
      <Footer />
    </main>
  );
}