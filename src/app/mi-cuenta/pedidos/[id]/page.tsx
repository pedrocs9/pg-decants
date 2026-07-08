import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getUserOrderDetail } from '@/db/queries/orders';

const statusLabels: Record<string, string> = {
  pendiente: 'Pendiente de pago',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const order = await getUserOrderDetail(session!.user.id, Number(id));

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm uppercase tracking-wide text-brand-text-muted">Pedido #{order.id}</h2>
        <span className="text-xs px-2 py-1 bg-brand-cream text-brand-text-dark">
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="bg-brand-white border border-brand-beige-line p-6 mb-6">
        <h3 className="text-xs uppercase tracking-wide text-brand-text-muted mb-3">Productos</h3>
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
          <div className="flex justify-between text-lg font-display italic text-brand-text-dark pt-2 border-t border-brand-beige-line mt-2">
            <span>Total</span>
            <span>${Number(order.total).toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>

      <div className="bg-brand-white border border-brand-beige-line p-6">
        <h3 className="text-xs uppercase tracking-wide text-brand-text-muted mb-3">Dirección de Envío</h3>
        <p className="text-sm text-brand-text-dark">{order.fullName}</p>
        <p className="text-sm text-brand-text-muted">{order.street}</p>
        <p className="text-sm text-brand-text-muted">{order.city}, {order.region}</p>
        {order.postalCode && <p className="text-sm text-brand-text-muted">{order.postalCode}</p>}
        <p className="text-sm text-brand-text-muted mt-2">{order.phone}</p>
      </div>
    </div>
  );
}