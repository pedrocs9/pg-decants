import { db } from '@/db';
import { orders, orderItems, variants, products, productImages, addresses } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function getUserOrders(userId: string) {
  const userOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  const enriched = await Promise.all(
    userOrders.map(async (order) => {
      const items = await db
        .select({
          quantity: orderItems.quantity,
          sizeMl: variants.sizeMl,
          productName: products.name,
          productSlug: products.slug,
        })
        .from(orderItems)
        .innerJoin(variants, eq(orderItems.variantId, variants.id))
        .innerJoin(products, eq(variants.productId, products.id))
        .where(eq(orderItems.orderId, order.id));

      const [firstImage] = items.length
        ? await db
            .select({ imageUrl: productImages.imageUrl })
            .from(productImages)
            .innerJoin(products, eq(productImages.productId, products.id))
            .where(and(eq(products.slug, items[0].productSlug), eq(productImages.isMain, true)))
            .limit(1)
        : [];

      return { ...order, items, image: firstImage?.imageUrl ?? '' };
    })
  );

  return enriched;
}

export async function getUserOrderDetail(userId: string, orderId: number) {
  const [order] = await db
    .select({
      id: orders.id,
      status: orders.status,
      subtotal: orders.subtotal,
      shippingTotal: orders.shippingTotal,
      discountTotal: orders.discountTotal,
      total: orders.total,
      createdAt: orders.createdAt,
      fullName: addresses.fullName,
      street: addresses.street,
      city: addresses.city,
      region: addresses.region,
      postalCode: addresses.postalCode,
      phone: addresses.phone,
    })
    .from(orders)
    .innerJoin(addresses, eq(orders.addressId, addresses.id))
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));

  if (!order) return null;

  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      sizeMl: variants.sizeMl,
      productName: products.name,
      productSlug: products.slug,
    })
    .from(orderItems)
    .innerJoin(variants, eq(orderItems.variantId, variants.id))
    .innerJoin(products, eq(variants.productId, products.id))
    .where(eq(orderItems.orderId, orderId));

  return { ...order, items };
}