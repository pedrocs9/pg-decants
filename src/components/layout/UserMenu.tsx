'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { UserIcon } from '@/components/icons';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === 'loading') {
    return <div className="w-5 h-5" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        aria-label="Iniciar sesión"
        className="text-brand-text-dark hover:text-brand-gold-dark transition-colors"
      >
        <UserIcon className="w-5 h-5" />
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="text-brand-gold hover:text-brand-gold-dark transition-colors cursor-pointer">
        <UserIcon className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute top-full right-0 bg-brand-white shadow-lg border border-brand-beige-line min-w-[180px] py-2 z-50">
          <p className="px-4 py-2 text-xs text-brand-text-muted truncate border-b border-brand-beige-line mb-1">
            {session.user.email}
          </p>
          <Link
            href="/mi-cuenta"
            className="block px-4 py-2 text-sm text-brand-text-dark hover:text-brand-gold-dark hover:bg-brand-cream transition-colors"
          >
            Mi Cuenta
          </Link>
          <Link
            href="/mi-cuenta/pedidos"
            className="block px-4 py-2 text-sm text-brand-text-dark hover:text-brand-gold-dark hover:bg-brand-cream transition-colors"
          >
            Mis Pedidos
          </Link>
          <Link
            href="/favoritos"
            className="block px-4 py-2 text-sm text-brand-text-dark hover:text-brand-gold-dark hover:bg-brand-cream transition-colors"
          >
            Mis Favoritos
          </Link>
          {session.user.role === 'admin' && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-brand-gold-dark font-medium hover:bg-brand-cream transition-colors border-t border-brand-beige-line mt-1 pt-3"
            >
              ⚙ Panel Admin
            </Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left px-4 py-2 text-sm text-brand-text-dark hover:text-brand-gold-dark hover:bg-brand-cream transition-colors cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}