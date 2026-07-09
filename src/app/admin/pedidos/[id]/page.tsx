import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOrderDetail } from '../actions';
import { StatusSelector } from './StatusSelector';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
  pagado:    { label: 'Pagado',    color: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-400' },
  enviado:   { label: 'Enviado',   color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-400' },
  entregado: { label: 'Entregado', color: 'bg-green-50 text-green-700 border-green-200',    dot: 'bg-green-400' },
  cancelado: { label: 'Cancelado', color: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-400' },
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderDetail(Number(id));
  if (!order) notFound();

  const cfg = statusConfig[order.status] ?? statusConfig.pendiente;
  const orderTotal = Number(order.total);
  const createdAt = new Date(order.createdAt);

  return (
    <div className="max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin/pedidos" className="text-brand-text-muted hover:text-brand-gold-dark text-sm transition-colors">
              ← Pedidos
            </Link>
          </div>
          <h1 className="font-display italic text-3xl text-brand-text-dark">Pedido #{order.id}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            <span className="text-xs text-brand-text-muted">
              {createdAt.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
              {' · '}
              {createdAt.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <StatusSelector orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Columna izquierda */}
        <div className="col-span-2 flex flex-col gap-6">

          {/* Productos */}
          <div className="bg-brand-white border border-brand-beige-line overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-beige-line bg-brand-cream/30">
              <h2 className="text-xs uppercase tracking-widest text-brand-text-muted font-medium">
                📦 Productos ({order.items.length})
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-brand-beige-line last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-text-dark">{item.productName}</p>
                    <p className="text-xs text-brand-text-muted mt-0.5">{item.sizeMl}ml × {item.quantity} unidades</p>
                    <p className="text-xs text-brand-text-muted">Precio unit: ${Number(item.unitPrice).toLocaleString('es-CL')}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-brand-text-dark">
                      ${(Number(item.unitPrice) * item.quantity).toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="px-6 pb-6 pt-2 border-t border-brand-beige-line bg-brand-cream/20">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm text-brand-text-muted">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-sm text-brand-text-muted">
                  <span>Envío</span>
                  <span>
                    {Number(order.shippingTotal) === 0
                      ? <span className="text-green-600">Gratis</span>
                      : `$${Number(order.shippingTotal).toLocaleString('es-CL')}`}
                  </span>
                </div>
                {Number(order.discountTotal) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento</span>
                    <span>-${Number(order.discountTotal).toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-display italic text-brand-text-dark pt-2 border-t border-brand-beige-line">
                  <span>Total</span>
                  <span className="text-lg">${orderTotal.toLocaleString('es-CL')} CLP</span>
                </div>
              </div>
            </div>
          </div>

          {/* ID de pago */}
          {order.stripePaymentIntentId && (
            <div className="bg-brand-white border border-brand-beige-line px-6 py-4">
              <h2 className="text-xs uppercase tracking-widest text-brand-text-muted mb-2">💳 ID de Pago</h2>
              <p className="text-xs font-mono text-brand-text-dark bg-brand-cream px-3 py-2 border border-brand-beige-line">
                {order.stripePaymentIntentId}
              </p>
            </div>
          )}
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-6">

          {/* Cliente */}
          <div className="bg-brand-white border border-brand-beige-line overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-beige-line bg-brand-cream/30">
              <h2 className="text-xs uppercase tracking-widest text-brand-text-muted font-medium">👤 Cliente</h2>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div>
                <p className="text-xs text-brand-text-muted uppercase tracking-wide mb-1">Nombre</p>
                <p className="text-sm text-brand-text-dark font-medium">{order.fullName}</p>
              </div>
              {order.userEmail && (
                <div>
                  <p className="text-xs text-brand-text-muted uppercase tracking-wide mb-1">Email</p>
                  <a href={`mailto:${order.userEmail}`} className="text-sm text-brand-gold-dark hover:underline">
                    {order.userEmail}
                  </a>
                </div>
              )}
              {order.phone && (
                <div>
                  <p className="text-xs text-brand-text-muted uppercase tracking-wide mb-1">Teléfono</p>
                  <a href={`tel:${order.phone}`} className="text-sm text-brand-gold-dark hover:underline">
                    {order.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-brand-white border border-brand-beige-line overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-beige-line bg-brand-cream/30">
              <h2 className="text-xs uppercase tracking-widest text-brand-text-muted font-medium">📍 Envío</h2>
            </div>
            <div className="p-5 flex flex-col gap-2">
              <p className="text-sm text-brand-text-dark">{order.street}</p>
              <p className="text-sm text-brand-text-muted">{order.city}</p>
              <p className="text-sm text-brand-text-muted">{order.region}</p>
              {order.postalCode && (
                <p className="text-xs text-brand-text-muted">CP: {order.postalCode}</p>
              )}
              
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(`${order.street}, ${order.city}, ${order.region}`)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-gold-dark hover:underline mt-2">Ver en Google Maps →</a>
            </div>
          </div>

          {/* Resumen rápido */}
          <div className="bg-brand-black text-brand-cream p-5">
            <p className="text-xs uppercase tracking-widest text-brand-cream/60 mb-3">Resumen</p>
            <p className="text-2xl font-display italic text-brand-gold">${orderTotal.toLocaleString('es-CL')}</p>
             <p className="text-xs text-brand-cream/60 mt-1">
              {`CLP · ${order.items.length} producto${order.items.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}