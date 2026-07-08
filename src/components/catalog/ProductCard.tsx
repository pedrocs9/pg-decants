import Link from 'next/link';
import Image from 'next/image';

import { WishlistButton } from '@/components/product/WishlistButton';

type Product = {
  id: number;
  name: string;
  slug: string;
  brandName: string;
  image: string;
  minPrice: number;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <div className="relative h-72 bg-brand-white overflow-hidden">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute top-2 right-2 bg-brand-cream/90 rounded-full p-2">
          <WishlistButton productId={product.id} />
        </div>
      </div>
      <div className="pt-3">
        <p className="text-xs text-brand-text-muted uppercase tracking-wide">{product.brandName}</p>
        <p className="text-sm text-brand-text-dark mt-0.5">{product.name}</p>
        <p className="text-sm text-brand-gold-dark font-medium mt-1">
          desde ${product.minPrice.toLocaleString('es-CL')} CLP
        </p>
      </div>
    </Link>
  );
}