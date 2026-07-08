'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowIcon } from '@/components/icons';

type Product = {
  id: number;
  name: string;
  slug: string;
  mainImage: string;
  hoverImage: string | null;
  minPrice: string;
};

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="flex-shrink-0 w-64 sm:w-72 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-80 bg-brand-white overflow-hidden">
        <Image
          src={hovered && product.hoverImage ? product.hoverImage : product.mainImage}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-300"
        />
      </div>
      <div className="pt-3">
        <p className="text-sm text-brand-text-dark uppercase tracking-wide">{product.name}</p>
        <p className="text-sm text-brand-text-muted mt-1">
          desde <span className="text-brand-gold-dark font-medium">${product.minPrice} CLP</span>
        </p>
      </div>
    </Link>
  );
}

export function BestSellersCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display italic text-3xl sm:text-4xl text-brand-text-dark">
          Los Más Deseados
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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}