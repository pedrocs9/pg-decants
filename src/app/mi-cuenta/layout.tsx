import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { topBarMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default async function MiCuentaLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const messages = await db
    .select({ id: topBarMessages.id, message: topBarMessages.message })
    .from(topBarMessages)
    .where(eq(topBarMessages.isActive, true))
    .orderBy(topBarMessages.displayOrder);

  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <TopBar messages={messages} />
      <Header />

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display italic text-4xl text-brand-text-dark mb-8">Mi Cuenta</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-56 flex-shrink-0">
            <nav className="flex md:flex-col gap-1">
              <Link
                href="/mi-cuenta"
                className="px-3 py-2 text-sm text-brand-text-dark hover:bg-brand-white transition-colors"
              >
                Datos Personales
              </Link>
              <Link
                href="/mi-cuenta/pedidos"
                className="px-3 py-2 text-sm text-brand-text-dark hover:bg-brand-white transition-colors"
              >
                Mis Pedidos
              </Link>
            </nav>
          </aside>

          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>

      <Footer />
    </main>
  );
}