'use client';

import { useState } from 'react';
import { updateOrderStatus } from '../actions';

type Status = 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';

export function StatusSelector({ orderId, currentStatus }: { orderId: number; currentStatus: Status }) {
  const [status, setStatus] = useState<Status>(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: Status) {
    setStatus(newStatus);
    setSaving(true);
    await updateOrderStatus(orderId, newStatus);
    setSaving(false);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as Status)}
        disabled={saving}
        className="border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold cursor-pointer disabled:opacity-50"
      >
        <option value="pendiente">Pendiente</option>
        <option value="pagado">Pagado</option>
        <option value="enviado">Enviado</option>
        <option value="entregado">Entregado</option>
        <option value="cancelado">Cancelado</option>
      </select>
      {saving && <span className="text-xs text-brand-text-muted">Guardando...</span>}
    </div>
  );
}