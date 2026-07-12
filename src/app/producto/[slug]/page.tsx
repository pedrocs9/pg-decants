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
import { FamilyChips, NoteChips, SeasonChips } from '@/components/product/ProductAttributes';
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

function getDescriptionExcerpt(description: string) {
  const normalized = description.trim();
  if (normalized.length <= 220) return normalized;
  return `${normalized.slice(0, 220).trim()}...`;
}

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

      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-brand-text-muted sm:mb-8">
          <ol className="flex flex-wrap items-center gap-2">
            <li>Decants</li>
            <li aria-hidden="true">/</li>
            <li>{typeLabels[product.perfumeType]}</li>
            <li aria-hidden="true">/</li>
            <li className="text-brand-text-dark">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)] lg:gap-12 xl:gap-16">
          <ProductGallery images={product.images} productName={product.name} />

          <section className="lg:sticky lg:top-[calc(var(--topbar-height)+76px+24px)] lg:self-start">
            <div className="border border-brand-beige-line bg-brand-cream/45 px-5 py-6 sm:px-7 sm:py-8 lg:px-8">
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  {product.brandName && (
                    <p className="mb-2 font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-gold-dark">
                      {product.brandName}
                    </p>
                  )}
                  <h1 className="font-display text-4xl italic leading-[0.95] text-brand-text-dark sm:text-5xl lg:text-6xl">
                    {product.name}
                  </h1>
                </div>
                <WishlistButton
                  productId={product.id}
                  className="grid min-h-11 min-w-11 place-items-center border border-brand-beige-line bg-brand-white text-brand-text-dark hover:border-brand-gold hover:text-brand-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                />
              </div>

              {product.dupeOf && (
                <p className="mt-4 text-sm italic text-brand-gold-dark">{product.dupeOf}</p>
              )}

              {product.description && (
                <div id="descripcion-fragancia" className="mt-5 border-t border-brand-beige-line pt-5">
                  <p className="line-clamp-4 text-sm leading-7 text-brand-text-muted">
                    {getDescriptionExcerpt(product.description)}
                  </p>
                  <a
                    href="#descripcion-fragancia"
                    className="mt-3 inline-flex text-xs font-medium uppercase tracking-[0.16em] text-brand-gold-dark transition-colors hover:text-brand-text-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
                  >
                    Conocer la fragancia
                  </a>
                </div>
              )}

              <div className="mt-7">
                <VariantSelector variants={product.variants} />
              </div>
            </div>
          </section>
        </div>

        {/* Info adicional */}
        <section className="mt-12 border-t border-brand-beige-line pt-8 lg:mt-16">
          <h2 className="mb-6 font-display text-3xl italic text-brand-text-dark">
            Detalles de la fragancia
          </h2>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1fr)]">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-brand-text-muted">Género</span>
              <span className="text-brand-text-dark">{genderLabels[product.gender]}</span>

              <span className="text-brand-text-muted">Concentración</span>
              <span className="text-brand-text-dark">{product.concentration}</span>

              <span className="text-brand-text-muted">Tipo</span>
              <span className="text-brand-text-dark">{typeLabels[product.perfumeType]}</span>
            </div>

            <div className="space-y-4">
              {product.families.length > 0 && (
                <div className="flex flex-col gap-3 border-b border-brand-beige-line pb-4 sm:flex-row sm:items-start">
                  <span className="w-36 flex-shrink-0 text-xs uppercase tracking-wide text-brand-gold-dark">Familia Olfativa</span>
                  <FamilyChips families={product.families} />
                </div>
              )}
              {product.notes.length > 0 && (
                <div className="flex flex-col gap-3 border-b border-brand-beige-line pb-4 sm:flex-row sm:items-start">
                  <span className="w-36 flex-shrink-0 text-xs uppercase tracking-wide text-brand-gold-dark">Notas</span>
                  <NoteChips notes={product.notes} />
                </div>
              )}
              {product.seasons.length > 0 && (
                <div className="flex flex-col gap-3 border-b border-brand-beige-line pb-4 sm:flex-row sm:items-start">
                  <span className="w-36 flex-shrink-0 text-xs uppercase tracking-wide text-brand-gold-dark">Temporada</span>
                  <SeasonChips seasons={product.seasons} />
                </div>
              )}
            </div>
          </div>
        </section>

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
