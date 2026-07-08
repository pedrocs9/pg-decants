'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getHeroSlides, createHeroSlide, toggleHeroSlideActive, deleteHeroSlide } from './actions';
import { UploadDropzone } from '@/lib/uploadthing';

type Slide = {
  id: number;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  linkUrl: string | null;
  displayOrder: number;
  isActive: boolean;
};

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [form, setForm] = useState({ imageUrl: '', title: '', subtitle: '', linkUrl: '', displayOrder: 0 });

  async function refresh() {
    setSlides(await getHeroSlides());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

   async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) return;
    await createHeroSlide(form);
    setForm({ imageUrl: '', title: '', subtitle: '', linkUrl: '', displayOrder: slides.length });
    refresh();
  }

  async function handleToggle(id: number, current: boolean) {
    await toggleHeroSlideActive(id, !current);
    refresh();
  }

  async function handleDelete(id: number) {
    if (confirm('¿Eliminar este banner?')) {
      await deleteHeroSlide(id);
      refresh();
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display italic text-3xl text-brand-text-dark mb-8">Home: Banners (Hero)</h1>

      <form onSubmit={handleCreate} className="bg-brand-white border border-brand-beige-line p-6 mb-6 flex flex-col gap-3">
       <div>
          <label className="text-xs text-brand-text-muted block mb-1">Imagen del banner</label>

          {form.imageUrl ? (
            <div className="relative w-full max-w-sm group">
              <div className="relative aspect-video bg-brand-cream overflow-hidden border border-brand-beige-line">
                <Image src={form.imageUrl} alt="" fill className="object-cover" />
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, imageUrl: '' })}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ) : (
            <UploadDropzone
              endpoint="heroSlideImage"
              onClientUploadComplete={(res) => {
                if (res[0]) setForm((f) => ({ ...f, imageUrl: res[0].ufsUrl }));
              }}
              onUploadError={(error: Error) => {
                alert(`Error al subir imagen: ${error.message}`);
              }}
              appearance={{
                container: 'border-2 border-dashed border-brand-beige-line hover:border-brand-gold transition-colors p-6',
                uploadIcon: 'text-brand-gold',
                label: 'text-brand-text-dark text-sm',
                allowedContent: 'text-brand-text-muted text-xs',
                button: 'bg-brand-gold text-brand-black text-sm font-medium hover:bg-brand-gold-dark hover:text-brand-cream px-4 py-2 after:bg-brand-gold-dark',
              }}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Título</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
          </div>
          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Subtítulo</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Link (ej: /decants?tipo=arabe)</label>
            <input
              type="text"
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
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
        <button
          type="submit"
          disabled={!form.imageUrl}
          className="bg-brand-gold text-brand-black px-5 py-2 text-sm font-medium hover:bg-brand-gold-dark hover:text-brand-cream transition-colors cursor-pointer w-fit disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Agregar Banner
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-brand-white border border-brand-beige-line p-4 flex items-center gap-4">
            <div className="relative w-24 h-16 flex-shrink-0 bg-brand-cream overflow-hidden">
              <Image src={slide.imageUrl} alt={slide.title ?? ''} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-brand-text-dark truncate">{slide.title || '(sin título)'}</p>
              <p className="text-xs text-brand-text-muted truncate">{slide.subtitle}</p>
              <p className="text-xs text-brand-text-muted">Orden: {slide.displayOrder}</p>
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={slide.isActive}
                onChange={() => handleToggle(slide.id, slide.isActive)}
                className="accent-brand-gold"
              />
              Activo
            </label>
            <button onClick={() => handleDelete(slide.id)} className="text-red-600 text-sm hover:underline cursor-pointer">
              Eliminar
            </button>
          </div>
        ))}
        {slides.length === 0 && <p className="text-center py-8 text-brand-text-muted">Sin banners todavía.</p>}
      </div>
    </div>
  );
}