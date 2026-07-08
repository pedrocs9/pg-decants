import type { Metadata } from 'next';
import { db } from '@/db';
import { topBarMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PerfumeRequestForm } from './PerfumeRequestForm';

export const metadata: Metadata = {
  title: '¿No Encontraste tu Perfume?',
  description: 'Cuéntanos qué fragancia buscas y te avisaremos apenas la tengamos disponible.',
};

export default async function NoEncontrastePage() {
  const messages = await db
    .select({ id: topBarMessages.id, message: topBarMessages.message })
    .from(topBarMessages)
    .where(eq(topBarMessages.isActive, true))
    .orderBy(topBarMessages.displayOrder);

  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <TopBar messages={messages} />
      <Header />

      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display italic text-4xl text-brand-text-dark mb-3 text-center">
          ¿No Encontraste tu Perfume?
        </h1>
        <p className="text-brand-text-muted text-center mb-10">
          Cuéntanos qué fragancia buscas y te avisaremos apenas la tengamos disponible en nuestro catálogo.
        </p>

        <PerfumeRequestForm />
      </div>

      <Footer />
    </main>
  );
}