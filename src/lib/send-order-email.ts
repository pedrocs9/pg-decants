import { Resend } from 'resend';
import OrderConfirmation from '@/emails/OrderConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderId: number;
  customerName: string;
  items: { productName: string; sizeMl: number; quantity: number; unitPrice: string }[];
  subtotal: string;
  shippingTotal: string;
  total: string;
  address: { street: string; city: string; region: string };
}) {
  try {
    await resend.emails.send({
      from: 'P&G Decants <onboarding@resend.dev>',
      to: params.to,
      subject: `Confirmación de tu pedido #${params.orderId} - P&G Decants`,
      react: OrderConfirmation({
        orderId: params.orderId,
        customerName: params.customerName,
        items: params.items,
        subtotal: params.subtotal,
        shippingTotal: params.shippingTotal,
        total: params.total,
        address: params.address,
      }),
    });
  } catch (error) {
    console.error('Error enviando email de confirmación:', error);
    // No relanzamos el error: si el email falla, no debe romper el flujo del webhook
  }
}