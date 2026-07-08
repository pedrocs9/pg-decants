'use client';

import { useState, useEffect } from 'react';
import { getShippingConfig, saveShippingConfig } from './actions';

export default function ShippingConfigPage() {
  const [flatRate, setFlatRate] = useState('');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const config = await getShippingConfig();
      if (config) {
        setFlatRate(config.flatRate);
        setFreeShippingThreshold(config.freeShippingThreshold ?? '');
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveShippingConfig({ flatRate, freeShippingThreshold });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return <p className="text-brand-text-muted">Cargando...</p>;
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-display italic text-3xl text-brand-text-dark mb-2">Configuración de Envío</h1>
      <p className="text-sm text-brand-text-muted mb-8">
        Define la tarifa fija de envío y desde qué monto ofreces envío gratis.
      </p>

      <form onSubmit={handleSubmit} className="bg-brand-white border border-brand-beige-line p-6 flex flex-col gap-4">
        <div>
          <label className="text-xs text-brand-text-muted block mb-1">Tarifa de envío (CLP)</label>
          <input
            type="number"
            required
            value={flatRate}
            onChange={(e) => setFlatRate(e.target.value)}
            className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
        </div>

        <div>
          <label className="text-xs text-brand-text-muted block mb-1">
            Envío gratis desde (CLP) — opcional, deja vacío para desactivar
          </label>
          <input
            type="number"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(e.target.value)}
            className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
        </div>

        <button
          type="submit"
          className="bg-brand-black text-brand-cream py-3 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors cursor-pointer w-fit px-8 mt-2"
        >
          Guardar Cambios
        </button>

        {saved && <p className="text-sm text-green-700">✓ Configuración guardada correctamente</p>}
      </form>
    </div>
  );
}