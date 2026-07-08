import { db } from '@/db';
import { topBarMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/catalog/ProductCard';
import { getUserWishlist } from '@/app/wishlist-actions';
import Link from 'next/link';

export default async function FavoritosPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const messages = await db
    .select({ id: topBarMessages.id, message: topBarMessages.message })
    .from(topBarMessages)
    .where(eq(topBarMessages.isActive, true))
    .orderBy(topBarMessages.displayOrder);

  const wishlist = await getUserWishlist();

  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <TopBar messages={messages} />
      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display italic text-4xl text-brand-text-dark mb-8">Mis Favoritos</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-brand-text-muted mb-4">Aún no tienes productos favoritos.</p>
            <Link href="/decants" className="text-brand-gold-dark hover:underline text-sm">
              Explorar decants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}