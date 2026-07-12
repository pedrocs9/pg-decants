'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [paused, setPaused] = useState(false);
  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length, paused]);

  useEffect(() => () => {
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
  }, []);

  if (slides.length === 0) return null;

  const interact = (index: number) => {
    setCurrent((index + slides.length) % slides.length);
    setPaused(true);
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
    interactionTimer.current = setTimeout(() => setPaused(false), 10000);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') interact(current - 1);
    if (event.key === 'ArrowRight') interact(current + 1);
  };

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Colecciones destacadas"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative w-full h-[clamp(520px,72vh,760px)] overflow-hidden bg-brand-black focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-gold"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          role="group"
          aria-roledescription="diapositiva"
          aria-label={`${index + 1} de ${slides.length}`}
          aria-hidden={index !== current}
          className={`absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none ${
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
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,13,10,0.82)_0%,rgba(16,13,10,0.58)_42%,rgba(16,13,10,0.08)_78%)] max-md:bg-brand-black/55" />

          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-[var(--content-max)] mx-auto px-5 sm:px-8 lg:px-10 pb-16 md:pb-8">
              <div className="max-w-[600px] text-left">
                <p className="mb-4 font-body text-[10px] sm:text-xs font-medium uppercase tracking-[0.24em] text-brand-gold">Perfumería en formato decant</p>
            {slide.title && (
              <h2 className="font-display text-[clamp(2.7rem,6vw,5.4rem)] leading-[0.94] text-brand-cream mb-5 text-balance">
                {slide.title}
              </h2>
            )}
            {slide.subtitle && (
              <p className="font-body text-brand-cream/90 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-[540px] line-clamp-4 sm:line-clamp-3">
                {slide.subtitle}
              </p>
            )}
            {slide.linkUrl && (
              <Link
                href={slide.linkUrl}
                tabIndex={index === current ? 0 : -1}
                className="inline-flex min-h-11 items-center gap-3 bg-brand-gold text-brand-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream transition-colors"
              >
                Ver Colección
                <ArrowIcon className="w-4 h-4" />
              </Link>
            )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicadores (dots) */}
      {slides.length > 1 && (
        <>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => interact(index)}
              aria-label={`Ir al slide ${index + 1}`}
              className={`h-2 cursor-pointer transition-[width,background-color] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cream ${
                index === current ? 'w-8 bg-brand-gold' : 'w-2 bg-brand-cream/55 hover:bg-brand-cream'
              }`}
            />
          ))}
          </div>
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 lg:right-10 flex gap-2">
            <button onClick={() => interact(current - 1)} aria-label="Slide anterior" className="grid h-10 w-10 place-items-center border border-brand-cream/35 text-brand-cream hover:border-brand-gold hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-brand-gold transition-colors">
              <ArrowIcon className="h-4 w-4 rotate-180" />
            </button>
            <button onClick={() => interact(current + 1)} aria-label="Slide siguiente" className="grid h-10 w-10 place-items-center border border-brand-cream/35 text-brand-cream hover:border-brand-gold hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-brand-gold transition-colors">
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
