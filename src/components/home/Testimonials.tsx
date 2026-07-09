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
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-brand-gold text-sm">★</span>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display italic text-3xl text-brand-text-dark">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-brand-text-muted text-sm mt-2">
            Más de 200 clientes satisfechos en todo Chile
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <AnimateIn key={t.name} delay={i * 120} animation="pop">
              <div className="bg-brand-white border ...">
                <div
                  key={t.name}
                  className="bg-brand-white border border-brand-beige-line p-6 flex flex-col gap-4 hover:border-brand-gold/40 hover:shadow-md transition-all duration-300"
                >
                  <Stars count={t.rating} />
                  <p className="text-sm text-brand-text-dark leading-relaxed flex-1">
                    "{t.text}"
                  </p>
                  <div className="border-t border-brand-beige-line pt-4">
                    <p className="text-sm font-medium text-brand-text-dark">
                      {t.name}
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      {t.location} · {t.perfume}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}