'use client';

import { useState } from 'react';
import { saveProduct } from './actions';
import { UploadDropzone } from '@/lib/uploadthing';
import Image from 'next/image';
type Brand = { id: number; name: string };
type FamilyOrNote = { id: number; name: string };

type ImageInput = { imageUrl: string; isMain: boolean };
type VariantInput = { sizeMl: number; price: string; stock: number; availability: 'disponible' | 'agotado' | 'por_encargo'; sku: string };

type ProductData = {
  id?: number;
  name: string;
  slug: string;
  brandId: number;
  gender: 'masculino' | 'femenino' | 'unisex';
  concentration: 'EDT' | 'EDP' | 'Parfum' | 'Extrait' | 'Cologne';
  perfumeType: 'arabe' | 'diseñador' | 'nicho';
  dupeOf: string;
  description: string;
  isFeatured: boolean;
  isActive: boolean;
  images: ImageInput[];
  variants: VariantInput[];
  familyIds: number[];
  noteIds: number[];
  seasonIds: number[];
};

export function ProductForm({
  initialData,
  brandOptions,
  familyOptions,
  noteOptions,
  seasonOptions,
}: {
  initialData: ProductData | null;
  brandOptions: Brand[];
  familyOptions: FamilyOrNote[];
  noteOptions: FamilyOrNote[];
  seasonOptions: FamilyOrNote[];
}) {
  const [form, setForm] = useState<ProductData>(
    initialData ?? {
      name: '',
      slug: '',
      brandId: brandOptions[0]?.id ?? 0,
      gender: 'unisex',
      concentration: 'EDP',
      perfumeType: 'diseñador',
      dupeOf: '',
      description: '',
      isFeatured: false,
      isActive: true,
      images: [{ imageUrl: '', isMain: true }],
      variants: [{ sizeMl: 5, price: '', stock: 0, availability: 'disponible', sku: '' }],
      familyIds: [],
      noteIds: [],
      seasonIds: [],
    }
  );
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof ProductData>(key: K, value: ProductData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // ---- Imágenes ----
  function addImage() {
    updateField('images', [...form.images, { imageUrl: '', isMain: false }]);
  }
  function updateImage(index: number, imageUrl: string) {
    const newImages = [...form.images];
    newImages[index] = { ...newImages[index], imageUrl };
    updateField('images', newImages);
  }
  function setMainImage(index: number) {
    updateField('images', form.images.map((img, i) => ({ ...img, isMain: i === index })));
  }
  function removeImage(index: number) {
    updateField('images', form.images.filter((_, i) => i !== index));
  }

  // ---- Variantes ----
  function addVariant() {
    updateField('variants', [...form.variants, { sizeMl: 5, price: '', stock: 0, availability: 'disponible', sku: '' }]);
  }
  function updateVariant(index: number, field: keyof VariantInput, value: string | number) {
    const newVariants = [...form.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    updateField('variants', newVariants);
  }
  function removeVariant(index: number) {
    updateField('variants', form.variants.filter((_, i) => i !== index));
  }

  // ---- Multi-select toggles ----
  function toggleId(list: number[], id: number): number[] {
    return list.includes(id) ? list.filter((i) => i !== id) : [...list, id];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await saveProduct(initialData?.id ?? null, {
      ...form,
      images: form.images.filter((img) => img.imageUrl.trim() !== ''),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-4xl">
      {/* Datos básicos */}
      <section className="bg-brand-white border border-brand-beige-line p-6">
        <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-4">Información Básica</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs text-brand-text-muted block mb-1">Nombre</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => {
                updateField('name', e.target.value);
                if (!initialData) updateField('slug', generateSlug(e.target.value));
              }}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-brand-text-muted block mb-1">Slug (URL)</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Marca</label>
            <select
              value={form.brandId}
              onChange={(e) => updateField('brandId', Number(e.target.value))}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            >
              {brandOptions.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Género</label>
            <select
              value={form.gender}
              onChange={(e) => updateField('gender', e.target.value as ProductData['gender'])}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            >
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Concentración</label>
            <select
              value={form.concentration}
              onChange={(e) => updateField('concentration', e.target.value as ProductData['concentration'])}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            >
              <option value="EDT">EDT</option>
              <option value="EDP">EDP</option>
              <option value="Parfum">Parfum</option>
              <option value="Extrait">Extrait</option>
              <option value="Cologne">Cologne</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Tipo</label>
            <select
              value={form.perfumeType}
              onChange={(e) => updateField('perfumeType', e.target.value as ProductData['perfumeType'])}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            >
              <option value="arabe">Árabe</option>
              <option value="diseñador">Diseñador</option>
              <option value="nicho">Nicho</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-brand-text-muted block mb-1">Dupe de (opcional)</label>
            <input
              type="text"
              value={form.dupeOf}
              onChange={(e) => updateField('dupeOf', e.target.value)}
              placeholder="Ej: Inspirado en Baccarat Rouge 540"
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-brand-text-muted block mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="w-full border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
            />
          </div>

          <div className="col-span-2 flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => updateField('isFeatured', e.target.checked)}
                className="accent-brand-gold"
              />
              Destacado (aparece en &quot;Los Más Deseados&quot;)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateField('isActive', e.target.checked)}
                className="accent-brand-gold"
              />
              Activo (visible en la tienda)
            </label>
          </div>
        </div>
      </section>

      {/* Imágenes */}
        {/* Imágenes */}
      <section className="bg-brand-white border border-brand-beige-line p-6">
        <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-4">Imágenes</h2>

        {/* Vista previa de imágenes ya agregadas */}
        {form.images.filter((img) => img.imageUrl).length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
            {form.images.map((img, index) =>
              img.imageUrl ? (
                <div key={index} className="relative group">
                  <div className="relative aspect-square bg-brand-cream overflow-hidden border border-brand-beige-line">
                    <Image src={img.imageUrl} alt="" fill className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <label className="flex items-center gap-1 mt-1.5 text-[10px] text-brand-text-muted cursor-pointer">
                    <input
                      type="radio"
                      name="mainImage"
                      checked={img.isMain}
                      onChange={() => setMainImage(index)}
                      className="accent-brand-gold"
                    />
                    Principal
                  </label>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Zona de subida */}
        <UploadDropzone
          endpoint="productImage"
          onClientUploadComplete={(res) => {
            const newImages = res.map((file) => ({
              imageUrl: file.ufsUrl,
              isMain: form.images.filter((i) => i.imageUrl).length === 0,
            }));
            updateField('images', [...form.images.filter((i) => i.imageUrl), ...newImages]);
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
      </section>

      {/* Variantes */}
      <section className="bg-brand-white border border-brand-beige-line p-6">
        <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-4">Variantes (Tamaños)</h2>
        <div className="flex flex-col gap-3">
          {form.variants.map((v, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 items-center">
              <div>
                <label className="text-[10px] text-brand-text-muted block">ML</label>
                <input
                  type="number"
                  value={v.sizeMl}
                  onChange={(e) => updateVariant(index, 'sizeMl', Number(e.target.value))}
                  className="w-full border border-brand-beige-line px-2 py-1.5 text-sm outline-none focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="text-[10px] text-brand-text-muted block">Precio</label>
                <input
                  type="number"
                  value={v.price}
                  onChange={(e) => updateVariant(index, 'price', e.target.value)}
                  className="w-full border border-brand-beige-line px-2 py-1.5 text-sm outline-none focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="text-[10px] text-brand-text-muted block">Stock</label>
                <input
                  type="number"
                  value={v.stock}
                  onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                  className="w-full border border-brand-beige-line px-2 py-1.5 text-sm outline-none focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="text-[10px] text-brand-text-muted block">Disponibilidad</label>
                <select
                  value={v.availability}
                  onChange={(e) => updateVariant(index, 'availability', e.target.value)}
                  className="w-full border border-brand-beige-line px-2 py-1.5 text-sm outline-none focus:border-brand-gold"
                >
                  <option value="disponible">Disponible</option>
                  <option value="agotado">Agotado</option>
                  <option value="por_encargo">Por encargo</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-brand-text-muted block">SKU</label>
                <input
                  type="text"
                  value={v.sku}
                  onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                  className="w-full border border-brand-beige-line px-2 py-1.5 text-sm outline-none focus:border-brand-gold"
                />
              </div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-red-600 text-sm cursor-pointer self-end pb-2"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="text-sm text-brand-gold-dark hover:underline mt-3 cursor-pointer"
        >
          + Agregar variante
        </button>
      </section>

      {/* Familias, notas, temporadas */}
      <section className="bg-brand-white border border-brand-beige-line p-6">
        <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-4">Perfil Olfativo</h2>

        <div className="mb-5">
          <p className="text-xs text-brand-text-muted mb-2">Familias Olfativas</p>
          <div className="flex flex-wrap gap-2">
            {familyOptions.map((f) => (
              <label
                key={f.id}
                className={`text-xs px-3 py-1.5 border cursor-pointer transition-colors ${
                  form.familyIds.includes(f.id)
                    ? 'bg-brand-gold border-brand-gold text-brand-black'
                    : 'border-brand-beige-line text-brand-text-dark'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.familyIds.includes(f.id)}
                  onChange={() => updateField('familyIds', toggleId(form.familyIds, f.id))}
                  className="hidden"
                />
                {f.name}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs text-brand-text-muted mb-2">Notas Olfativas</p>
          <div className="flex flex-wrap gap-2">
            {noteOptions.map((n) => (
              <label
                key={n.id}
                className={`text-xs px-3 py-1.5 border cursor-pointer transition-colors ${
                  form.noteIds.includes(n.id)
                    ? 'bg-brand-gold border-brand-gold text-brand-black'
                    : 'border-brand-beige-line text-brand-text-dark'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.noteIds.includes(n.id)}
                  onChange={() => updateField('noteIds', toggleId(form.noteIds, n.id))}
                  className="hidden"
                />
                {n.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-brand-text-muted mb-2">Temporadas</p>
          <div className="flex flex-wrap gap-2">
            {seasonOptions.map((s) => (
              <label
                key={s.id}
                className={`text-xs px-3 py-1.5 border cursor-pointer transition-colors ${
                  form.seasonIds.includes(s.id)
                    ? 'bg-brand-gold border-brand-gold text-brand-black'
                    : 'border-brand-beige-line text-brand-text-dark'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.seasonIds.includes(s.id)}
                  onChange={() => updateField('seasonIds', toggleId(form.seasonIds, s.id))}
                  className="hidden"
                />
                {s.name}
              </label>
            ))}
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="bg-brand-black text-brand-cream py-3.5 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors cursor-pointer disabled:opacity-50 w-fit px-8"
      >
        {saving ? 'Guardando...' : initialData ? 'Guardar Cambios' : 'Crear Producto'}
      </button>
    </form>
  );
}