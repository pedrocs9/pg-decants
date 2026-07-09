'use server';

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { db } from '@/db';
import { cartItems, variants, products, orders, orderItems, addresses, carts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { REGIONS, SHIPPING_ZONES, getZoneByRegionCode } from '@/lib/chile-regions';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

const CART_COOKIE = 'pg_decants_cart_id';
const FREE_THRESHOLD = 20000;

type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rut?: string;
  street: string;
  apartment?: string;
  regionCode: string;
  comuna: string;
  postalCode?: string;
};

export async function createCheckoutPreference(formData: CheckoutFormData) {
  const session = await auth();
  const cookieStore = await cookies();

  let cartId: string | undefined;
  if (session?.user?.id) {
    const [cart] = await db.select().from(carts).where(eq(carts.userId, session.user.id));
    cartId = cart?.id;
  } else {
    cartId = cookieStore.get(CART_COOKIE)?.value;
  }

  if (!cartId) return { error: 'No se encontró tu carrito.' };

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

  if (items.length === 0) return { error: 'Tu carrito está vacío.' };

  for (const item of items) {
    if (item.quantity > item.stock) {
      return { error: `Sin stock suficiente para ${item.productName} ${item.sizeMl}ml.` };
    }
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  // Tarifa por zona geográfica
  const zone = getZoneByRegionCode(formData.regionCode);
  const zoneInfo = SHIPPING_ZONES[zone];
  const shippingCost = subtotal >= FREE_THRESHOLD ? 0 : zoneInfo.price;
  const total = subtotal + shippingCost;

  const street = formData.apartment
    ? `${formData.street}, ${formData.apartment}`
    : formData.street;

  const regionName = REGIONS.find((r) => r.code === formData.regionCode)?.name ?? formData.regionCode;

  const [address] = await db
    .insert(addresses)
    .values({
      userId: session?.user?.id ?? null,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      street,
      city: formData.comuna,
      region: regionName,
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
      title: `Envío — ${zoneInfo.label}`,
      quantity: 1,
      unit_price: shippingCost,
      currency_id: 'CLP',
    });
  }

  const result = await preference.create({
    body: {
      items: mpItems,
      payer: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
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
  return {
    cost: subtotal >= FREE_THRESHOLD ? 0 : null,
    freeThreshold: FREE_THRESHOLD,
  };
}