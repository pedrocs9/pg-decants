'use server';

import { db } from '@/db';
import { orders, orderItems, variants, products, brands } from '@/db/schema';
import { eq, gte, sql, inArray, desc, and, lte } from 'drizzle-orm';

export async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Ventas del mes (pedidos pagados en adelante)
  const paidStatuses = ['pagado', 'enviado', 'entregado'] as const;

  const monthOrders = await db
    .select({ total: orders.total })
    .from(orders)
    .where(and(inArray(orders.status, paidStatuses), gte(orders.createdAt, startOfMonth)));

  const monthSales = monthOrders.reduce((sum, o) => sum + Number(o.total), 0);

  // Total histórico de pedidos y ventas
  const allPaidOrders = await db
    .select({ total: orders.total })
    .from(orders)
    .where(inArray(orders.status, paidStatuses));

  const totalSales = allPaidOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrdersCount = allPaidOrders.length;
  const averageTicket = totalOrdersCount > 0 ? totalSales / totalOrdersCount : 0;

  // Pedidos pendientes de despacho (pagados, no enviados aún)
  const [{ count: pendingShipmentCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(eq(orders.status, 'pagado'));

  // Pedidos con pago pendiente hace más de 2 horas
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const [{ count: stalePendingCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(and(eq(orders.status, 'pendiente'), lte(orders.createdAt, twoHoursAgo)));

  // Stock bajo (menos de 5 unidades) o agotado
  const lowStockVariants = await db
    .select({
      id: variants.id,
      sizeMl: variants.sizeMl,
      stock: variants.stock,
      productName: products.name,
    })
    .from(variants)
    .innerJoin(products, eq(variants.productId, products.id))
    .where(lte(variants.stock, 5))
    .orderBy(variants.stock)
    .limit(6);

  // Últimos 5 pedidos
  const recentOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(5);

  // Ventas de los últimos 7 días (para el gráfico)
  const recentOrdersForChart = await db
    .select({ total: orders.total, createdAt: orders.createdAt })
    .from(orders)
    .where(and(inArray(orders.status, paidStatuses), gte(orders.createdAt, sevenDaysAgo)));

  const salesByDay: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
    salesByDay[key] = 0;
  }
  recentOrdersForChart.forEach((o) => {
    const key = new Date(o.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
    if (key in salesByDay) salesByDay[key] += Number(o.total);
  });

  // Top 5 productos más vendidos (por unidades)
  const topProductsRaw = await db
    .select({
      productName: products.name,
      brandName: brands.name,
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .innerJoin(variants, eq(orderItems.variantId, variants.id))
    .innerJoin(products, eq(variants.productId, products.id))
    .innerJoin(brands, eq(products.brandId, brands.id));

  const topProductsMap = new Map<string, { name: string; brand: string; qty: number }>();
  topProductsRaw.forEach((row) => {
    const key = row.productName;
    const existing = topProductsMap.get(key);
    if (existing) {
      existing.qty += row.quantity;
    } else {
      topProductsMap.set(key, { name: row.productName, brand: row.brandName, qty: row.quantity });
    }
  });
  const topProducts = Array.from(topProductsMap.values()).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return {
    monthSales,
    totalSales,
    totalOrdersCount,
    averageTicket,
    pendingShipmentCount,
    stalePendingCount,
    lowStockVariants,
    recentOrders,
    salesByDay,
    topProducts,
  };
}