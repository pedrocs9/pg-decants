'use client';

import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
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

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function getVariantHint(sizeMl: number) {
  if (sizeMl <= 3) return 'Para descubrir';
  if (sizeMl === 5) return 'Para usar varias veces';
  return 'Para disfrutar con frecuencia';
}

function getAvailabilityLabel(variant?: Variant) {
  if (!variant) return 'Sin formato seleccionado';
  if (variant.availability === 'agotado') return 'Agotado';
  if (variant.availability === 'por_encargo') return 'Por encargo';
  return 'Disponible';
}

function getInitialVariantId(variants: Variant[]) {
  const firstPurchasable = variants.find((variant) => variant.availability !== 'agotado' && variant.stock > 0);
  const firstAvailable = variants.find((variant) => variant.availability !== 'agotado');
  return firstPurchasable?.id ?? firstAvailable?.id ?? variants[0]?.id;
}

function TrustIcon({ type }: { type: 'original' | 'care' | 'shipping' | 'payment' }) {
  const common = {
    className: 'h-5 w-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (type === 'care') {
    return (
      <svg {...common}>
        <path d="M6 4h12v16H6z" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h3" />
      </svg>
    );
  }

  if (type === 'shipping') {
    return (
      <svg {...common}>
        <path d="M3 7h11v10H3z" />
        <path d="M14 10h4l3 3v4h-7z" />
        <path d="M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </svg>
    );
  }

  if (type === 'payment') {
    return (
      <svg {...common}>
        <path d="M4 7h16v11H4z" />
        <path d="M4 10h16" />
        <path d="M8 15h4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M9 3h6" />
      <path d="M10 3v4l-4 8a4 4 0 0 0 3.6 6h4.8a4 4 0 0 0 3.6-6l-4-8V3" />
      <path d="M8 15h8" />
    </svg>
  );
}

const trustItems = [
  { icon: 'original' as const, label: 'Decantado desde el frasco original' },
  { icon: 'care' as const, label: 'Preparación cuidadosa y etiquetado' },
  { icon: 'shipping' as const, label: 'Envíos a todo Chile' },
  { icon: 'payment' as const, label: 'Pago seguro' },
];

export function VariantSelector({ variants }: { variants: Variant[] }) {
  const [selectedId, setSelectedId] = useState<number | undefined>(() => getInitialVariantId(variants));
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [hasSelectedVariant, setHasSelectedVariant] = useState(false);
  const selected = variants.find((variant) => variant.id === selectedId);
  const { refreshCart, openCart } = useCart();

  const minPrice = useMemo(() => {
    if (variants.length === 0) return null;
    return variants.reduce((min, variant) => Math.min(min, Number(variant.price)), Number(variants[0].price));
  }, [variants]);

  const hasDifferentPrices = useMemo(() => {
    const prices = new Set(variants.map((variant) => Number(variant.price)));
    return prices.size > 1;
  }, [variants]);

  const maxQuantity = selected ? Math.max(1, selected.stock) : 1;
  const isSoldOut = !selected || selected.availability === 'agotado' || selected.stock <= 0;
  const canAdd = Boolean(selected) && !isSoldOut && !adding;
  const shouldShowFromPrice = hasDifferentPrices && !hasSelectedVariant;
  const displayPrice = shouldShowFromPrice ? minPrice : selected ? Number(selected.price) : minPrice;

  async function handleAddToCart() {
    if (!selected || !canAdd) return;
    setAdding(true);
    setAdded(false);
    await addToCart(selected.id, quantity);
    await refreshCart();
    setAdding(false);
    setAdded(true);
    openCart();
  }

  function selectVariant(id: number) {
    const nextVariant = variants.find((variant) => variant.id === id);
    const nextMaxQuantity = nextVariant ? Math.max(1, nextVariant.stock) : 1;
    setSelectedId(id);
    setQuantity((current) => Math.min(Math.max(1, current), nextMaxQuantity));
    setAdded(false);
    setHasSelectedVariant(true);
  }

  function handleVariantKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;

    const enabledVariants = variants.filter((variant) => variant.availability !== 'agotado' && variant.stock > 0);
    if (enabledVariants.length === 0) return;

    event.preventDefault();
    const currentIndex = Math.max(
      0,
      enabledVariants.findIndex((variant) => variant.id === selectedId)
    );
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (currentIndex + direction + enabledVariants.length) % enabledVariants.length;
    selectVariant(enabledVariants[nextIndex].id);
  }

  return (
    <div className="space-y-7">
      <div aria-live="polite">
        {displayPrice !== null ? (
          <>
            <p className="text-xs uppercase tracking-[0.18em] text-brand-text-muted">
              {shouldShowFromPrice ? 'Desde' : 'Precio seleccionado'}
            </p>
            <p className="mt-1 font-display text-4xl italic leading-none text-brand-text-dark">
              {formatCurrency(displayPrice)}
              <span className="ml-2 align-middle font-sans text-xs font-medium uppercase tracking-[0.16em] text-brand-text-muted">
                CLP
              </span>
            </p>
          </>
        ) : (
          <p className="text-sm text-brand-text-muted">No hay formatos disponibles por ahora.</p>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-4">
          <p id="variant-options-label" className="text-xs uppercase tracking-[0.18em] text-brand-text-muted">
            Formato
          </p>
          <p className="text-xs text-brand-text-muted" aria-live="polite">
            {getAvailabilityLabel(selected)}
          </p>
        </div>

        {variants.length > 0 ? (
          <div
            role="radiogroup"
            aria-labelledby="variant-options-label"
            onKeyDown={handleVariantKeyDown}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
          >
            {variants.map((variant) => {
              const isSelected = variant.id === selectedId;
              const isDisabled = variant.availability === 'agotado' || variant.stock <= 0;

              return (
                <button
                  key={variant.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={isDisabled}
                  onClick={() => selectVariant(variant.id)}
                  className={`min-h-[104px] border px-4 py-3 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed ${
                    isSelected
                      ? 'border-brand-gold bg-brand-black text-brand-cream'
                      : 'border-brand-beige-line bg-brand-white text-brand-text-dark hover:border-brand-gold-dark'
                  } ${isDisabled ? 'opacity-55' : ''}`}
                >
                  <span className="block font-display text-2xl italic leading-none">
                    {variant.sizeMl}ml
                  </span>
                  <span className={`mt-2 block text-xs ${isSelected ? 'text-brand-cream/70' : 'text-brand-text-muted'}`}>
                    {getVariantHint(variant.sizeMl)}
                  </span>
                  <span className={`mt-3 block text-sm font-medium ${isSelected ? 'text-brand-gold' : 'text-brand-gold-dark'}`}>
                    {formatCurrency(variant.price)}
                  </span>
                  <span className={`mt-1 block text-[11px] uppercase tracking-[0.14em] ${isSelected ? 'text-brand-cream/70' : 'text-brand-text-muted'}`}>
                    {isDisabled ? 'Agotado' : getAvailabilityLabel(variant)}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="border border-brand-beige-line bg-brand-white px-4 py-5 text-sm text-brand-text-muted">
            Este producto no tiene formatos disponibles.
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
        <div>
          <label htmlFor="product-quantity" className="mb-3 block text-xs uppercase tracking-[0.18em] text-brand-text-muted">
            Cantidad
          </label>
          <div className="flex min-h-12 border border-brand-beige-line bg-brand-white">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              disabled={!selected || quantity <= 1}
              aria-label="Disminuir cantidad"
              className="grid h-12 w-12 place-items-center text-lg text-brand-text-dark transition-colors hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:opacity-35"
            >
              -
            </button>
            <input
              id="product-quantity"
              type="number"
              min={1}
              max={maxQuantity}
              value={quantity}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isNaN(next)) return;
                setQuantity(Math.min(Math.max(1, next), maxQuantity));
              }}
              disabled={!selected || isSoldOut}
              className="h-12 w-full min-w-0 border-x border-brand-beige-line bg-transparent text-center text-sm text-brand-text-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
              disabled={!selected || isSoldOut || quantity >= maxQuantity}
              aria-label="Aumentar cantidad"
              className="grid h-12 w-12 place-items-center text-lg text-brand-text-dark transition-colors hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:opacity-35"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAdd}
            aria-label={
              selected
                ? `Agregar al carrito ${quantity} unidad${quantity === 1 ? '' : 'es'} de ${selected.sizeMl}ml`
                : 'Agregar al carrito'
            }
            className="flex min-h-12 w-full items-center justify-center gap-2 bg-brand-black px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-brand-cream transition-colors hover:bg-brand-text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:opacity-45"
          >
            <CartIcon className="h-4 w-4" />
            {variants.length === 0 && 'Sin formatos'}
            {variants.length > 0 && isSoldOut && !adding && 'Agotado'}
            {variants.length > 0 && !isSoldOut && adding && 'Agregando...'}
            {variants.length > 0 && !isSoldOut && !adding && !added && 'Agregar al carrito'}
            {variants.length > 0 && !isSoldOut && !adding && added && 'Agregado'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 border-t border-brand-beige-line pt-5 sm:grid-cols-2">
        {trustItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3 text-sm text-brand-text-muted">
            <span className="grid h-9 w-9 flex-shrink-0 place-items-center border border-brand-beige-line text-brand-gold-dark">
              <TrustIcon type={item.icon} />
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
