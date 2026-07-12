import { db } from '@/db';
import { topBarMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FiltersSidebar } from '@/components/catalog/FiltersSidebar';
import { MobileCatalogControls } from '@/components/catalog/MobileCatalogControls';
import { ProductCard } from '@/components/catalog/ProductCard';
import { getFilteredProducts, getFilterOptions } from '@/db/queries/products';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Decants - Catálogo Completo',
  description: 'Explora nuestro catálogo completo de decants: perfumes de diseñador, árabes y de nicho. Filtra por marca, género, familia olfativa y más.',
};

type SearchParams = {
  genero?: string;
  tipo?: string;
  marca?: string | string[];
  familia?: string | string[];
  temporada?: string | string[];
  buscar?: string;
  orden?: string;
};

function toArray(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value : [value];
}

export default async function DecantsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const messages = await db
    .select({ id: topBarMessages.id, message: topBarMessages.message })
    .from(topBarMessages)
    .where(eq(topBarMessages.isActive, true))
    .orderBy(topBarMessages.displayOrder);

  const [productsResult, filterOptions] = await Promise.all([
   getFilteredProducts({
      genero: params.genero,
      tipo: params.tipo,
      marca: toArray(params.marca),
      familia: toArray(params.familia),
      temporada: toArray(params.temporada),
      buscar: params.buscar,
      orden: (params.orden as 'precio_asc' | 'precio_desc' | 'nombre') ?? 'relevancia',
    }),
    getFilterOptions(),
  ]);

  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <TopBar messages={messages} />
      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="font-display italic text-4xl text-brand-text-dark mb-5 lg:mb-8">Decants</h1>

        <MobileCatalogControls options={filterOptions} productCount={productsResult.length} />

        <div className="flex flex-col lg:flex-row gap-8">
          <FiltersSidebar options={filterOptions} className="hidden lg:block" />

          <div className="flex-1 min-w-0">
            <p className="hidden lg:block text-sm text-brand-text-muted mb-6">
              {productsResult.length} {productsResult.length === 1 ? 'producto' : 'productos'}
            </p>

            {productsResult.length === 0 ? (
              <p className="text-brand-text-muted py-16 text-center">
                No encontramos productos con esos filtros. Intenta ajustar tu búsqueda.
              </p>
            ) : (
              <div id="catalog-grid" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 lg:mt-0">
                {productsResult.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
