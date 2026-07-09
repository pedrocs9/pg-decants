'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowIcon } from '@/components/icons';
import { WishlistButton } from '@/components/product/WishlistButton';
import { AnimateIn } from '@/components/ui/AnimateIn';


type Product = {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  hoverImage: string | null;
  minPrice: string;
  maxPrice: string;
};

function formatPrice(price: string) {
  return Math.round(Number(price)).toLocaleString('es-CL');
}

function PriceDisplay({ min, max }: { min: string; max: string }) {
  const minVal = Math.round(Number(min));
  const maxVal = Math.round(Number(max));

  if (minVal === maxVal) {
    return <span className="text-brand-gold-dark font-medium">${formatPrice(min)}</span>;
  }

  return (
    <span className="text-brand-gold-dark font-medium">
      ${formatPrice(min)} — ${formatPrice(max)}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex-shrink-0 w-64 sm:w-72 group relative">
      {/* Botón favorito */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton productId={product.id} />
      </div>

      <Link
        href={`/producto/${product.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Imagen */}
        <div className="relative h-80 bg-brand-white overflow-hidden">
          {product.mainImage ? (
            <Image
              src={hovered && product.hoverImage ? product.hoverImage : product.mainImage}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-cream">
              <span className="text-brand-text-muted text-xs">Sin imagen</span>
            </div>
          )}
          {/* Overlay sutil en hover */}
          <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/10 transition-all duration-300" />
        </div>

        {/* Info */}
        <div className="pt-4 pb-1">
          <p className="text-xs text-brand-text-muted uppercase tracking-widest mb-1">Decant</p>
          <p className="text-sm text-brand-text-dark uppercase tracking-wide font-medium group-hover:text-brand-gold-dark transition-colors">
            {product.name}
          </p>
          <p className="text-sm text-brand-text-muted mt-1.5">
            <PriceDisplay min={product.minPrice} max={product.maxPrice} />
            <span className="text-xs text-brand-text-muted ml-1">CLP</span>
          </p>
        </div>

        {/* Línea animada abajo */}
        <div className="h-px bg-brand-beige-line w-0 group-hover:w-full transition-all duration-300 mt-2" />
      </Link>
    </div>
  );
}

export function BestSellersCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="w-full min-w-0 py-16 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <AnimateIn animation="fade-up">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display italic text-3xl sm:text-4xl text-brand-text-dark">Los Más Deseados</h2>
              <p className="text-brand-text-muted text-sm mt-1">Los decants que más eligen nuestros clientes</p>
            </div>
            <Link href="/decants" className="text-sm text-brand-text-dark hover:text-brand-gold-dark transition-colors flex items-center gap-1 flex-shrink-0">
              Ver todos
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </AnimateIn>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}