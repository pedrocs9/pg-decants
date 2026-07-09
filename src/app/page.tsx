import { db } from '@/db';
import { topBarMessages, heroSlides, products, productImages, variants, animatedBannerMessages, trustBadges } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { AnimatedBanner } from '@/components/home/AnimatedBanner';
import { TrustBadges } from '@/components/home/TrustBadges';
import { getNewArrivals } from '@/db/queries/products';
import { NewArrivalsCarousel } from '@/components/home/NewArrivalsCarousel';
import { HowItWorks } from '@/components/home/HowItWorks';
import { WhyDecant } from '@/components/home/WhyDecant';
import { Testimonials } from '@/components/home/Testimonials';
import { BestSellersCarousel } from '@/components/home/BestSellersCarousel';
import { BrandsCarousel } from '@/components/home/BrandsCarousel';
import { brands } from '@/db/schema';
import { Footer } from '@/components/layout/Footer';

export default async function Home() {
   const messages = await db
    .select({ id: topBarMessages.id, message: topBarMessages.message })
    .from(topBarMessages)
    .where(eq(topBarMessages.isActive, true))
    .orderBy(topBarMessages.displayOrder);

    const newArrivals = await getNewArrivals();

    const badges = await db
    .select()
    .from(trustBadges)
    .where(eq(trustBadges.isActive, true))
    .orderBy(trustBadges.displayOrder);

  const slides = await db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.isActive, true))
    .orderBy(heroSlides.displayOrder);

    const featuredBrands = await db
    .select({ id: brands.id, name: brands.name, slug: brands.slug, logoUrl: brands.logoUrl })
    .from(brands)
    .where(eq(brands.isFeatured, true))
    .orderBy(brands.name);

  const bannerMessages = await db
    .select({ id: animatedBannerMessages.id, message: animatedBannerMessages.message })
    .from(animatedBannerMessages)
    .where(eq(animatedBannerMessages.isActive, true))
    .orderBy(animatedBannerMessages.displayOrder);

  // Productos destacados con su imagen principal, una segunda imagen (hover) y precio mínimo
  const featuredProductsRaw = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
    })
    .from(products)
    .where(and(eq(products.isFeatured, true), eq(products.isActive, true)));

  const featuredProducts = await Promise.all(
    featuredProductsRaw.map(async (product) => {
      const images = await db
        .select({ imageUrl: productImages.imageUrl, isMain: productImages.isMain })
        .from(productImages)
        .where(eq(productImages.productId, product.id))
        .orderBy(productImages.displayOrder);

      const [priceResult] = await db
        .select({
          minPrice: sql<string>`MIN(${variants.price})`,
          maxPrice: sql<string>`MAX(${variants.price})`,
        })
        .from(variants)
        .where(eq(variants.productId, product.id));

      const mainImage = images.find((img) => img.isMain)?.imageUrl ?? images[0]?.imageUrl ?? '';
      const hoverImage = images.find((img) => !img.isMain)?.imageUrl ?? null;

      return {
        ...product,
        mainImage,
        hoverImage,
        minPrice: priceResult?.minPrice ?? '0',
        maxPrice: priceResult?.maxPrice ?? '0',
      };
    })
  );

  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <TopBar messages={messages} />
      <Header />
      <HeroCarousel slides={slides} />
      <AnimatedBanner messages={bannerMessages} />
      <TrustBadges badges={badges} />
      <HowItWorks />
      <BestSellersCarousel products={featuredProducts} />
      <BrandsCarousel brands={featuredBrands} />
      <NewArrivalsCarousel products={newArrivals} />
      <WhyDecant />
      <Testimonials />
      <Footer />
    </main>
  );
}