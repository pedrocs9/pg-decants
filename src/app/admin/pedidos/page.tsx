import Link from 'next/link';
import { getOrdersList } from './actions';

const statusStyles: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  pagado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default async function AdminOrdersPage() {
  const ordersList = await getOrdersList();

  return (
    <div>
      <h1 className="font-display italic text-3xl text-brand-text-dark mb-8">Pedidos</h1>

      <div className="bg-brand-white border border-brand-beige-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-beige-line text-left text-xs uppercase tracking-wide text-brand-text-muted bg-brand-cream/50">
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordersList.map((order) => (
              <tr key={order.id} className="border-b border-brand-beige-line last:border-0 hover:bg-brand-cream/30 transition-colors">
                <td className="px-4 py-3 text-brand-text-dark font-medium">#{order.id}</td>
                <td className="px-4 py-3 text-brand-text-muted">
                  {order.fullName}
                  {order.userEmail && <span className="block text-xs">{order.userEmail}</span>}
                </td>
                <td className="px-4 py-3 text-brand-text-muted">
                  {new Date(order.createdAt).toLocaleDateString('es-CL')}
                </td>
                <td className="px-4 py-3 text-brand-text-dark">${Number(order.total).toLocaleString('es-CL')}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 ${statusStyles[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/pedidos/${order.id}`} className="text-brand-gold-dark hover:underline font-medium">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ordersList.length === 0 && (
          <p className="text-center py-16 text-brand-text-muted">No hay pedidos todavía.</p>
        )}
      </div>
    </div>
  );
}