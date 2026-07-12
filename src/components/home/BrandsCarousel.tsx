'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/AnimateIn';

type Brand = { id: number; name: string; slug: string; logoUrl: string | null };

export function BrandsCarousel({ brands }: { brands: Brand[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (brands.length === 0) return null;

  const doubled = [...brands, ...brands];

  return (
    <section className="overflow-hidden border-y border-brand-beige-line bg-brand-white/70 py-14 sm:py-16 lg:py-[4.5rem]">
      <AnimateIn animation="fade-up">
        <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-gold-dark">Casas seleccionadas</p>
          <h2 className="font-display italic text-3xl text-brand-text-dark sm:text-4xl">
            Marcas que trabajamos
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-text-muted">
            Decants 100% originales de las mejores casas de perfumeria
          </p>
        </div>
      </AnimateIn>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 animate-brands-scroll motion-reduce:animate-none sm:gap-5"
          style={{ width: 'max-content' }}
        >
          {doubled.map((brand, i) => (
            <Link
              key={`${brand.id}-${i}`}
              href={`/decants?marca=${brand.slug}`}
              className="group flex h-[5.5rem] w-[8.5rem] flex-shrink-0 items-center justify-center border border-brand-beige-line bg-brand-cream px-4 transition-colors duration-300 hover:border-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:h-24 sm:w-40"
            >
              {brand.logoUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    fill
                    className="object-contain p-4 grayscale opacity-75 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 motion-reduce:transition-none"
                    unoptimized
                  />
                </div>
              ) : (
                <span className="text-center text-sm font-medium text-brand-text-muted transition-colors group-hover:text-brand-gold-dark">
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
