import Image from 'next/image';
import Link from 'next/link';
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

const infoLinks = [
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Términos y políticas', href: '/terminos' },
];

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-cream">
      <div className="border-b border-brand-cream/10">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,0.9fr)_minmax(340px,1fr)] md:items-center lg:px-8 lg:py-12">
          <div>
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-brand-gold/80">
              Comunidad PG Decants
            </p>
            <h2 className="mt-3 font-display text-3xl italic leading-tight text-brand-cream sm:text-4xl">
              Suscríbete para ofertas y novedades
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-cream/62">
              Recibe lanzamientos, recomendaciones y oportunidades especiales para descubrir tu próxima fragancia.
            </p>
          </div>

          <form className="w-full" aria-label="Suscripcion a ofertas y novedades">
            <label htmlFor="footer-newsletter-email" className="sr-only">
              Email para suscribirte
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="footer-newsletter-email"
                type="email"
                name="email"
                placeholder="Pon aquí tu email"
                autoComplete="email"
                className="min-h-12 flex-1 border border-brand-cream/14 bg-brand-cream px-4 text-sm text-brand-text-dark outline-none transition-colors placeholder:text-brand-text-muted/70 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30"
              />
              <button
                type="submit"
                className="min-h-12 border border-brand-gold bg-brand-gold px-6 text-sm font-medium text-brand-black transition-colors hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:ring-offset-2 focus:ring-offset-brand-black"
              >
                Entérate de todo
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-brand-cream/50">
              *Acepto recibir correos promocionales
            </p>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-11 sm:px-6 md:grid-cols-[1.25fr_0.8fr_0.8fr_0.8fr] lg:px-8">
        <div className="max-w-sm">
          <Link href="/" aria-label="Ir al inicio de P&G Decants">
            <Image
              src="/brand/logo-horizontal-fondo-negro.png"
              alt="P&G Decants"
              width={170}
              height={43}
              className="h-auto w-[150px] sm:w-[170px]"
            />
          </Link>
          <p className="mt-5 text-sm leading-6 text-brand-cream/68">
            Decants de perfumes originales de 3, 5 y 10ml con envío a todo Chile.
          </p>
          <address className="mt-5 not-italic text-sm leading-6 text-brand-cream/68">
            Ahumada 236, of. 808, Santiago
          </address>
          <a
            href="mailto:contacto@pgdecants.cl"
            className="mt-3 inline-flex min-h-11 items-center text-sm text-brand-gold transition-colors hover:text-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          >
            contacto@pgdecants.cl
          </a>
        </div>

        <nav aria-label="Categorias del footer">
          <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">
            Categorías
          </h3>
          <ul className="mt-5 flex flex-col gap-2.5">
            {categoryLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-9 items-center text-sm text-brand-cream/74 transition-colors hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Informacion y ayuda">
          <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">
            Información
          </h3>
          <ul className="mt-5 flex flex-col gap-2.5">
            {infoLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-9 items-center text-sm text-brand-cream/74 transition-colors hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-7 border-t border-brand-cream/10 pt-5 text-sm leading-6 text-brand-cream/62">
            <p>Lunes a Viernes: 10:30 - 15:00 y 16:00 - 19:00</p>
            <p>Sábado: 10:30 - 14:30</p>
          </div>
        </nav>

        <div>
          <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">
            Contacto
          </h3>
          <p className="mt-5 text-sm leading-6 text-brand-cream/62">
            Escríbenos para resolver dudas sobre disponibilidad, aromas o el formato ideal para ti.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de P&G Decants"
              className="flex h-11 w-11 items-center justify-center border border-brand-cream/14 text-brand-cream/78 transition-colors hover:border-brand-gold hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/56900000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp de P&G Decants"
              className="flex h-11 w-11 items-center justify-center border border-brand-cream/14 text-brand-cream/78 transition-colors hover:border-brand-gold hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            >
              <WhatsappIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-cream/10 px-4 pb-24 pt-5 sm:px-6 sm:pb-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs leading-5 text-brand-cream/48 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} P&G Decants. Decants de perfumes originales de 3, 5 y 10ml con envío a todo Chile.
          </p>
          <div className="flex gap-4">
            {infoLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
