'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/AnimateIn';
type Brand = { id: number; name: string; slug: string; logoUrl: string | null };

export function BrandsCarousel({ brands }: { brands: Brand[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (brands.length === 0) return null;

  // Duplicamos para efecto infinito visual
  const doubled = [...brands, ...brands];

  return (
    <section className="py-16 bg-brand-white border-y border-brand-beige-line overflow-hidden">
        <AnimateIn animation="fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <h2 className="font-display italic text-3xl text-brand-text-dark text-center">
              Marcas que trabajamos
            </h2>
            <p className="text-brand-text-muted text-center text-sm mt-2">
              Decants 100% originales de las mejores casas de perfumería
            </p>
          </div>
        </AnimateIn>

      {/* Carrusel con scroll automático CSS */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-8 animate-brands-scroll"
          style={{ width: 'max-content' }}
        >
          {doubled.map((brand, i) => (
            <Link
              key={`${brand.id}-${i}`}
              href={`/decants?marca=${brand.slug}`}
              className="group flex-shrink-0 w-36 h-24 border border-brand-beige-line bg-brand-cream flex items-center justify-center px-4 hover:border-brand-gold hover:shadow-md transition-all duration-300"
            >
              {brand.logoUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    fill
                    className="object-contain p-3 filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    unoptimized
                  />
                </div>
              ) : (
                <span className="text-sm font-medium text-brand-text-muted group-hover:text-brand-gold transition-colors text-center">
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}