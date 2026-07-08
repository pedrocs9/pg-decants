import Link from 'next/link';
import Image from 'next/image';
import { ArrowIcon } from '@/components/icons';

type Product = {
  id: number;
  name: string;
  slug: string;
  brandName: string;
  image: string;
  minPrice: number;
};

export function NewArrivalsCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display italic text-3xl sm:text-4xl text-brand-text-dark">
          Nuevos Ingresos
        </h2>
        <Link
          href="/decants"
          className="text-sm text-brand-text-dark hover:text-brand-gold-dark transition-colors flex items-center gap-1"
        >
          Ver todos
          <ArrowIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/producto/${product.slug}`}
            className="flex-shrink-0 w-44 sm:w-64 group"
          >
            <div className="relative h-56 sm:h-80 bg-brand-white overflow-hidden">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 176px, 256px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <span className="absolute top-2 left-2 bg-brand-gold text-brand-black text-[10px] uppercase tracking-wide px-2 py-1">
                Nuevo
              </span>
            </div>
            <div className="pt-3">
              <p className="text-xs text-brand-text-muted uppercase">{product.brandName}</p>
              <p className="text-sm text-brand-text-dark truncate">{product.name}</p>
              <p className="text-sm text-brand-gold-dark font-medium mt-1">
                desde ${product.minPrice.toLocaleString('es-CL')} CLP
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}