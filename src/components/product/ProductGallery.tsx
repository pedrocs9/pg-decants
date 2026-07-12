'use client';

import { useState } from 'react';
import Image from 'next/image';

type Img = { id: number; imageUrl: string; isMain: boolean };

export function ProductGallery({ images, productName }: { images: Img[]; productName: string }) {
  const initialIndex = Math.max(
    0,
    images.findIndex((image) => image.isMain)
  );
  const [selected, setSelected] = useState(initialIndex);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-brand-white flex items-center justify-center border border-brand-beige-line text-sm text-brand-text-muted">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-4 lg:grid lg:max-w-none lg:grid-cols-[88px_minmax(0,1fr)] lg:items-start">
      {images.length > 1 && (
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:max-h-[680px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
          {images.map((img, index) => {
            const isSelected = index === selected;

            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Ver imagen ${index + 1} de ${productName}`}
                aria-pressed={isSelected}
                className={`relative h-20 w-16 flex-shrink-0 overflow-hidden border bg-brand-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:h-24 sm:w-20 lg:h-[104px] lg:w-[82px] ${
                  isSelected ? 'border-brand-gold' : 'border-brand-beige-line hover:border-brand-gold-dark'
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={`${productName} - imagen ${index + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      <div className="relative order-1 aspect-[4/5] overflow-hidden border border-brand-beige-line bg-brand-white lg:order-2">
        <Image
          src={images[selected].imageUrl}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 56vw"
          className="object-cover transition-opacity duration-500 motion-reduce:transition-none"
          priority
        />
      </div>
    </div>
  );
}
