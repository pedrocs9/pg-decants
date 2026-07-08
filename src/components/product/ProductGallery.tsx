'use client';

import { useState } from 'react';
import Image from 'next/image';

type Img = { id: number; imageUrl: string; isMain: boolean };

export function ProductGallery({ images, productName }: { images: Img[]; productName: string }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-square bg-brand-white flex items-center justify-center text-brand-text-muted">Sin imagen</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square bg-brand-white overflow-hidden">
        <Image
          src={images[selected].imageUrl}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setSelected(index)}
              className={`relative w-20 h-20 flex-shrink-0 overflow-hidden cursor-pointer border transition-colors ${
                index === selected ? 'border-brand-gold' : 'border-brand-beige-line'
              }`}
            >
              <Image src={img.imageUrl} alt={`${productName} ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}