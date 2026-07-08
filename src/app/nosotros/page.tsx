import { db } from '@/db';
import { topBarMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce la historia de P&G Decants y nuestra pasión por acercar las grandes fragancias del mundo a todos.',
};

export default async function NosotrosPage() {
  const messages = await db
    .select({ id: topBarMessages.id, message: topBarMessages.message })
    .from(topBarMessages)
    .where(eq(topBarMessages.isActive, true))
    .orderBy(topBarMessages.displayOrder);

  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <TopBar messages={messages} />
      <Header />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display italic text-4xl sm:text-5xl text-brand-text-dark mb-8 text-center">
          Nuestra Historia
        </h1>

        <div className="relative w-full h-72 sm:h-96 mb-10 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200&q=80"
            alt="P&G Decants"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-6 text-brand-text-dark leading-relaxed">
          <p>
            P&G Decants nace de una pasión genuina por la perfumería y el deseo de hacer accesibles
            las grandes fragancias del mundo, sin comprometer la calidad ni la autenticidad.
          </p>
          <p>
            Creemos que encontrar tu aroma ideal no debería significar arriesgar una inversión
            grande en una botella completa. Por eso ofrecemos decants —fracciones cuidadosamente
            extraídas de perfumes 100% originales— en formatos de 5ml y 10ml, perfectos para
            descubrir, probar y disfrutar sin comprar a ciegas.
          </p>
          <p>
            Cada decant que preparamos pasa por un proceso riguroso de extracción y envasado,
            garantizando que lo que recibes es exactamente la misma fragancia del frasco original,
            en un formato compacto y elegante, listo para acompañarte a donde vayas.
          </p>
          <p>
            Trabajamos con perfumes de diseñador, colecciones árabes y fragancias de nicho,
            despachando a todo Chile con el mismo cuidado y dedicación en cada envío.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 text-center">
          <div>
            <p className="font-display italic text-3xl text-brand-gold-dark mb-1">100%</p>
            <p className="text-sm text-brand-text-muted">Fragancias Originales</p>
          </div>
          <div>
            <p className="font-display italic text-3xl text-brand-gold-dark mb-1">24-48h</p>
            <p className="text-sm text-brand-text-muted">Tiempo de Preparación</p>
          </div>
          <div>
            <p className="font-display italic text-3xl text-brand-gold-dark mb-1">Chile</p>
            <p className="text-sm text-brand-text-muted">Envíos a Todo el País</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}