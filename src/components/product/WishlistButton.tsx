'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HeartIcon } from '@/components/icons';
import { toggleWishlist, isProductInWishlist } from '@/app/wishlist-actions';

export function WishlistButton({
  productId,
  className,
  initialIsInWishlist = false,
}: {
  productId: number;
  className?: string;
  initialIsInWishlist?: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      isProductInWishlist(productId).then(setIsInWishlist);
    }
  }, [session, productId]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    const result = await toggleWishlist(productId);
    if (result.success) {
      setIsInWishlist(result.isInWishlist ?? false);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={isInWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={`cursor-pointer transition-transform hover:scale-110 ${className}`}
    >
       <HeartIcon
        className={`w-5 h-5 transition-colors ${
          isInWishlist ? 'text-brand-gold [&_path]:fill-current [&_path]:fill-opacity-100' : 'text-brand-text-dark'
        }`}
      />
    </button>
  );
}
