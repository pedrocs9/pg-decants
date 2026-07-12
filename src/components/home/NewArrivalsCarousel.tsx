'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowIcon } from '@/components/icons';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { ProductCard, type ProductCardProduct } from '@/components/product/ProductCard';

type Product = {
  id: number;
  name: string;
  slug: string;
  brandName: string;
  image: string;
  minPrice: number;
};

function toProductCardProduct(product: Product): ProductCardProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brandName: product.brandName,
    imageUrl: product.image,
    imageAlt: product.name,
    minPrice: product.minPrice,
    isNew: true,
  };
}

export function NewArrivalsCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const node = scrollRef.current;
    if (!node) return;
    setCanScrollLeft(node.scrollLeft > 4);
    setCanScrollRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);
  }

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const frame = requestAnimationFrame(updateScrollState);
    const timeout = window.setTimeout(updateScrollState, 300);
    node.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      node.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [products.length]);

  if (products.length === 0) return null;

  function scroll(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  }

  return (
    <section className="bg-brand-cream py-14 sm:py-16 lg:py-[4.5rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn animation="fade-up">
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-gold-dark">Recien llegados</p>
              <h2 className="font-display italic text-3xl text-brand-text-dark sm:text-4xl">Nuevos Ingresos</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-text-muted">Las ultimas fragancias que llegaron a nuestra coleccion.</p>
            </div>
            <div className="flex items-center gap-3">
              <CarouselButton direction="left" onClick={() => scroll('left')} disabled={!canScrollLeft} label="Ver anteriores" />
              <CarouselButton direction="right" onClick={() => scroll('right')} disabled={!canScrollRight} label="Ver siguientes" />
              <Link href="/decants" className="ml-1 hidden items-center gap-1 text-sm text-brand-text-dark transition-colors hover:text-brand-gold-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold sm:flex">
                Ver todos
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimateIn>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth sm:gap-6">
          {products.map((product, i) => (
            <AnimateIn key={product.id} delay={i * 80} animation="fade-up">
              <ProductCard product={toProductCardProduct(product)} variant="carousel" />
            </AnimateIn>
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link href="/decants" className="flex items-center gap-1 text-sm text-brand-gold-dark hover:underline">
            Ver todos los decants <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-10 w-10 place-items-center border border-brand-beige-line text-brand-text-dark transition-colors hover:border-brand-gold hover:text-brand-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:opacity-35"
    >
      <ArrowIcon className={`w-4 h-4 ${direction === 'left' ? 'rotate-180' : ''}`} />
    </button>
  );
}
