'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Productos', href: '/admin/productos' },
  { label: 'Pedidos', href: '/admin/pedidos' },
  { label: 'Marcas', href: '/admin/marcas' },
  { label: 'Familias Olfativas', href: '/admin/familias' },
  { label: 'Notas Olfativas', href: '/admin/notas' },
  { label: 'Temporadas', href: '/admin/temporadas' },
  { label: 'Home: Banners', href: '/admin/hero-slides' },
  { label: 'Home: Mensajes', href: '/admin/mensajes' },
  { label: 'Franja de Confianza', href: '/admin/trust-badges' },
  { label: 'Envío', href: '/admin/envio' },
  { label: 'Solicitudes', href: '/admin/solicitudes' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        // Dashboard solo debe marcarse activo en /admin exacto, el resto por prefijo
        const isActive =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 text-sm rounded transition-colors ${
              isActive
                ? 'bg-brand-gold text-brand-black font-medium'
                : 'text-brand-cream hover:bg-brand-cream/10'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}