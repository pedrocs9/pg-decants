import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PerfumeIcon } from '@/components/icons';

export default function NotFound() {
  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center gap-6 py-24 px-4 text-center">
        <PerfumeIcon className="w-16 h-16 text-brand-beige-line" />

        <div>
          <h1 className="font-display italic text-5xl text-brand-text-dark mb-3">
            Página No Encontrada
          </h1>
          <p className="text-brand-text-muted max-w-md mx-auto">
            La fragancia que buscas parece haberse desvanecido. Puede que el enlace esté roto
            o la página ya no exista.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/"
            className="bg-brand-black text-brand-cream px-8 py-3 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors"
          >
            Volver al Inicio
          </Link>
          <Link
            href="/decants"
            className="border border-brand-beige-line text-brand-text-dark px-8 py-3 text-sm font-medium tracking-wide hover:border-brand-gold transition-colors"
          >
            Explorar Decants
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}