'use client';

import { AnimateIn } from '@/components/ui/AnimateIn';

const testimonials = [
  {
    name: 'Valentina R.',
    location: 'Santiago',
    rating: 5,
    text: 'Increíble servicio. Pedí un decant de Baccarat Rouge y llegó perfectamente embalado en menos de 24 horas. El aroma es exactamente igual al original, sin dudas.',
    perfume: 'Baccarat Rouge 540',
  },
  {
    name: 'Matías C.',
    location: 'Viña del Mar',
    rating: 5,
    text: 'Llevaba meses queriendo probar el Bleu de Chanel antes de comprarlo. Gracias a P&G Decants pude confirmarlo sin gastar de más. Ya pedí el frasco completo.',
    perfume: 'Bleu de Chanel EDP',
  },
  {
    name: 'Catalina M.',
    location: 'Concepción',
    rating: 5,
    text: 'El empaque es súper cuidado, llegó con una tarjeta personalizada. Lo usé como regalo y quedaron encantados. Definitivamente vuelvo a comprar.',
    perfume: 'YSL Libre',
  },
  {
    name: 'Felipe A.',
    location: 'Temuco',
    rating: 5,
    text: 'Nunca había comprado decants antes y tenía dudas. Pero la calidad es impecable, el frasco viene sellado y el perfume dura todo el día. ¡Recomendado 100%!',
    perfume: 'Dior Sauvage EDP',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <svg
          key={index}
          className="h-3.5 w-3.5 text-brand-gold"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="m10 1.8 2.45 5.12 5.63.76-4.12 3.86 1.03 5.58L10 14.4l-4.99 2.72 1.03-5.58-4.12-3.86 5.63-.76L10 1.8Z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-brand-cream py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-4 border-b border-brand-beige-line pb-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-brand-gold-dark/80">
              Experiencias reales
            </p>
            <h2 className="mt-3 font-display text-3xl italic leading-tight text-brand-text-dark sm:text-4xl">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-brand-text-muted sm:text-right">
            Más de 200 clientes satisfechos en todo Chile.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-brand-beige-line bg-brand-beige-line md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <AnimateIn
              key={testimonial.name}
              delay={index * 90}
              animation="fade-up"
              className="h-full"
            >
              <article className="relative flex h-full min-h-[320px] flex-col bg-brand-white px-5 py-6 transition-colors duration-300 hover:bg-white focus-within:bg-white sm:px-6">
                <span
                  className="absolute right-5 top-5 font-display text-6xl leading-none text-brand-gold/12"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <div className="relative z-10 flex flex-1 flex-col">
                  <Stars count={testimonial.rating} />
                  <p className="mt-7 flex-1 text-sm leading-7 text-brand-text-dark">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="mt-6 border-t border-brand-beige-line pt-4">
                    <p className="font-sans text-sm font-medium text-brand-text-dark">
                      {testimonial.name}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-brand-text-muted">
                      {testimonial.location}
                    </p>
                    <p className="mt-2 text-xs font-medium text-brand-gold-dark">
                      {testimonial.perfume}
                    </p>
                  </div>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
