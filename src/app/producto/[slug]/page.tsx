import { notFound } from 'next/navigation';
import { db } from '@/db';
import { topBarMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGallery } from '@/components/product/ProductGallery';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ProductCard } from '@/components/catalog/ProductCard';
import { getProductBySlug, getRelatedProducts } from '@/db/queries/products';
import { ProductReviews } from '@/components/product/ProductReviews';
import { WishlistButton } from '@/components/product/WishlistButton';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: `${product.name} - ${product.brandName}`,
    description: product.description ?? `Decant de ${product.name} por ${product.brandName}. Disponible en 5ml y 10ml, 100% original.`,
    openGraph: {
      title: `${product.name} - ${product.brandName}`,
      description: product.description ?? `Decant de ${product.name}, 100% original.`,
      images: product.images[0]?.imageUrl ? [product.images[0].imageUrl] : [],
    },
  };
}

const genderLabels: Record<string, string> = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  unisex: 'Unisex',
};

const typeLabels: Record<string, string> = {
  arabe: 'Árabe',
  diseñador: 'Diseñador',
  nicho: 'Nicho',
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const messages = await db
    .select({ id: topBarMessages.id, message: topBarMessages.message })
    .from(topBarMessages)
    .where(eq(topBarMessages.isActive, true))
    .orderBy(topBarMessages.displayOrder);

  const related = await getRelatedProducts(product.brandId, product.id);

  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <TopBar messages={messages} />
      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb simple */}
        <p className="text-xs text-brand-text-muted mb-8">
          Decants / {typeLabels[product.perfumeType]} / {product.name}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery images={product.images} productName={product.name} />

          <div>
               <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-brand-text-muted uppercase tracking-wide mb-1">{product.brandName}</p>
                <h1 className="font-display italic text-4xl text-brand-text-dark mb-4">{product.name}</h1>
              </div>
              <WishlistButton productId={product.id} className="mt-2" />
            </div>

            {product.dupeOf && (
              <p className="text-sm text-brand-gold-dark mb-4 italic">{product.dupeOf}</p>
            )}

            {product.description && (
              <p className="text-sm text-brand-text-muted leading-relaxed mb-6">{product.description}</p>
            )}

            <VariantSelector variants={product.variants} />

            {/* Info adicional */}
            <div className="mt-8 pt-8 border-t border-brand-beige-line grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-brand-text-muted">Género</span>
              <span className="text-brand-text-dark">{genderLabels[product.gender]}</span>

              <span className="text-brand-text-muted">Concentración</span>
              <span className="text-brand-text-dark">{product.concentration}</span>

              <span className="text-brand-text-muted">Tipo</span>
              <span className="text-brand-text-dark">{typeLabels[product.perfumeType]}</span>

              {product.families.length > 0 && (
                <>
                  <span className="text-brand-text-muted">Familia Olfativa</span>
                  <span className="text-brand-text-dark">{product.families.join(', ')}</span>
                </>
              )}

              {product.notes.length > 0 && (
                <>
                  <span className="text-brand-text-muted">Notas</span>
                  <span className="text-brand-text-dark">{product.notes.join(', ')}</span>
                </>
              )}

              {product.seasons.length > 0 && (
                <>
                  <span className="text-brand-text-muted">Temporada</span>
                  <span className="text-brand-text-dark">{product.seasons.join(', ')}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} />
        {/* Relacionados */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display italic text-3xl text-brand-text-dark mb-8">
              También de {product.brandName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}