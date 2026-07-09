import { NextRequest, NextResponse } from 'next/server';
import { webpay } from '@/lib/transbank';
import { db } from '@/db';
import { sendOrderConfirmationEmail } from '@/lib/send-order-email';
import { orders, orderItems, addresses, variants, products, users as usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function sendWebpayEmail(orderId: number) {
  try {
    const [orderData] = await db
      .select({
        id: orders.id,
        subtotal: orders.subtotal,
        shippingTotal: orders.shippingTotal,
        total: orders.total,
        fullName: addresses.fullName,
        street: addresses.street,
        city: addresses.city,
        region: addresses.region,
        phone: addresses.phone,
        userId: orders.userId,
      })
      .from(orders)
      .innerJoin(addresses, eq(orders.addressId, addresses.id))
      .where(eq(orders.id, orderId));

    if (!orderData) return;

    let customerEmail: string | null = null;
    if (orderData.userId) {
      const [user] = await db
        .select({ email: usersTable.email })
        .from(usersTable)
        .where(eq(usersTable.id, orderData.userId));
      customerEmail = user?.email ?? null;
    }

    if (!customerEmail) return;

    const emailItems = await db
      .select({
        productName: products.name,
        sizeMl: variants.sizeMl,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
      })
      .from(orderItems)
      .innerJoin(variants, eq(orderItems.variantId, variants.id))
      .innerJoin(products, eq(variants.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    await sendOrderConfirmationEmail({
      to: customerEmail,
      orderId: orderData.id,
      customerName: orderData.fullName,
      customerPhone: orderData.phone ?? undefined,
      items: emailItems,
      subtotal: orderData.subtotal,
      shippingTotal: orderData.shippingTotal,
      total: orderData.total,
      address: {
        street: orderData.street,
        city: orderData.city,
        region: orderData.region,
      },
      paymentMethod: 'Webpay (Transbank)',
    });
  } catch (err) {
    console.error('Error enviando email Webpay:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const token = params.get('token_ws');

    console.log('Webpay confirm token:', token);

    if (!token) {
      console.log('No token recibido, usuario canceló');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/checkout/error?reason=cancelled`,
        { status: 302 }
      );
    }

    const result = await webpay.commit(token);
    console.log('Webpay commit result:', JSON.stringify(result));

    const orderId = parseInt(result.buy_order.split('-')[1]);

    if (result.response_code === 0) {
      await db.update(orders).set({ status: 'pagado' }).where(eq(orders.id, orderId));
      await sendWebpayEmail(orderId);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/checkout/exito?order=${orderId}&method=webpay`,
        { status: 302 }
      );
    } else {
      console.log('Pago rechazado, response_code:', result.response_code);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/checkout/error?order=${orderId}&reason=rejected`,
        { status: 302 }
      );
    }
  } catch (err) {
    console.error('Webpay confirm error:', err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/checkout/error?reason=error`,
      { status: 302 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token_ws');
  const tbkOrdenCompra = searchParams.get('TBK_ORDEN_COMPRA');

  console.log('Webpay GET params:', { token, tbkOrdenCompra });

  if (token) {
    try {
      const result = await webpay.commit(token);
      console.log('Webpay commit result:', JSON.stringify(result));

      const orderId = parseInt(result.buy_order.split('-')[1]);

      if (result.response_code === 0) {
        await db.update(orders).set({ status: 'pagado' }).where(eq(orders.id, orderId));
        await sendWebpayEmail(orderId);
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/checkout/exito?order=${orderId}&method=webpay`,
          { status: 302 }
        );
      } else {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/checkout/error?order=${orderId}&reason=rejected`,
          { status: 302 }
        );
      }
    } catch (err) {
      console.error('Webpay GET commit error:', err);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/checkout/error?reason=error`,
        { status: 302 }
      );
    }
  }

  const orderId = tbkOrdenCompra?.split('-')[1];
  console.log('Webpay cancelación, orderId:', orderId);
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/checkout/error?order=${orderId ?? ''}&reason=cancelled`,
    { status: 302 }
  );
}