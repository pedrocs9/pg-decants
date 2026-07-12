'use client';

import { AnimateIn } from '@/components/ui/AnimateIn';

const steps = [
  {
    number: '01',
    title: 'Elige tu fragancia',
    description: 'Explora nuestra coleccion de decants de marcas de lujo y nicho. Filtra por genero, familia olfativa o marca.',
  },
  {
    number: '02',
    title: 'Paga de forma segura',
    description: 'Acepta Mercado Pago y proximamente Webpay. Tu compra esta 100% protegida.',
  },
  {
    number: '03',
    title: 'Recibelo en casa',
    description: 'Despachamos a todo Chile en 24-48 horas. Cada decant viene cuidadosamente embalado.',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-brand-cream py-14 sm:py-16 lg:py-[4.5rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn animation="fade-up">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-gold-dark">Compra simple</p>
            <h2 className="font-display italic text-3xl text-brand-text-dark sm:text-4xl">Como funciona</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-muted">Simple, rapido y seguro desde la eleccion hasta el despacho.</p>
          </div>
        </AnimateIn>

        <div className="relative grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
          <div className="absolute left-[18%] right-[18%] top-7 hidden h-px bg-brand-beige-line md:block" />

          {steps.map((step, i) => (
            <AnimateIn key={step.number} delay={i * 120} animation="fade-up">
              <div className="relative flex items-start gap-4 border-b border-brand-beige-line pb-5 last:border-b-0 md:flex-col md:items-center md:border-b-0 md:pb-0 md:text-center">
                <div className="grid h-14 w-14 flex-shrink-0 place-items-center border border-brand-gold bg-brand-white">
                  <span className="font-display text-lg italic text-brand-gold-dark">{step.number}</span>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-brand-text-dark">{step.title}</h3>
                  <p className="max-w-sm text-sm leading-relaxed text-brand-text-muted">{step.description}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
