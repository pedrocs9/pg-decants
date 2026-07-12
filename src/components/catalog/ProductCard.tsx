import { ProductCard as SharedProductCard, type ProductCardProduct } from '@/components/product/ProductCard';

type Product = {
  id: number;
  name: string;
  slug: string;
  brandName: string;
  image: string;
  minPrice: number;
};

export function ProductCard({ product }: { product: Product }) {
  const normalizedProduct: ProductCardProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brandName: product.brandName,
    imageUrl: product.image,
    imageAlt: product.name,
    minPrice: product.minPrice,
  };

  return <SharedProductCard product={normalizedProduct} variant="catalog" />;
}
