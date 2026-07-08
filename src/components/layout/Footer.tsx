import Link from 'next/link';
import Image from 'next/image';
import { InstagramIcon, WhatsappIcon } from '@/components/icons';

const categoryLinks = [
  { label: 'Decants para Él', href: '/decants?genero=masculino' },
  { label: 'Decant para Ella', href: '/decants?genero=femenino' },
  { label: '¿No encontraste tu perfume?', href: '/no-encontraste' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Diseñador', href: '/decants?tipo=diseñador' },
  { label: 'Árabe', href: '/decants?tipo=arabe' },
  { label: 'Nicho', href: '/decants?tipo=nicho' },
];

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-cream">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-brand-cream/10">
        <h3 className="font-display italic text-2xl">Suscríbete para ofertas y novedades</h3>
        <form className="w-full md:w-auto flex flex-col gap-1">
          <div className="flex w-full md:w-96">
            <input
              type="email"
              placeholder="Pon aquí tu email"
              className="flex-1 bg-brand-cream text-brand-text-dark px-4 py-2.5 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-brand-gold text-brand-black px-5 py-2.5 text-sm font-medium hover:bg-brand-gold-dark transition-colors cursor-pointer"
            >
              Entérate de todo
            </button>
          </div>
          <span className="text-xs text-brand-cream/50">*Acepto recibir correos promocionales</span>
        </form>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <Image
            src="/brand/logo-horizontal-fondo-negro.png"
            alt="P&G Decants"
            width={160}
            height={40}
            className="mb-4"
          />
          <p className="text-sm text-brand-cream/70">Ahumada 236, of. 808, Santiago</p>
          <p className="text-sm text-brand-cream/70 mt-2">
            Lunes a Viernes: 10:30 – 15:00 y 16:00 – 19:00
            <br />
            Sábado: 10:30 – 14:30
          </p>
          <a href="mailto:contacto@pgdecants.cl" className="text-sm text-brand-gold block mt-2">
            contacto@pgdecants.cl
          </a>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-brand-gold">Categorías</h4>
          <ul className="flex flex-col gap-2">
            {categoryLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-brand-cream/80 hover:text-brand-gold transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-brand-gold">Información</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/nosotros" className="text-sm text-brand-cream/80 hover:text-brand-gold transition-colors">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="text-sm text-brand-cream/80 hover:text-brand-gold transition-colors">
                Términos y políticas
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-brand-gold">Síguenos</h4>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a href="https://wa.me/56900000000" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">
              <WhatsappIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-cream/10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-cream/50">
          <p>© {new Date().getFullYear()} P&G Decants. Decants de perfumes originales de 3, 5 y 10ml con envío a todo Chile.</p>
        </div>
      </div>
    </footer>
  );
}