import { AnimateIn } from '@/components/ui/AnimateIn';

const reasons = [
  {
    icon: '💸',
    title: 'Ahorra sin renunciar al lujo',
    description: 'Prueba un perfume de $200.000 por una fracción del precio. Si no te convence, no perdiste nada.',
  },
  {
    icon: '🧪',
    title: 'Descubre antes de comprometerte',
    description: 'Un perfume huele distinto en tu piel que en la tienda. Pruébalo en tu día a día antes de comprar el frasco completo.',
  },
  {
    icon: '✈️',
    title: 'Perfecto para viajar',
    description: 'Lleva tu fragancia favorita en un frasco pequeño sin preocuparte por los límites de líquidos en el avión.',
  },
  {
    icon: '🎁',
    title: 'El regalo ideal',
    description: 'Un decant es un regalo elegante, original y personalizado. Ideal para quien ya tiene todo.',
  },
  {
    icon: '🌿',
    title: 'Consume con conciencia',
    description: 'Menos desperdicio, menos empaque. Solo llevas lo que realmente vas a usar.',
  },
  {
    icon: '💎',
    title: '100% originales',
    description: 'Todos nuestros decants se extraen directamente del frasco original. Nunca copias ni imitaciones.',
  },
];

export function WhyDecant() {
  return (
    <section className="py-20 bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display italic text-3xl text-brand-cream">
            ¿Por qué comprar un decant?
          </h2>
          <p className="text-brand-cream/60 text-sm mt-2">
            La forma más inteligente de disfrutar la perfumería de lujo
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <AnimateIn key={r.title} delay={i * 100} animation="fade-up">
              <div className="group border border-brand-cream/10 p-6 ...">
                <div
                  key={r.title}
                  className="group border border-brand-cream/10 p-6 flex flex-col gap-3 hover:border-brand-gold/50 hover:bg-brand-cream/5 transition-all duration-300"
                >
                  <span className="text-3xl">{r.icon}</span>
                  <h3 className="font-medium text-brand-cream group-hover:text-brand-gold transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-sm text-brand-cream/60 leading-relaxed">
                    {r.description}
                  </p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}