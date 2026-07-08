'use server';

import { db } from '@/db';
import { reviews, orders, orderItems, variants, products, users } from '@/db/schema';
import { eq, and, avg, count } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export async function getProductReviews(productId: number) {
  const rows = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      userName: users.name,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.productId, productId))
    .orderBy(reviews.createdAt);

  const [stats] = await db
    .select({ avgRating: avg(reviews.rating), totalReviews: count(reviews.id) })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  return {
    reviews: rows.reverse(),
    avgRating: stats?.avgRating ? Number(stats.avgRating) : 0,
    totalReviews: stats?.totalReviews ?? 0,
  };
}

export async function canUserReview(productId: number) {
  const session = await auth();
  if (!session?.user?.id) return { canReview: false, reason: 'not_logged_in' };

  // ¿Ya dejó una reseña de este producto?
  const [existingReview] = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.userId, session.user.id)));

  if (existingReview) return { canReview: false, reason: 'already_reviewed' };

  // ¿Compró este producto? (busca en sus pedidos pagados/enviados/entregados)
  const purchasedOrders = await db
    .select({ orderId: orders.id })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(variants, eq(orderItems.variantId, variants.id))
    .where(
      and(
        eq(orders.userId, session.user.id),
        eq(variants.productId, productId)
      )
    );

  const validOrder = purchasedOrders[0];
  if (!validOrder) return { canReview: false, reason: 'not_purchased' };

  return { canReview: true, orderId: validOrder.orderId };
}

export async function submitReview(productId: number, orderId: number, data: { rating: number; comment: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Debes iniciar sesión.' };

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const check = await canUserReview(productId);
  if (!check.canReview) return { error: 'No puedes reseñar este producto.' };

  await db.insert(reviews).values({
    productId,
    userId: session.user.id,
    orderId,
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
  });

  revalidatePath(`/producto`);
  return { success: true };
}