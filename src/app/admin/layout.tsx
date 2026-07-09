'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminNav } from './AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-brand-cream">
      {/* Overlay (solo mobile, cuando el menú está abierto) */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-black text-brand-cream flex-shrink-0 p-6 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0 lg:static' : '-translate-x-full lg:hidden'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="font-display italic text-xl block">
            P&G Decants
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="text-brand-cream/70 hover:text-brand-cream cursor-pointer"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        <p className="text-xs uppercase tracking-wide text-brand-cream/50 mb-4">Panel Admin</p>
        <AdminNav />

        <div className="mt-auto pt-6 border-t border-brand-cream/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-brand-cream hover:bg-brand-cream/10 transition-colors rounded"
          >
            ← Volver a la Tienda
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior con botón hamburguesa (siempre visible, PC y mobile) */}
        <div className="flex items-center gap-3 p-4 border-b border-brand-beige-line bg-brand-white">
          <button
            onClick={() => setOpen(!open)}
            className="text-brand-text-dark hover:text-brand-gold-dark cursor-pointer transition-colors"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            ☰
          </button>
          <span className="text-sm text-brand-text-muted">Panel Admin</span>
        </div>

        <main className="flex-1 p-8 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}