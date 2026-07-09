'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowIcon } from '@/components/icons';
import { WishlistButton } from '@/components/product/WishlistButton';
import { AnimateIn } from '@/components/ui/AnimateIn';

type Product = {
  id: number;
  name: string;
  slug: string;
  brandName: string;
  image: string;
  minPrice: number;
};

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 w-52 sm:w-64 group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Favorito */}
      <div className="absolute top-3 right-3 z-10 bg-brand-white/80 backdrop-blur-sm rounded-full p-1">
        <WishlistButton productId={product.id} />
      </div>

      <Link href={`/producto/${product.slug}`}>
        {/* Imagen */}
        <div className="relative h-64 sm:h-80 bg-brand-white overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 208px, 256px"
              className="object-cover transition-all duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-cream">
              <span className="text-brand-text-muted text-xs">Sin imagen</span>
            </div>
          )}

          {/* Badge nuevo */}
          <span className="absolute top-3 left-3 bg-brand-gold text-brand-black text-[10px] uppercase tracking-widest px-2.5 py-1 font-medium">
            Nuevo
          </span>

          {/* Overlay hover */}
          <div className={`absolute inset-0 bg-brand-black/0 transition-all duration-300 ${hovered ? 'bg-brand-black/10' : ''}`} />
        </div>

        {/* Info */}
        <div className="pt-4 pb-1">
          <p className="text-xs text-brand-text-muted uppercase tracking-widest mb-1">{product.brandName}</p>
          <p className="text-sm font-medium text-brand-text-dark group-hover:text-brand-gold-dark transition-colors truncate">
            {product.name}
          </p>
          <p className="text-sm text-brand-text-muted mt-1.5">
            desde <span className="text-brand-gold-dark font-medium">${product.minPrice.toLocaleString('es-CL')}</span>
            <span className="text-xs ml-1">CLP</span>
          </p>
        </div>

        {/* Línea animada */}
        <div className="h-px bg-brand-beige-line w-0 group-hover:w-full transition-all duration-300 mt-2" />
      </Link>
    </div>
  );
}

export function NewArrivalsCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scroll(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
  }

  return (
    <section className="py-16 bg-brand-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimateIn animation="fade-up">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display italic text-3xl sm:text-4xl text-brand-text-dark">Nuevos Ingresos</h2>
              <p className="text-brand-text-muted text-sm mt-1">Las últimas fragancias que llegaron a nuestra colección</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Botones de navegación */}
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 border border-brand-beige-line flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-colors cursor-pointer"
                aria-label="Anterior"
              >
                <ArrowIcon className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 border border-brand-beige-line flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-colors cursor-pointer"
                aria-label="Siguiente"
              >
                <ArrowIcon className="w-4 h-4" />
              </button>
              <Link
                href="/decants"
                className="hidden sm:flex text-sm text-brand-text-dark hover:text-brand-gold-dark transition-colors items-center gap-1 ml-2"
              >
                Ver todos
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimateIn>

        {/* Carrusel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {products.map((product, i) => (
            <AnimateIn key={product.id} delay={i * 80} animation="fade-up">
              <ProductCard product={product} />
            </AnimateIn>
          ))}
        </div>

        {/* Ver todos mobile */}
        <div className="flex justify-center mt-8 sm:hidden">
          <Link href="/decants" className="text-sm text-brand-gold-dark hover:underline flex items-center gap-1">
            Ver todos los decants <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}