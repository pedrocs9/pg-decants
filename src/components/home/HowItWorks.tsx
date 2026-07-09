'use client';

import { AnimateIn } from '@/components/ui/AnimateIn';

const steps = [
  {
    number: '01',
    title: 'Elige tu fragancia',
    description: 'Explora nuestra colección de decants de marcas de lujo y nicho. Filtra por género, familia olfativa o marca.',
  },
  {
    number: '02',
    title: 'Paga de forma segura',
    description: 'Acepta Mercado Pago y próximamente Webpay. Tu compra está 100% protegida.',
  },
  {
    number: '03',
    title: 'Recíbelo en casa',
    description: 'Despachamos a todo Chile en 24-48 horas. Cada decant viene cuidadosamente embalado.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimateIn animation="fade-up">
          <div className="text-center mb-14">
            <h2 className="font-display italic text-3xl text-brand-text-dark">¿Cómo funciona?</h2>
            <p className="text-brand-text-muted text-sm mt-2">Simple, rápido y seguro</p>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-brand-beige-line" />

          {steps.map((step, i) => (
            <AnimateIn key={step.number} delay={i * 150} animation="fade-up">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-brand-gold flex items-center justify-center flex-shrink-0 bg-brand-white">
                  <span className="font-display italic text-brand-gold text-lg">{step.number}</span>
                </div>
                <div>
                  <h3 className="font-medium text-brand-text-dark mb-2">{step.title}</h3>
                  <p className="text-sm text-brand-text-muted leading-relaxed">{step.description}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}