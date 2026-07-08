'use client';

import { useState } from 'react';
import { CartIcon } from '@/components/icons';
import { addToCart } from '@/app/cart-actions';
import { useCart } from '@/components/cart/CartContext';

type Variant = {
  id: number;
  sizeMl: number;
  price: string;
  stock: number;
  availability: 'disponible' | 'agotado' | 'por_encargo';
};

export function VariantSelector({ variants }: { variants: Variant[] }) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id);
  const [adding, setAdding] = useState(false);
  const selected = variants.find((v) => v.id === selectedId);
  const { refreshCart, openCart } = useCart();

  async function handleAddToCart() {
    if (!selected) return;
    setAdding(true);
    await addToCart(selected.id, 1);
    await refreshCart();
    setAdding(false);
    openCart();
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-brand-text-muted mb-3">Tamaño</p>
        <div className="flex gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedId(v.id)}
              disabled={v.availability === 'agotado'}
              className={`px-4 py-2 text-sm border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                v.id === selectedId
                  ? 'border-brand-gold bg-brand-gold text-brand-black'
                  : 'border-brand-beige-line text-brand-text-dark hover:border-brand-gold-dark'
              }`}
            >
              {v.sizeMl}ml
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <>
          <p className="text-3xl font-display italic text-brand-text-dark mb-1">
            ${Number(selected.price).toLocaleString('es-CL')} CLP
          </p>
          <p
            className={`text-xs uppercase tracking-wide mb-6 ${
              selected.availability === 'disponible'
                ? 'text-green-700'
                : selected.availability === 'por_encargo'
                ? 'text-brand-gold-dark'
                : 'text-red-600'
            }`}
          >
            {selected.availability === 'disponible' && 'Disponible'}
            {selected.availability === 'por_encargo' && 'Por encargo'}
            {selected.availability === 'agotado' && 'Agotado'}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={selected.availability === 'agotado' || adding}
            className="w-full flex items-center justify-center gap-2 bg-brand-black text-brand-cream py-3.5 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CartIcon className="w-4 h-4" />
            {adding ? 'Agregando...' : 'Agregar al Carrito'}
          </button>
        </>
      )}
    </div>
  );
}