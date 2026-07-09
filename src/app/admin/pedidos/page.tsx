import Link from 'next/link';
import { getOrdersList } from './actions';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
  pagado:    { label: 'Pagado',    color: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-400' },
  enviado:   { label: 'Enviado',   color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-400' },
  entregado: { label: 'Entregado', color: 'bg-green-50 text-green-700 border-green-200',    dot: 'bg-green-400' },
  cancelado: { label: 'Cancelado', color: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-400' },
};

export default async function AdminOrdersPage() {
  const ordersList = await getOrdersList();

  const stats = {
    total: ordersList.length,
    pagados: ordersList.filter(o => o.status === 'pagado').length,
    pendientes: ordersList.filter(o => o.status === 'pendiente').length,
    enviados: ordersList.filter(o => o.status === 'enviado').length,
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display italic text-3xl text-brand-text-dark">Pedidos</h1>
          <p className="text-brand-text-muted text-sm mt-1">{stats.total} pedidos en total</p>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total pedidos', value: stats.total, color: 'border-brand-gold' },
          { label: 'Pagados', value: stats.pagados, color: 'border-blue-400' },
          { label: 'Pendientes', value: stats.pendientes, color: 'border-yellow-400' },
          { label: 'Enviados', value: stats.enviados, color: 'border-purple-400' },
        ].map((s) => (
          <div key={s.label} className={`bg-brand-white border-l-4 ${s.color} border border-brand-beige-line p-4`}>
            <p className="text-2xl font-display italic text-brand-text-dark">{s.value}</p>
            <p className="text-xs text-brand-text-muted uppercase tracking-wide mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-brand-white border border-brand-beige-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-beige-line text-left text-xs uppercase tracking-widest text-brand-text-muted bg-brand-cream/50">
              <th className="px-5 py-3.5 font-medium">#</th>
              <th className="px-5 py-3.5 font-medium">Cliente</th>
              <th className="px-5 py-3.5 font-medium">Fecha</th>
              <th className="px-5 py-3.5 font-medium">Total</th>
              <th className="px-5 py-3.5 font-medium">Estado</th>
              <th className="px-5 py-3.5 font-medium text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {ordersList.map((order) => {
              const cfg = statusConfig[order.status] ?? statusConfig.pendiente;
              return (
                <tr key={order.id} className="border-b border-brand-beige-line last:border-0 hover:bg-brand-cream/30 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="font-medium text-brand-text-dark">#{order.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-brand-text-dark font-medium">{order.fullName}</p>
                    {order.userEmail && (
                      <p className="text-xs text-brand-text-muted mt-0.5">{order.userEmail}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-brand-text-muted">
                    <p>{new Date(order.createdAt).toLocaleDateString('es-CL')}</p>
                    <p className="text-xs">{new Date(order.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-brand-text-dark">
                      ${Number(order.total).toLocaleString('es-CL')}
                    </span>
                    <span className="text-xs text-brand-text-muted ml-1">CLP</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="text-xs font-medium text-brand-gold-dark hover:text-brand-gold border border-brand-beige-line hover:border-brand-gold px-3 py-1.5 transition-colors"
                    >
                      Ver detalle →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {ordersList.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-brand-text-muted">No hay pedidos todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
}