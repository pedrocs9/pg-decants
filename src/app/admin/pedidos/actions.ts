'use server';

import { db } from '@/db';
import { orders, orderItems, variants, products, addresses, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getOrdersList() {
  const list = await db
    .select({
      id: orders.id,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
      fullName: addresses.fullName,
      userEmail: users.email,
    })
    .from(orders)
    .innerJoin(addresses, eq(orders.addressId, addresses.id))
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(orders.createdAt);

  return list.reverse();
}

export async function getOrderDetail(id: number) {
  const [order] = await db
    .select({
      id: orders.id,
      status: orders.status,
      subtotal: orders.subtotal,
      shippingTotal: orders.shippingTotal,
      discountTotal: orders.discountTotal,
      total: orders.total,
      createdAt: orders.createdAt,
      stripePaymentIntentId: orders.stripePaymentIntentId,
      fullName: addresses.fullName,
      street: addresses.street,
      city: addresses.city,
      region: addresses.region,
      postalCode: addresses.postalCode,
      phone: addresses.phone,
      userEmail: users.email,
    })
    .from(orders)
    .innerJoin(addresses, eq(orders.addressId, addresses.id))
    .leftJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, id));

  if (!order) return null;

  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      sizeMl: variants.sizeMl,
      productName: products.name,
    })
    .from(orderItems)
    .innerJoin(variants, eq(orderItems.variantId, variants.id))
    .innerJoin(products, eq(variants.productId, products.id))
    .where(eq(orderItems.orderId, id));

  return { ...order, items };
}

export async function updateOrderStatus(id: number, status: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado') {
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  revalidatePath('/admin/pedidos');
  revalidatePath(`/admin/pedidos/${id}`);
}