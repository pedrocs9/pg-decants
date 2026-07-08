import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { db } from '@/db';
import { orders, orderItems, variants, carts, cartItems,products, addresses, users as usersTable } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { sendOrderConfirmationEmail } from '@/lib/send-order-email';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === 'payment') {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: body.data.id });

      const orderId = Number(paymentData.external_reference);
      if (!orderId) return NextResponse.json({ received: true });

      if (paymentData.status === 'approved') {
        await db
          .update(orders)
          .set({ status: 'pagado', stripePaymentIntentId: String(paymentData.id) })
          .where(eq(orders.id, orderId));

        // Descontar stock de cada variante comprada
       const items = await db
          .select({ variantId: orderItems.variantId, quantity: orderItems.quantity })
          .from(orderItems)
          .where(eq(orderItems.orderId, orderId));

        for (const item of items) {
          await db
            .update(variants)
            .set({ stock: sql`${variants.stock} - ${item.quantity}` })
            .where(eq(variants.id, item.variantId));
        }

        // Enviar email de confirmación
        const [orderWithAddress] = await db
          .select({
            id: orders.id,
            subtotal: orders.subtotal,
            shippingTotal: orders.shippingTotal,
            total: orders.total,
            fullName: addresses.fullName,
            street: addresses.street,
            city: addresses.city,
            region: addresses.region,
            userId: orders.userId,
          })
          .from(orders)
          .innerJoin(addresses, eq(orders.addressId, addresses.id))
          .where(eq(orders.id, orderId));

        let customerEmail: string | null = null;
        if (orderWithAddress.userId) {
          const [user] = await db.select({ email: usersTable.email }).from(usersTable).where(eq(usersTable.id, orderWithAddress.userId));
          customerEmail = user?.email ?? null;
        } else if (paymentData.payer?.email) {
          customerEmail = paymentData.payer.email;
        }

        if (customerEmail) {
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
            orderId: orderWithAddress.id,
            customerName: orderWithAddress.fullName,
            items: emailItems,
            subtotal: orderWithAddress.subtotal,
            shippingTotal: orderWithAddress.shippingTotal,
            total: orderWithAddress.total,
            address: {
              street: orderWithAddress.street,
              city: orderWithAddress.city,
              region: orderWithAddress.region,
            },
          });
        }

        // Limpiar el carrito del usuario (si estaba logueado)
        const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
        if (order.userId) {
          const [cart] = await db.select().from(carts).where(eq(carts.userId, order.userId));
          if (cart) {
            await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
          }
        }
      } else if (paymentData.status === 'rejected') {
        await db.update(orders).set({ status: 'cancelado' }).where(eq(orders.id, orderId));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error en webhook de Mercado Pago:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}