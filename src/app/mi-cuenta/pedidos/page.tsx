import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { getUserOrders } from '@/db/queries/orders';

const statusLabels: Record<string, string> = {
  pendiente: 'Pendiente de pago',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const statusStyles: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  pagado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
};

export default async function MisPedidosPage() {
  const session = await auth();
  const orders = await getUserOrders(session!.user.id);

  if (orders.length === 0) {
    return (
      <div className="bg-brand-white border border-brand-beige-line p-8 text-center">
        <p className="text-brand-text-muted mb-4">Todavía no tienes pedidos.</p>
        <Link href="/decants" className="text-brand-gold-dark hover:underline text-sm">
          Explorar decants
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/mi-cuenta/pedidos/${order.id}`}
          className="bg-brand-white border border-brand-beige-line p-5 flex items-center gap-4 hover:border-brand-gold transition-colors"
        >
          <div className="relative w-16 h-16 bg-brand-cream flex-shrink-0 overflow-hidden">
            {order.image && <Image src={order.image} alt="" fill className="object-cover" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-brand-text-dark font-medium">Pedido #{order.id}</p>
            <p className="text-xs text-brand-text-muted">
              {new Date(order.createdAt).toLocaleDateString('es-CL')} · {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-brand-text-dark font-medium">${Number(order.total).toLocaleString('es-CL')}</p>
            <span className={`text-xs px-2 py-0.5 ${statusStyles[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}