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
  { label: '¿No Encontraste tu Perfume?', href: '/no-encontraste' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [decantsOpen, setDecantsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-brand-black border-b transition-all duration-300 ${
        scrolled ? 'border-brand-gold-dark/40 shadow-md' : 'border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-16' : 'h-20'
          }`}
        >
          {/* Nav izquierda (desktop) */}
         <nav className="hidden lg:flex items-center gap-10">
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
                    className={`relative flex items-center gap-1.5 text-sm py-1 transition-colors cursor-pointer group ${
                      isActive ? 'text-brand-gold font-medium' : 'text-brand-gold hover:text-brand-cream '
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
                  className={`relative text-sm py-1 transition-colors group ${
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

          {/* Botón menú mobile */}
          <button
            className="lg:hidden text-brand-cream cursor-pointer"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          {/* Logo centro */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/brand/fondodorado.png"
              alt="P&G Decants"
              width={scrolled ? 140 : 180}
              height={scrolled ? 35 : 45}
              priority
              className="transition-all duration-300"
            />
          </Link>

          {/* Iconos derecha */}
          <div className="flex items-center gap-5">
           <SearchModal />
            <div className="hidden sm:block">
              <UserMenu />
            </div>
            <button
              onClick={openCart}
              aria-label="Carrito"
              className="relative text-brand-cream hover:text-brand-gold transition-colors cursor-pointer"
            >
              <CartIcon className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú mobile (drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brand-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-brand-black p-6 flex flex-col gap-4">
            <button
              className="self-end text-brand-cream cursor-pointer"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
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
  );
}