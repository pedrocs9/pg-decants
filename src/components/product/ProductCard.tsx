'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { WishlistButton } from '@/components/product/WishlistButton';
import { formatCLPAmount } from '@/lib/currency';

export type ProductCardVariant = 'default' | 'carousel' | 'catalog';

export type ProductCardProduct = {
  id: number;
  slug: string;
  name: string;
  brandName?: string;
  imageUrl?: string | null;
  hoverImageUrl?: string | null;
  imageAlt?: string;
  minPrice: number;
  maxPrice?: number | null;
  isFavorite?: boolean;
  isNew?: boolean;
};

type ProductCardProps = {
  product: ProductCardProduct;
  variant?: ProductCardVariant;
  pricePrefix?: 'from' | 'none';
  className?: string;
};

const variantClasses: Record<ProductCardVariant, {
  root: string;
  image: string;
  info: string;
  wishlist: string;
  name: string;
  sizes: string;
  action: string;
}> = {
  default: {
    root: 'group relative block bg-brand-white/95 border border-brand-beige-line transition-[border-color,transform] duration-500 motion-reduce:transition-none hover:border-brand-gold/45 hover:-translate-y-0.5',
    image: 'aspect-[4/5]',
    info: 'px-3.5 py-4 sm:px-4',
    wishlist: 'top-3 right-3',
    name: '',
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
    action: 'hidden lg:flex',
  },
  carousel: {
    root: 'group relative flex-shrink-0 w-52 sm:w-64 bg-brand-white/95 border border-brand-beige-line transition-[border-color,transform] duration-500 motion-reduce:transition-none hover:border-brand-gold/45 hover:-translate-y-0.5',
    image: 'aspect-[4/5]',
    info: 'px-3.5 py-4 sm:px-4',
    wishlist: 'top-3 right-3',
    name: '',
    sizes: '(max-width: 640px) 208px, 256px',
    action: 'hidden lg:flex',
  },
  catalog: {
    root: 'group relative block bg-brand-white/95 border border-brand-beige-line transition-[border-color,transform] duration-500 motion-reduce:transition-none hover:border-brand-gold/45 hover:-translate-y-0.5',
    image: 'aspect-[4/5]',
    info: 'px-3 py-3.5 sm:px-4 sm:py-4',
    wishlist: 'top-2.5 right-2.5 sm:top-3 sm:right-3',
    name: '',
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
    action: 'hidden lg:flex',
  },
};

function PriceDisplay({
  minPrice,
  maxPrice,
  prefix,
}: {
  minPrice: number;
  maxPrice?: number | null;
  prefix: 'from' | 'none';
}) {
  const min = Math.round(minPrice);
  const max = maxPrice == null ? null : Math.round(maxPrice);

  if (max != null && max !== min) {
    return (
      <span className="inline-flex flex-wrap items-baseline gap-x-1">
        <span className="text-brand-gold-dark font-semibold">
          ${formatCLPAmount(min)} - ${formatCLPAmount(max)}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-brand-text-muted">CLP</span>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1">
      {prefix === 'from' && <span className="text-brand-text-muted">Desde</span>}
      <span className="text-brand-gold-dark font-semibold">${formatCLPAmount(min)}</span>
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-brand-text-muted">CLP</span>
    </span>
  );
}

export function ProductCard({
  product,
  variant = 'default',
  pricePrefix = 'from',
  className = '',
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const styles = variantClasses[variant];
  const brandLabel = product.brandName ?? 'Decant';

  return (
    <article
      className={`${styles.root} ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`product-card-wishlist absolute z-10 ${styles.wishlist}`}>
        <WishlistButton
          productId={product.id}
          initialIsInWishlist={product.isFavorite}
          className="grid h-10 w-10 place-items-center border border-brand-beige-line/80 bg-brand-cream/90 text-brand-text-dark backdrop-blur-sm hover:border-brand-gold hover:bg-brand-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold motion-reduce:transition-none"
        />
      </div>

      <Link
        href={`/producto/${product.slug}`}
        className="block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
      >
        <div className={`product-card-image relative overflow-hidden bg-brand-cream ${styles.image}`}>
          {product.imageUrl ? (
            <>
              <Image
                src={product.imageUrl}
                alt={product.imageAlt ?? product.name}
                fill
                sizes={styles.sizes}
                className={`object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                  hovered && product.hoverImageUrl ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100 group-hover:scale-[1.02]'
                }`}
              />
              {product.hoverImageUrl && (
                <Image
                  src={product.hoverImageUrl}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes={styles.sizes}
                  className={`object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                    hovered ? 'opacity-100 scale-[1.02]' : 'opacity-0 scale-100'
                  }`}
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#F8F4EC_0%,#EFE7D8_100%)]">
              <span className="border-y border-brand-gold-dark/30 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-brand-text-muted">
                Sin imagen
              </span>
            </div>
          )}

          {product.isNew && (
            <span className="absolute top-3 left-3 bg-brand-gold/90 text-brand-black text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 font-semibold">
              Nuevo
            </span>
          )}

          <div className="absolute inset-0 bg-brand-black/0 transition-colors duration-500 group-hover:bg-brand-black/[0.04] motion-reduce:transition-none" />
        </div>

        <div className={`product-card-info flex min-h-[150px] flex-col ${styles.info}`}>
          <p className="mb-2 min-h-[16px] text-[10px] font-medium uppercase tracking-[0.16em] text-brand-text-muted sm:text-[11px]">
            {brandLabel}
          </p>
          <p className={`product-card-name min-h-[42px] text-sm font-medium leading-snug text-brand-text-dark transition-colors duration-300 group-hover:text-brand-gold-dark sm:text-[15px] ${styles.name}`}>
            {product.name}
          </p>
          <p className="mt-3 text-sm leading-snug text-brand-text-muted">
            <PriceDisplay minPrice={product.minPrice} maxPrice={product.maxPrice} prefix={pricePrefix} />
          </p>

          <span
            aria-hidden="true"
            className={`product-card-action mt-auto pt-5 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-text-dark opacity-0 translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 motion-reduce:transition-none ${styles.action}`}
          >
            Ver fragancia
            <span className="h-px w-8 bg-brand-gold-dark transition-all duration-500 group-hover:w-10 motion-reduce:transition-none" />
          </span>
        </div>
      </Link>
    </article>
  );
}
