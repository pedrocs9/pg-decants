import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CheckoutErrorPage() {
  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32 text-center px-4">
        <h1 className="font-display italic text-4xl text-brand-text-dark">Hubo un problema con tu pago</h1>
        <p className="text-brand-text-muted max-w-md">
          No pudimos procesar tu pago. Puedes intentar de nuevo o contactarnos si el problema persiste.
        </p>
        <Link href="/checkout" className="text-brand-gold-dark hover:underline mt-4">
          Intentar de nuevo
        </Link>
      </div>
      <Footer />
    </main>
  );
}