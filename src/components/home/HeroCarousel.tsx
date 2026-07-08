'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowIcon } from '@/components/icons';

type Slide = {
  id: number;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  linkUrl: string | null;
};

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const goTo = (index: number) => setCurrent(index);

  return (
    <div className="relative w-full h-[75vh] min-h-[380px] max-h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
         <Image
            src={slide.imageUrl}
            alt={slide.title ?? 'P&G Decants'}
            fill
            className="object-cover object-center"
            priority={index === 0}
        />
          <div className="absolute inset-0 bg-brand-black/40" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            {slide.title && (
              <h2 className="font-display italic text-4xl sm:text-5xl md:text-6xl text-brand-cream mb-4">
                {slide.title}
              </h2>
            )}
            {slide.subtitle && (
              <p className="font-body text-brand-cream text-base sm:text-lg mb-8 max-w-md">
                {slide.subtitle}
              </p>
            )}
            {slide.linkUrl && (
              <Link
                href={slide.linkUrl}
                className="inline-flex items-center gap-2 bg-brand-gold text-brand-black px-6 py-3 text-sm font-medium tracking-wide hover:bg-brand-gold-dark transition-colors"
              >
                Ver Colección
                <ArrowIcon className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Indicadores (dots) */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`Ir al slide ${index + 1}`}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors ${
                index === current ? 'bg-brand-gold' : 'bg-brand-cream/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}