import { notFound } from 'next/navigation';
import { getOrderDetail } from '../actions';
import { StatusSelector } from './StatusSelector';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderDetail(Number(id));

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display italic text-3xl text-brand-text-dark">Pedido #{order.id}</h1>
        <StatusSelector orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-brand-white border border-brand-beige-line p-6">
          <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-4">Cliente</h2>
          <p className="text-brand-text-dark">{order.fullName}</p>
          {order.userEmail && <p className="text-sm text-brand-text-muted">{order.userEmail}</p>}
          <p className="text-sm text-brand-text-muted mt-1">{order.phone}</p>
        </div>

        <div className="bg-brand-white border border-brand-beige-line p-6">
          <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-4">Envío</h2>
          <p className="text-sm text-brand-text-dark">{order.street}</p>
          <p className="text-sm text-brand-text-muted">
            {order.city}, {order.region}
          </p>
          {order.postalCode && <p className="text-sm text-brand-text-muted">{order.postalCode}</p>}
        </div>
      </div>

      <div className="bg-brand-white border border-brand-beige-line p-6 mb-6">
        <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-4">Productos</h2>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-brand-text-dark">
                {item.productName} {item.sizeMl}ml x {item.quantity}
              </span>
              <span className="text-brand-text-muted">
                ${(Number(item.unitPrice) * item.quantity).toLocaleString('es-CL')}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-beige-line mt-4 pt-4 flex flex-col gap-1.5">
          <div className="flex justify-between text-sm text-brand-text-muted">
            <span>Subtotal</span>
            <span>${Number(order.subtotal).toLocaleString('es-CL')}</span>
          </div>
          <div className="flex justify-between text-sm text-brand-text-muted">
            <span>Envío</span>
            <span>${Number(order.shippingTotal).toLocaleString('es-CL')}</span>
          </div>
          {Number(order.discountTotal) > 0 && (
            <div className="flex justify-between text-sm text-brand-text-muted">
              <span>Descuento</span>
              <span>-${Number(order.discountTotal).toLocaleString('es-CL')}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-display italic text-brand-text-dark pt-2 border-t border-brand-beige-line mt-2">
            <span>Total</span>
            <span>${Number(order.total).toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>

      {order.stripePaymentIntentId && (
        <p className="text-xs text-brand-text-muted">ID de pago: {order.stripePaymentIntentId}</p>
      )}
      <p className="text-xs text-brand-text-muted">
        Fecha: {new Date(order.createdAt).toLocaleString('es-CL')}
      </p>
    </div>
  );
}