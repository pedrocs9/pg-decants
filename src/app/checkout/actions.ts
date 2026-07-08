'use server';

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { db } from '@/db';
import { cartItems, variants, products, orders, orderItems, addresses, shippingConfig, carts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { checkoutSchema } from '@/lib/validations';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

const CART_COOKIE = 'pg_decants_cart_id';

type CheckoutFormData = {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  postalCode?: string;
};

export async function createCheckoutPreference(formData: CheckoutFormData) {
  const parsed = checkoutSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const session = await auth();
  const cookieStore = await cookies();

  let cartId: string | undefined;
  if (session?.user?.id) {
    const [cart] = await db.select().from(carts).where(eq(carts.userId, session.user.id));
    cartId = cart?.id;
  } else {
    cartId = cookieStore.get(CART_COOKIE)?.value;
  }

  if (!cartId) {
    return { error: 'No se encontró tu carrito.' };
  }

  const items = await db
    .select({
      variantId: variants.id,
      sizeMl: variants.sizeMl,
      price: variants.price,
      stock: variants.stock,
      quantity: cartItems.quantity,
      productName: products.name,
    })
    .from(cartItems)
    .innerJoin(variants, eq(cartItems.variantId, variants.id))
    .innerJoin(products, eq(variants.productId, products.id))
    .where(eq(cartItems.cartId, cartId));

  if (items.length === 0) {
    return { error: 'Tu carrito está vacío.' };
  }

  for (const item of items) {
    if (item.quantity > item.stock) {
      return { error: `Sin stock suficiente para ${item.productName} ${item.sizeMl}ml.` };
    }
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const [shipping] = await db.select().from(shippingConfig).where(eq(shippingConfig.isActive, true));
  const freeThreshold = shipping?.freeShippingThreshold ? Number(shipping.freeShippingThreshold) : null;
  const shippingCost = freeThreshold && subtotal >= freeThreshold ? 0 : Number(shipping?.flatRate ?? 0);

  const total = subtotal + shippingCost;

  const [address] = await db
    .insert(addresses)
    .values({
      userId: session?.user?.id ?? null,
      fullName: formData.fullName,
      street: formData.street,
      city: formData.city,
      region: formData.region,
      postalCode: formData.postalCode,
      phone: formData.phone,
    })
    .returning();

  const [order] = await db
    .insert(orders)
    .values({
      userId: session?.user?.id ?? null,
      addressId: address.id,
      status: 'pendiente',
      subtotal: subtotal.toString(),
      shippingTotal: shippingCost.toString(),
      discountTotal: '0',
      total: total.toString(),
    })
    .returning();

  await db.insert(orderItems).values(
    items.map((item) => ({
      orderId: order.id,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.price,
    }))
  );

  const preference = new Preference(client);

  const mpItems = items.map((item) => ({
    id: String(item.variantId),
    title: `${item.productName} ${item.sizeMl}ml`,
    quantity: item.quantity,
    unit_price: Number(item.price),
    currency_id: 'CLP',
  }));

  if (shippingCost > 0) {
    mpItems.push({
      id: 'shipping',
      title: 'Envío',
      quantity: 1,
      unit_price: shippingCost,
      currency_id: 'CLP',
    });
  }

  const result = await preference.create({
    body: {
      items: mpItems,
      payer: {
        name: formData.fullName,
        email: formData.email,
      },
      external_reference: String(order.id),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/exito?order=${order.id}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/error?order=${order.id}`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pendiente?order=${order.id}`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    },
  });

  return { success: true, checkoutUrl: result.init_point, orderId: order.id };
}

export async function getShippingInfo(subtotal: number) {
  const [shipping] = await db.select().from(shippingConfig).where(eq(shippingConfig.isActive, true));
  if (!shipping) return { cost: 0, freeThreshold: null };

  const freeThreshold = shipping.freeShippingThreshold ? Number(shipping.freeShippingThreshold) : null;
  const cost = freeThreshold && subtotal >= freeThreshold ? 0 : Number(shipping.flatRate);

  return { cost, freeThreshold };
}