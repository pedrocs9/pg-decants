'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getBrands, createBrand, updateBrand, deleteBrand, toggleBrandFeatured } from './actions';

type Brand = { id: number; name: string; slug: string; logoUrl: string | null; isFeatured: boolean; productCount: number };

const emptyForm = { name: '', slug: '', logoUrl: '', isFeatured: false };

function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
}

const inputClass = 'border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold w-full';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  async function refresh() { setBrands(await getBrands()); }
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refresh(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createBrand(form.name, form.slug, form.logoUrl, form.isFeatured);
    setForm(emptyForm);
    refresh();
  }

  function startEdit(b: Brand) {
    setEditing(b);
    setEditForm({ name: b.name, slug: b.slug, logoUrl: b.logoUrl ?? '', isFeatured: b.isFeatured });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    await updateBrand(editing.id, editForm.name, editForm.slug, editForm.logoUrl, editForm.isFeatured);
    setEditing(null);
    refresh();
  }

  async function handleDelete(b: Brand) {
    if (b.productCount > 0) {
      alert(`No se puede eliminar "${b.name}" porque tiene ${b.productCount} producto${b.productCount > 1 ? 's' : ''} asociado${b.productCount > 1 ? 's' : ''}. Reasigna o elimina esos productos primero.`);
      return;
    }
    if (confirm(`¿Eliminar "${b.name}"?`)) {
      await deleteBrand(b.id);
      refresh();
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display italic text-3xl text-brand-text-dark mb-8">Marcas</h1>

      {/* Formulario crear */}
      <form onSubmit={handleCreate} className="bg-brand-white border border-brand-beige-line p-6 mb-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Nombre</label>
            <input
              type="text" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: toSlug(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Slug</label>
            <input
              type="text" required value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-brand-text-muted block mb-1">Logo URL (opcional)</label>
          <input
            type="text" value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            className={inputClass} placeholder="https://cdn.brandfetch.io/..."
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-brand-gold" />
            Destacada (aparece en la home)
          </label>
          <button type="submit" className="bg-brand-gold text-brand-black px-5 py-2 text-sm font-medium hover:bg-brand-gold-dark hover:text-brand-cream transition-colors cursor-pointer">
            + Agregar
          </button>
        </div>
      </form>

      {/* Lista */}
      <div className="bg-brand-white border border-brand-beige-line">
        {brands.map((b) => (
          <div key={b.id} className="flex items-center justify-between px-4 py-3 border-b border-brand-beige-line last:border-0 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {b.logoUrl ? (
                <div className="relative w-10 h-10 flex-shrink-0 bg-brand-cream border border-brand-beige-line overflow-hidden">
                  <Image src={b.logoUrl} alt={b.name} fill className="object-contain p-1" unoptimized />
                </div>
              ) : (
                <div className="w-10 h-10 flex-shrink-0 bg-brand-cream border border-brand-beige-line flex items-center justify-center text-xs text-brand-text-muted">
                  {b.name[0]}
                </div>
              )}
              <div>
                <p className="text-sm text-brand-text-dark font-medium">{b.name}</p>
                <p className="text-xs text-brand-text-muted">{b.productCount} producto{b.productCount !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input type="checkbox" checked={b.isFeatured} onChange={() => toggleBrandFeatured(b.id, !b.isFeatured).then(refresh)} className="accent-brand-gold" />
                Destacada
              </label>
              <button onClick={() => startEdit(b)} className="text-brand-gold-dark text-sm hover:underline cursor-pointer">
                Editar
              </button>
              <button
                onClick={() => handleDelete(b)}
                className={`text-sm cursor-pointer ${b.productCount > 0 ? 'text-brand-text-muted cursor-not-allowed' : 'text-red-600 hover:underline'}`}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {brands.length === 0 && <p className="text-center py-8 text-brand-text-muted">Sin marcas todavía.</p>}
      </div>

      {/* Modal editar */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleUpdate} className="bg-brand-white border border-brand-beige-line p-6 w-full max-w-md flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display italic text-xl text-brand-text-dark">Editar {editing.name}</h2>
              <button type="button" onClick={() => setEditing(null)} className="text-brand-text-muted hover:text-brand-text-dark cursor-pointer">✕</button>
            </div>
            <div>
              <label className="text-xs text-brand-text-muted block mb-1">Nombre</label>
              <input type="text" required value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-brand-text-muted block mb-1">Slug</label>
              <input type="text" required value={editForm.slug}
                onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-brand-text-muted block mb-1">Logo URL</label>
              <input type="text" value={editForm.logoUrl}
                onChange={(e) => setEditForm({ ...editForm, logoUrl: e.target.value })}
                className={inputClass} placeholder="https://cdn.brandfetch.io/..." />
              {editForm.logoUrl && (
                <div className="mt-2 relative w-16 h-16 bg-brand-cream border border-brand-beige-line overflow-hidden">
                  <Image src={editForm.logoUrl} alt="" fill className="object-contain p-1" unoptimized />
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={editForm.isFeatured}
                onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })}
                className="accent-brand-gold" />
              Destacada (aparece en la home)
            </label>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-brand-gold text-brand-black py-2 text-sm font-medium hover:bg-brand-gold-dark hover:text-brand-cream transition-colors cursor-pointer">
                Guardar cambios
              </button>
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm border border-brand-beige-line hover:border-brand-gold transition-colors cursor-pointer">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}