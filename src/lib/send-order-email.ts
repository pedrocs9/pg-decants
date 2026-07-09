import { Resend } from 'resend';
import OrderConfirmation from '@/emails/OrderConfirmation';
import NewOrderAdmin from '@/emails/NewOrderAdmin';

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderEmailParams = {
  to: string;
  orderId: number;
  customerName: string;
  customerPhone?: string;
  items: { productName: string; sizeMl: number; quantity: number; unitPrice: string }[];
  subtotal: string;
  shippingTotal: string;
  total: string;
  address: { street: string; city: string; region: string };
  paymentMethod?: string;
};

export async function sendOrderConfirmationEmail(params: OrderEmailParams) {
  try {
    // Email al cliente
    await resend.emails.send({
      from: 'P&G Decants <no-reply@pgdecants.cl>',
      to: params.to,
      subject: `✅ Pedido #${params.orderId} confirmado — P&G Decants`,
      react: OrderConfirmation({
        orderId: params.orderId,
        customerName: params.customerName,
        items: params.items,
        subtotal: params.subtotal,
        shippingTotal: params.shippingTotal,
        total: params.total,
        address: params.address,
        paymentMethod: params.paymentMethod,
      }),
    });

    // Email al vendedor
    await resend.emails.send({
      from: 'P&G Decants Sistema <onboarding@resend.dev>',
      to: 'pedro.cotaipi.s@gmail.com',
      subject: `🛍️ Nuevo pedido #${params.orderId} — $${Number(params.total).toLocaleString('es-CL')} CLP`,
      react: NewOrderAdmin({
        orderId: params.orderId,
        customerName: params.customerName,
        customerEmail: params.to,
        customerPhone: params.customerPhone,
        items: params.items,
        subtotal: params.subtotal,
        shippingTotal: params.shippingTotal,
        total: params.total,
        address: params.address,
        paymentMethod: params.paymentMethod,
      }),
    });
  } catch (error) {
    console.error('Error enviando emails de orden:', error);
  }
}