'use client';

import { useState, useEffect } from 'react';
import { getTrustBadges, createTrustBadge, toggleTrustBadge, deleteTrustBadge } from './actions';

type IconOption = 'perfume' | 'shipping' | 'securePayment' | 'heart' | 'cart';
type Badge = { id: number; icon: IconOption; title: string; subtitle: string | null; displayOrder: number; isActive: boolean };

const iconLabels: Record<IconOption, string> = {
  perfume: 'Perfume',
  shipping: 'Envío',
  securePayment: 'Pago Seguro',
  heart: 'Corazón',
  cart: 'Carrito',
};

export default function TrustBadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [form, setForm] = useState<{ icon: IconOption; title: string; subtitle: string; displayOrder: number }>({
    icon: 'perfume',
    title: '',
    subtitle: '',
    displayOrder: 0,
  });

  async function refresh() {
    setBadges(await getTrustBadges());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createTrustBadge(form);
    setForm({ icon: 'perfume', title: '', subtitle: '', displayOrder: badges.length });
    refresh();
  }

  async function handleDelete(id: number) {
    if (confirm('¿Eliminar este badge?')) {
      await deleteTrustBadge(id);
      refresh();
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display italic text-3xl text-brand-text-dark mb-2">Franja de Confianza</h1>
      <p className="text-sm text-brand-text-muted mb-8">
        Los íconos que aparecen debajo del banner animado en la home.
      </p>

      <form onSubmit={handleCreate} className="bg-brand-white border border-brand-beige-line p-6 mb-6 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Ícono</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value as IconOption })}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            >
              {Object.entries(iconLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Orden</label>
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-brand-text-muted block mb-1">Título</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ej: 100% Originales"
            className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
        </div>
        <div>
          <label className="text-xs text-brand-text-muted block mb-1">Subtítulo (opcional)</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Ej: Decants extraídos de perfumes auténticos"
            className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
        </div>
        <button type="submit" className="bg-brand-gold text-brand-black px-5 py-2 text-sm font-medium hover:bg-brand-gold-dark hover:text-brand-cream transition-colors cursor-pointer w-fit">
          + Agregar
        </button>
      </form>

      <div className="bg-brand-white border border-brand-beige-line">
        {badges.map((b) => (
          <div key={b.id} className="flex items-center justify-between px-4 py-3 border-b border-brand-beige-line last:border-0">
            <div>
              <p className="text-sm text-brand-text-dark">{b.title}</p>
              <p className="text-xs text-brand-text-muted">{iconLabels[b.icon]} · {b.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={b.isActive}
                  onChange={async () => { await toggleTrustBadge(b.id, !b.isActive); refresh(); }}
                  className="accent-brand-gold"
                />
                Activo
              </label>
              <button onClick={() => handleDelete(b.id)} className="text-red-600 text-xs hover:underline cursor-pointer">
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {badges.length === 0 && <p className="text-center py-8 text-brand-text-muted">Sin badges todavía.</p>}
      </div>
    </div>
  );
}