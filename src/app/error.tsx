'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-brand-cream px-4 text-center">
      <h1 className="font-display italic text-4xl text-brand-text-dark">
        Algo salió mal
      </h1>
      <p className="text-brand-text-muted max-w-md">
        Tuvimos un problema inesperado. Puedes intentar de nuevo o volver al inicio.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-brand-black text-brand-cream px-8 py-3 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors cursor-pointer"
        >
          Intentar de Nuevo
        </button>
        <Link
          href="/"
          className="border border-brand-beige-line text-brand-text-dark px-8 py-3 text-sm font-medium tracking-wide hover:border-brand-gold transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </main>
  );
}