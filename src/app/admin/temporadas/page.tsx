'use client';

import { useState, useEffect } from 'react';
import { getSeasons, createSeason, deleteSeason } from './actions';

type Season = { id: number; name: string };

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [name, setName] = useState('');

  async function refresh() {
    setSeasons(await getSeasons());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createSeason(name);
    setName('');
    refresh();
  }

  async function handleDelete(id: number) {
    if (confirm('¿Eliminar esta temporada?')) {
      await deleteSeason(id);
      refresh();
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display italic text-3xl text-brand-text-dark mb-8">Temporadas</h1>

      <form onSubmit={handleCreate} className="bg-brand-white border border-brand-beige-line p-6 mb-6 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs text-brand-text-muted block mb-1">Nombre</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Verano, Invierno..."
            className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
        </div>
        <button type="submit" className="bg-brand-gold text-brand-black px-5 py-2 text-sm font-medium hover:bg-brand-gold-dark hover:text-brand-cream transition-colors cursor-pointer">
          + Agregar
        </button>
      </form>

      <div className="bg-brand-white border border-brand-beige-line">
        {seasons.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-4 py-3 border-b border-brand-beige-line last:border-0">
            <span className="text-brand-text-dark">{s.name}</span>
            <button onClick={() => handleDelete(s.id)} className="text-red-600 text-sm hover:underline cursor-pointer">
              Eliminar
            </button>
          </div>
        ))}
        {seasons.length === 0 && <p className="text-center py-8 text-brand-text-muted">Sin temporadas todavía.</p>}
      </div>
    </div>
  );
}