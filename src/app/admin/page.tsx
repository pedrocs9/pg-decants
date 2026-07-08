import Link from 'next/link';
import { getDashboardData } from './dashboard-actions';

const statusLabels: Record<string, string> = {
  pendiente: 'Pendiente',
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

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const maxDaySale = Math.max(...Object.values(data.salesByDay), 1);

  return (
    <div>
      <h1 className="font-display italic text-3xl text-brand-text-dark mb-2">Dashboard</h1>
      <p className="text-sm text-brand-text-muted mb-8">Resumen general de P&G Decants</p>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Ventas este mes"
          value={`$${data.monthSales.toLocaleString('es-CL')}`}
          accent="border-l-green-500"
          badge="bg-green-50 text-green-700"
        />
        <KpiCard
          label="Ventas totales"
          value={`$${data.totalSales.toLocaleString('es-CL')}`}
          accent="border-l-brand-gold"
          badge="bg-brand-gold/10 text-brand-gold-dark"
        />
        <KpiCard
          label="Ticket promedio"
          value={`$${Math.round(data.averageTicket).toLocaleString('es-CL')}`}
          accent="border-l-blue-500"
          badge="bg-blue-50 text-blue-700"
        />
        <KpiCard
          label="Pedidos totales"
          value={String(data.totalOrdersCount)}
          accent="border-l-purple-500"
          badge="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Alertas */}
      {(data.pendingShipmentCount > 0 || data.stalePendingCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {data.pendingShipmentCount > 0 && (
            <Link
              href="/admin/pedidos"
              className="bg-blue-50 border border-blue-200 p-4 flex items-center gap-3 hover:bg-blue-100 transition-colors"
            >
              <span className="text-xl">📦</span>
              <span className="text-sm text-blue-800">
                Tienes <strong>{data.pendingShipmentCount}</strong> {data.pendingShipmentCount === 1 ? 'pedido pagado' : 'pedidos pagados'} pendiente{data.pendingShipmentCount === 1 ? '' : 's'} de despacho
              </span>
            </Link>
          )}
          {data.stalePendingCount > 0 && (
            <Link
              href="/admin/pedidos"
              className="bg-yellow-50 border border-yellow-200 p-4 flex items-center gap-3 hover:bg-yellow-100 transition-colors"
            >
              <span className="text-xl">⏱️</span>
              <span className="text-sm text-yellow-800">
                <strong>{data.stalePendingCount}</strong> {data.stalePendingCount === 1 ? 'pedido lleva' : 'pedidos llevan'} más de 2h sin confirmarse el pago
              </span>
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de ventas */}
        <div className="lg:col-span-2 bg-brand-white border border-brand-beige-line p-6">
          <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-6">Ventas Últimos 7 Días</h2>
          <div className="flex items-end gap-3 h-40">
            {Object.entries(data.salesByDay).map(([day, amount]) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] text-brand-text-muted">
                  {amount > 0 ? `$${(amount / 1000).toFixed(0)}k` : ''}
                </span>
                <div
                  className={`w-full transition-all rounded-t-sm ${
                    amount > 0
                      ? 'bg-gradient-to-t from-brand-gold to-green-400'
                      : 'bg-brand-beige-line'
                  }`}
                  style={{ height: `${Math.max((amount / maxDaySale) * 100, amount > 0 ? 4 : 2)}%` }}
                />
                <span className="text-[10px] text-brand-text-muted">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock bajo */}
        <div className="bg-brand-white border border-brand-beige-line p-6">
          <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-4">Stock Bajo</h2>
          {data.lowStockVariants.length === 0 ? (
            <p className="text-sm text-green-700 flex items-center gap-1.5">
              <span>✓</span> Todo con stock saludable
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.lowStockVariants.map((v) => (
                <div key={v.id} className="flex items-center justify-between text-sm">
                  <span className="text-brand-text-dark truncate">{v.productName} {v.sizeMl}ml</span>
                  <span className={`text-xs px-2 py-0.5 flex-shrink-0 ml-2 font-medium ${v.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {v.stock} u.
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos pedidos */}
        <div className="bg-brand-white border border-brand-beige-line p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm uppercase tracking-wide text-brand-text-muted">Últimos Pedidos</h2>
            <Link href="/admin/pedidos" className="text-xs text-brand-gold-dark hover:underline">
              Ver todos
            </Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-brand-text-muted">Aún no hay pedidos.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between text-sm hover:bg-brand-cream/50 -mx-2 px-2 py-1.5 transition-colors rounded"
                >
                  <span className="text-brand-text-dark font-medium">#{order.id}</span>
                  <span className="text-green-700 font-medium">${Number(order.total).toLocaleString('es-CL')}</span>
                  <span className={`text-xs px-2 py-0.5 font-medium ${statusStyles[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top productos */}
        <div className="bg-brand-white border border-brand-beige-line p-6">
          <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-4">Más Vendidos</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-brand-text-muted">Aún no hay ventas registradas.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <span className="text-brand-text-dark">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full mr-2 ${
                        i === 0
                          ? 'bg-yellow-400 text-yellow-900'
                          : i === 1
                          ? 'bg-gray-300 text-gray-700'
                          : i === 2
                          ? 'bg-orange-300 text-orange-900'
                          : 'bg-brand-beige-line text-brand-text-muted'
                      }`}
                    >
                      {i + 1}
                    </span>
                    {p.name} <span className="text-brand-text-muted text-xs">({p.brand})</span>
                  </span>
                  <span className="text-blue-700 font-medium flex-shrink-0">{p.qty} u.</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  accent,
  badge,
}: {
  label: string;
  value: string;
  accent: string;
  badge: string;
}) {
  return (
    <div className={`bg-brand-white border border-brand-beige-line border-l-4 ${accent} p-5`}>
      <p className={`text-[10px] uppercase tracking-wide inline-block px-2 py-0.5 mb-2 ${badge}`}>{label}</p>
      <p className="text-2xl font-display italic text-brand-text-dark">{value}</p>
    </div>
  );
}