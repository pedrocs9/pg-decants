import { db } from '@/db';
import { topBarMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactForm } from './ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctanos ante cualquier duda o consulta sobre nuestros decants. Te respondemos a la brevedad.',
};

export default async function ContactoPage() {
  const messages = await db
    .select({ id: topBarMessages.id, message: topBarMessages.message })
    .from(topBarMessages)
    .where(eq(topBarMessages.isActive, true))
    .orderBy(topBarMessages.displayOrder);

  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <TopBar messages={messages} />
      <Header />

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-display italic text-4xl text-brand-text-dark mb-3 text-center">
          Contáctanos
        </h1>
        <p className="text-brand-text-muted text-center mb-10">
          ¿Tienes alguna duda o consulta? Escríbenos y te responderemos a la brevedad.
        </p>

        <ContactForm />

        <div className="mt-12 pt-8 border-t border-brand-beige-line grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-center">
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-text-muted mb-1">Email</p>
            <p className="text-brand-text-dark">contacto@pgdecants.cl</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-text-muted mb-1">WhatsApp</p>
            <p className="text-brand-text-dark">+56 9 1234 5678</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}