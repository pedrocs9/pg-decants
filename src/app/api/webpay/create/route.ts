import { NextRequest, NextResponse } from 'next/server';
import { webpay } from '@/lib/transbank';
import { db } from '@/db';
import { cartItems, variants, products, orders, orderItems, addresses, carts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { REGIONS, SHIPPING_ZONES, getZoneByRegionCode } from '@/lib/chile-regions';

const CART_COOKIE = 'pg_decants_cart_id';
const FREE_THRESHOLD = 20000;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const session = await auth();
    const cookieStore = await cookies();

    let cartId: string | undefined;
    if (session?.user?.id) {
      const [cart] = await db.select().from(carts).where(eq(carts.userId, session.user.id));
      cartId = cart?.id;
    } else {
      cartId = cookieStore.get(CART_COOKIE)?.value;
    }

    if (!cartId) return NextResponse.json({ error: 'No se encontró tu carrito.' }, { status: 400 });

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

    if (items.length === 0) return NextResponse.json({ error: 'Tu carrito está vacío.' }, { status: 400 });

    for (const item of items) {
      if (item.quantity > item.stock) {
        return NextResponse.json({ error: `Sin stock para ${item.productName} ${item.sizeMl}ml.` }, { status: 400 });
      }
    }

    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const zone = getZoneByRegionCode(formData.regionCode);
    const zoneInfo = SHIPPING_ZONES[zone];
    const shippingCost = subtotal >= FREE_THRESHOLD ? 0 : zoneInfo.price;
    const total = subtotal + shippingCost;

    const street = formData.apartment ? `${formData.street}, ${formData.apartment}` : formData.street;
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

    const buyOrder = `PG-${order.id}-${Date.now()}`;
    const sessionId = `SES-${order.id}`;
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webpay/confirm`;

    const response = await webpay.create(buyOrder, sessionId, total, returnUrl);

    // Guardar el token de Webpay en la orden para confirmarlo después
    // (podrías guardarlo en una tabla aparte o en un campo de orders)
    // Por ahora lo pasamos en la URL de retorno vía el propio flujo de Webpay

    return NextResponse.json({
      url: response.url,
      token: response.token,
      orderId: order.id,
    });
  } catch (err) {
    console.error('Webpay create error:', err);
    return NextResponse.json({ error: 'Error al iniciar el pago con Webpay.' }, { status: 500 });
  }
}