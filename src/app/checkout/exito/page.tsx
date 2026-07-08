import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CheckoutSuccessPage() {
  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32 text-center px-4">
        <h1 className="font-display italic text-4xl text-brand-text-dark">¡Gracias por tu compra!</h1>
        <p className="text-brand-text-muted max-w-md">
          Tu pedido fue confirmado. Te enviaremos un correo con los detalles y el seguimiento de tu envío.
        </p>
        <Link href="/decants" className="text-brand-gold-dark hover:underline mt-4">
          Seguir comprando
        </Link>
      </div>
      <Footer />
    </main>
  );
}