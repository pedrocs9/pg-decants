'use client';

import { AnimateIn } from '@/components/ui/AnimateIn';

type BenefitIcon = 'value' | 'discover' | 'travel' | 'gift' | 'conscious' | 'original';

const reasons: Array<{
  icon: BenefitIcon;
  title: string;
  description: string;
}> = [
  {
    icon: 'value',
    title: 'Ahorra sin renunciar al lujo',
    description:
      'Prueba un perfume de $200.000 por una fracción del precio. Si no te convence, no perdiste nada.',
  },
  {
    icon: 'discover',
    title: 'Descubre antes de comprometerte',
    description:
      'Un perfume huele distinto en tu piel que en la tienda. Pruébalo en tu día a día antes de comprar el frasco completo.',
  },
  {
    icon: 'travel',
    title: 'Perfecto para viajar',
    description:
      'Lleva tu fragancia favorita en un frasco pequeño sin preocuparte por los límites de líquidos en el avión.',
  },
  {
    icon: 'gift',
    title: 'El regalo ideal',
    description:
      'Un decant es un regalo elegante, original y personalizado. Ideal para quien ya tiene todo.',
  },
  {
    icon: 'conscious',
    title: 'Consume con conciencia',
    description:
      'Menos desperdicio, menos empaque. Solo llevas lo que realmente vas a usar.',
  },
  {
    icon: 'original',
    title: '100% originales',
    description:
      'Todos nuestros decants se extraen directamente del frasco original. Nunca copias ni imitaciones.',
  },
];

function LinearIcon({ icon }: { icon: BenefitIcon }) {
  const common = {
    className: 'h-7 w-7',
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (icon === 'value') {
    return (
      <svg {...common}>
        <path d="M6 11h20v14H6z" />
        <path d="M9 11V8.5h14V11" />
        <path d="M16 14v8" />
        <path d="M12.5 17.5h7" />
      </svg>
    );
  }

  if (icon === 'discover') {
    return (
      <svg {...common}>
        <path d="M10 7h12" />
        <path d="M12 7v7.5l-5 8A3 3 0 0 0 9.5 27h13a3 3 0 0 0 2.5-4.5l-5-8V7" />
        <path d="M11 21h10" />
      </svg>
    );
  }

  if (icon === 'travel') {
    return (
      <svg {...common}>
        <path d="M6 20 26 8" />
        <path d="m9 18-3 8 8-3" />
        <path d="m18 13 6 9 2-4-4-7" />
        <path d="m14 15-8-3 4-2 7 1" />
      </svg>
    );
  }

  if (icon === 'gift') {
    return (
      <svg {...common}>
        <path d="M6 14h20v13H6z" />
        <path d="M4 10h24v4H4z" />
        <path d="M16 10v17" />
        <path d="M16 10c-4-5-9-2-6 0" />
        <path d="M16 10c4-5 9-2 6 0" />
      </svg>
    );
  }

  if (icon === 'conscious') {
    return (
      <svg {...common}>
        <path d="M7 23c9 1 16-5 18-16-10 1-17 6-18 16Z" />
        <path d="M9 22c4-6 9-9 15-13" />
        <path d="M12 25c-2-2-3-5-2-8" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M16 5 27 12 16 27 5 12 16 5Z" />
      <path d="M5 12h22" />
      <path d="m11 12 5 15 5-15" />
      <path d="m11 12 5-7 5 7" />
    </svg>
  );
}

export function WhyDecant() {
  return (
    <section className="bg-brand-black py-14 text-brand-cream sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-brand-gold/80">
            Compra con criterio
          </p>
          <h2 className="mt-3 font-display text-3xl italic leading-tight text-brand-cream sm:text-4xl">
            Por qué comprar un decant
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-brand-cream/62 sm:text-base">
            La forma más inteligente de disfrutar la perfumería de lujo, probar sin apuro y elegir con seguridad.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-brand-cream/12 bg-brand-cream/12 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <AnimateIn
              key={reason.title}
              delay={index * 80}
              animation="fade-up"
              className="h-full"
            >
              <article className="group flex h-full min-h-[210px] flex-col gap-5 bg-brand-black px-5 py-7 transition-colors duration-300 hover:bg-brand-cream/[0.035] sm:px-6 lg:px-8">
                <div className="flex h-11 w-11 items-center justify-center border border-brand-cream/18 text-brand-gold transition-colors duration-300 group-hover:border-brand-gold/60 group-focus-within:border-brand-gold/70">
                  <LinearIcon icon={reason.icon} />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-medium uppercase tracking-[0.12em] text-brand-cream">
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-brand-cream/64">
                    {reason.description}
                  </p>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
