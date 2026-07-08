'use client';

import { useState, useEffect } from 'react';
import { getBrands, createBrand, deleteBrand, toggleBrandFeatured } from './actions';

type Brand = { id: number; name: string; slug: string; logoUrl: string | null; isFeatured: boolean };

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  async function refresh() {
    setBrands(await getBrands());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createBrand(name, slug, logoUrl, isFeatured);
    setName('');
    setSlug('');
    setLogoUrl('');
    setIsFeatured(false);
    refresh();
  }

  async function handleDelete(id: number) {
    if (confirm('¿Eliminar esta marca?')) {
      await deleteBrand(id);
      refresh();
    }
  }

  async function handleToggleFeatured(id: number, current: boolean) {
    await toggleBrandFeatured(id, !current);
    refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display italic text-3xl text-brand-text-dark mb-8">Marcas</h1>

      <form onSubmit={handleCreate} className="bg-brand-white border border-brand-beige-line p-6 mb-6 flex gap-3 items-end flex-wrap">
        <div>
          <label className="text-xs text-brand-text-muted block mb-1">Nombre</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(e.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'));
            }}
            className="border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
        </div>
        <div>
          <label className="text-xs text-brand-text-muted block mb-1">Slug</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
        </div>
        <div>
          <label className="text-xs text-brand-text-muted block mb-1">Logo URL (opcional)</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="accent-brand-gold"
          />
          Destacada
        </label>
        <button type="submit" className="bg-brand-gold text-brand-black px-5 py-2 text-sm font-medium hover:bg-brand-gold-dark hover:text-brand-cream transition-colors cursor-pointer">
          + Agregar
        </button>
      </form>

      <div className="bg-brand-white border border-brand-beige-line">
        {brands.map((b) => (
          <div key={b.id} className="flex items-center justify-between px-4 py-3 border-b border-brand-beige-line last:border-0">
            <span className="text-brand-text-dark">{b.name}</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={b.isFeatured}
                  onChange={() => handleToggleFeatured(b.id, b.isFeatured)}
                  className="accent-brand-gold"
                />
                Destacada
              </label>
              <button onClick={() => handleDelete(b.id)} className="text-red-600 text-sm hover:underline cursor-pointer">
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {brands.length === 0 && <p className="text-center py-8 text-brand-text-muted">Sin marcas todavía.</p>}
      </div>
    </div>
  );
}