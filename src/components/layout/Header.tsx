'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchModal } from '@/components/layout/SearchModal';
import { UserMenu } from '@/components/layout/UserMenu';
import { CartIcon, MenuIcon, CloseIcon, ArrowIcon } from '@/components/icons';
import { useCart } from '@/components/cart/CartContext';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Decants',
    href: '/decants',
    submenu: [
      { label: 'Hombre', href: '/decants?genero=masculino' },
      { label: 'Mujer', href: '/decants?genero=femenino' },
    ],
  },
  { label: 'Encuentra tu perfume', href: '/no-encontraste' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [decantsOpen, setDecantsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();

  const isHome = pathname === '/';

  useEffect(() => {
    let frame = 0;

    function handleScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 z-40 border-b bg-brand-black transition-[top,background-color,border-color] duration-[var(--transition-standard)] motion-reduce:transition-none ${
          scrolled
            ? 'top-0 bg-brand-black/95 border-brand-gold-dark/20 shadow-[var(--header-shadow)]'
            : 'top-[var(--topbar-height)] border-brand-gold-dark/10'
        }`}
      >
        <div className="mx-auto max-w-[var(--content-max)] px-4 sm:px-6 lg:px-8">
          <div className="grid h-[var(--header-height-mobile)] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 md:h-[70px] min-[1180px]:h-[76px]">
            <nav aria-label="Navegacion principal" className="hidden min-w-0 items-center gap-6 justify-self-start min-[1180px]:flex xl:gap-8">
              {navLinks.map((link) => {
                const isActive = link.submenu
                  ? pathname.startsWith('/decants')
                  : link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);

                return link.submenu ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setDecantsOpen(true)}
                    onMouseLeave={() => setDecantsOpen(false)}
                  >
                    <button
                      aria-expanded={decantsOpen}
                      className={`relative flex items-center gap-1.5 whitespace-nowrap py-2 text-[13px] tracking-[0.02em] transition-colors cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold ${
                        isActive ? 'text-brand-gold font-medium' : 'text-brand-gold hover:text-brand-cream'
                      }`}
                    >
                      {link.label}
                      <ArrowIcon className="w-3 h-3 rotate-90" />
                      <span
                        className={`absolute -bottom-1 left-0 h-[1.5px] bg-brand-gold transition-all duration-300 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </button>
                    {decantsOpen && (
                      <div className="absolute top-full left-0 bg-brand-black shadow-lg border border-brand-gold-dark/40 min-w-[160px] py-2">
                        {link.submenu.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-brand-cream hover:text-brand-gold hover:bg-brand-black/60 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative whitespace-nowrap py-2 text-[13px] tracking-[0.02em] transition-colors group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold ${
                      isActive ? 'text-brand-gold font-medium' : 'text-brand-gold hover:text-brand-cream'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-[1.5px] bg-brand-gold transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <button
              className="grid h-10 w-10 place-items-center justify-self-start text-brand-cream cursor-pointer hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold min-[1180px]:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            <Link href="/" aria-label="P&G Decants, inicio" className="col-start-2 justify-self-center px-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold">
              <Image
                src="/brand/fondodorado.png"
                alt="P&G Decants"
                width={168}
                height={42}
                priority
                className="h-auto w-[122px] sm:w-[142px] min-[1180px]:w-[160px] xl:w-[168px]"
              />
            </Link>

            <div className="col-start-3 flex items-center justify-self-end gap-2 sm:gap-3 min-[1180px]:gap-4">
              <div className="hidden h-10 w-10 place-items-center text-brand-gold min-[900px]:grid [&>a]:grid [&>a]:h-10 [&>a]:w-10 [&>a]:place-items-center [&>a]:focus-visible:outline-2 [&>a]:focus-visible:outline-offset-2 [&>a]:focus-visible:outline-brand-gold [&>button]:grid [&>button]:h-10 [&>button]:w-10 [&>button]:place-items-center [&>button]:focus-visible:outline-2 [&>button]:focus-visible:outline-offset-2 [&>button]:focus-visible:outline-brand-gold">
                <SearchModal />
              </div>
              <div className="hidden h-10 w-10 place-items-center text-brand-gold min-[900px]:grid [&>a]:grid [&>a]:h-10 [&>a]:w-10 [&>a]:place-items-center [&>a]:focus-visible:outline-2 [&>a]:focus-visible:outline-offset-2 [&>a]:focus-visible:outline-brand-gold [&>button]:grid [&>button]:h-10 [&>button]:w-10 [&>button]:place-items-center [&>button]:focus-visible:outline-2 [&>button]:focus-visible:outline-offset-2 [&>button]:focus-visible:outline-brand-gold [&>div>button]:grid [&>div>button]:h-10 [&>div>button]:w-10 [&>div>button]:place-items-center">
                <UserMenu />
              </div>
              <button
                onClick={openCart}
                aria-label="Carrito"
                className="relative grid h-10 w-10 place-items-center text-brand-cream hover:text-brand-gold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              >
                <CartIcon className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] leading-none text-brand-black">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 min-[1180px]:hidden">
            <button className="absolute inset-0 bg-brand-black/60" onClick={() => setMobileOpen(false)} aria-label="Cerrar menu" />
            <div role="dialog" aria-modal="true" aria-label="Menu principal" className="absolute left-0 top-0 h-full w-[min(86vw,340px)] bg-brand-black border-r border-brand-gold-dark/20 p-6 pt-8 flex flex-col gap-4 overflow-y-auto">
              <button
                className="self-end text-brand-cream cursor-pointer"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menu"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-5 border-y border-brand-gold-dark/20 py-4 min-[900px]:hidden">
                <SearchModal />
                <UserMenu />
              </div>
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    className="block text-brand-cream font-medium py-2 hover:text-brand-gold transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.submenu && (
                    <div className="pl-4 flex flex-col gap-2 mt-1">
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="text-sm text-brand-cream/70 hover:text-brand-gold transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <div
        aria-hidden="true"
        className={`h-[calc(var(--topbar-height)+var(--header-height-mobile))] md:h-[calc(var(--topbar-height)+70px)] min-[1180px]:h-[calc(var(--topbar-height)+76px)] ${isHome ? 'bg-brand-black' : ''}`}
      />
    </>
  );
}
