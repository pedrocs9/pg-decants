'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CloseIcon } from '@/components/icons';
import type { FilterOptions } from '@/components/catalog/FiltersSidebar';

const genderOptions = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'unisex', label: 'Unisex' },
];

const typeOptions = [
  { value: 'arabe', label: 'Arabe' },
  { value: 'diseñador', label: 'Diseñador' },
  { value: 'nicho', label: 'Nicho' },
];

const orderOptions = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'nombre', label: 'Nombre A-Z' },
];

type ActiveChip = {
  key: string;
  value: string;
  label: string;
};

export function MobileCatalogControls({
  options,
  productCount,
}: {
  options: FilterOptions;
  productCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const orderButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const currentGenero = searchParams.get('genero');
  const currentTipo = searchParams.get('tipo');
  const currentMarcas = searchParams.getAll('marca');
  const currentFamilias = searchParams.getAll('familia');
  const currentTemporadas = searchParams.getAll('temporada');
  const currentOrden = searchParams.get('orden') ?? 'relevancia';

  const activeChips = useMemo<ActiveChip[]>(() => {
    const chips: ActiveChip[] = [];
    const gender = genderOptions.find((option) => option.value === currentGenero);
    const type = typeOptions.find((option) => option.value === currentTipo);

    if (gender) chips.push({ key: 'genero', value: gender.value, label: gender.label });
    if (type) chips.push({ key: 'tipo', value: type.value, label: type.label });

    currentMarcas.forEach((slug) => {
      const brand = options.brandOptions.find((option) => option.slug === slug);
      chips.push({ key: 'marca', value: slug, label: brand?.name ?? slug });
    });

    currentFamilias.forEach((name) => chips.push({ key: 'familia', value: name, label: name }));
    currentTemporadas.forEach((name) => chips.push({ key: 'temporada', value: name, label: name }));

    return chips;
  }, [currentFamilias, currentGenero, currentMarcas, currentTemporadas, currentTipo, options.brandOptions]);

  const hasActiveFilters = activeChips.length > 0;
  const currentOrderLabel = orderOptions.find((option) => option.value === currentOrden)?.label ?? 'Ordenar';

  useEffect(() => {
    if (!filtersOpen && !orderOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (filtersOpen) {
          setFiltersOpen(false);
          filterButtonRef.current?.focus();
        }
        if (orderOpen) {
          setOrderOpen(false);
          orderButtonRef.current?.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filtersOpen, orderOpen]);

  useEffect(() => {
    if (filtersOpen) {
      drawerRef.current?.focus();
    }
  }, [filtersOpen]);

  function pushParams(params: URLSearchParams) {
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function updateSingleParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    pushParams(params);
  }

  function toggleMultiParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);

    if (current.includes(value)) {
      current.filter((item) => item !== value).forEach((item) => params.append(key, item));
    } else {
      [...current, value].forEach((item) => params.append(key, item));
    }

    pushParams(params);
  }

  function removeChip(chip: ActiveChip) {
    const params = new URLSearchParams(searchParams.toString());

    if (chip.key === 'genero' || chip.key === 'tipo') {
      params.delete(chip.key);
    } else {
      const values = params.getAll(chip.key).filter((value) => value !== chip.value);
      params.delete(chip.key);
      values.forEach((value) => params.append(chip.key, value));
    }

    pushParams(params);
  }

  function setOrder(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'relevancia') {
      params.delete('orden');
    } else {
      params.set('orden', value);
    }
    pushParams(params);
    setOrderOpen(false);
    orderButtonRef.current?.focus();
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    ['genero', 'tipo', 'marca', 'familia', 'temporada'].forEach((key) => params.delete(key));
    pushParams(params);
  }

  function closeFilters() {
    setFiltersOpen(false);
    filterButtonRef.current?.focus();
    document.getElementById('catalog-grid')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  return (
    <>
      <div className="lg:hidden">
        <div className="flex items-center justify-between gap-3 border-y border-brand-beige-line bg-brand-cream/80 py-3">
          <p className="text-sm text-brand-text-muted">
            <span className="text-brand-text-dark font-medium">{productCount}</span>{' '}
            {productCount === 1 ? 'producto' : 'productos'}
          </p>
          <div className="flex items-center gap-2">
            <button
              ref={filterButtonRef}
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="min-h-11 border border-brand-beige-line bg-brand-white px-4 text-xs font-medium uppercase tracking-[0.12em] text-brand-text-dark transition-colors hover:border-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              Filtrar
            </button>
            <button
              ref={orderButtonRef}
              type="button"
              onClick={() => setOrderOpen(true)}
              className="min-h-11 border border-brand-beige-line bg-brand-white px-4 text-xs font-medium uppercase tracking-[0.12em] text-brand-text-dark transition-colors hover:border-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              aria-haspopup="dialog"
            >
              Ordenar
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex max-h-[72px] items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {activeChips.map((chip) => (
              <button
                key={`${chip.key}-${chip.value}`}
                type="button"
                onClick={() => removeChip(chip)}
                className="inline-flex min-h-9 shrink-0 items-center gap-1 border border-brand-beige-line bg-brand-white px-3 text-xs text-brand-text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              >
                {chip.label}
                <CloseIcon className="h-3 w-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="min-h-9 shrink-0 px-2 text-xs font-medium text-brand-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-brand-black/45"
            onClick={closeFilters}
            aria-label="Cerrar filtros"
          />
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            tabIndex={-1}
            className="absolute right-0 top-0 flex h-full w-[min(100vw,390px)] flex-col bg-brand-cream shadow-xl focus:outline-none"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-brand-beige-line bg-brand-cream px-5 py-4">
              <h2 className="font-display text-2xl italic text-brand-text-dark">Filtros</h2>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="min-h-11 px-2 text-xs font-medium uppercase tracking-[0.12em] text-brand-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                  >
                    Limpiar
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeFilters}
                  aria-label="Cerrar filtros"
                  className="grid h-11 w-11 place-items-center text-brand-text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 pb-28">
              <MobileFilterGroup title="Genero">
                {genderOptions.map((option) => (
                  <MobileFilterCheckbox
                    key={option.value}
                    label={option.label}
                    checked={currentGenero === option.value}
                    onChange={() => updateSingleParam('genero', option.value)}
                  />
                ))}
              </MobileFilterGroup>

              <MobileFilterGroup title="Tipo">
                {typeOptions.map((option) => (
                  <MobileFilterCheckbox
                    key={option.value}
                    label={option.label}
                    checked={currentTipo === option.value}
                    onChange={() => updateSingleParam('tipo', option.value)}
                  />
                ))}
              </MobileFilterGroup>

              {options.brandOptions.length > 0 && (
                <MobileFilterGroup title="Marca">
                  {options.brandOptions.map((brand) => (
                    <MobileFilterCheckbox
                      key={brand.id}
                      label={brand.name}
                      checked={currentMarcas.includes(brand.slug)}
                      onChange={() => toggleMultiParam('marca', brand.slug)}
                    />
                  ))}
                </MobileFilterGroup>
              )}

              {options.familyOptions.length > 0 && (
                <MobileFilterGroup title="Familia Olfativa">
                  {options.familyOptions.map((family) => (
                    <MobileFilterCheckbox
                      key={family.id}
                      label={family.name}
                      checked={currentFamilias.includes(family.name)}
                      onChange={() => toggleMultiParam('familia', family.name)}
                    />
                  ))}
                </MobileFilterGroup>
              )}

              {options.seasonOptions.length > 0 && (
                <MobileFilterGroup title="Temporada">
                  {options.seasonOptions.map((season) => (
                    <MobileFilterCheckbox
                      key={season.id}
                      label={season.name}
                      checked={currentTemporadas.includes(season.name)}
                      onChange={() => toggleMultiParam('temporada', season.name)}
                    />
                  ))}
                </MobileFilterGroup>
              )}
            </div>

            <div className="fixed bottom-0 right-0 w-[min(100vw,390px)] border-t border-brand-beige-line bg-brand-cream p-4">
              <button
                type="button"
                onClick={closeFilters}
                className="min-h-12 w-full bg-brand-black px-4 text-sm font-medium uppercase tracking-[0.12em] text-brand-cream transition-colors hover:bg-brand-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              >
                Ver {productCount} {productCount === 1 ? 'producto' : 'productos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {orderOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-brand-black/35"
            onClick={() => {
              setOrderOpen(false);
              orderButtonRef.current?.focus();
            }}
            aria-label="Cerrar ordenamiento"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Ordenar productos"
            className="absolute inset-x-0 bottom-0 bg-brand-cream border-t border-brand-beige-line p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl italic text-brand-text-dark">Ordenar</h2>
                <p className="text-xs text-brand-text-muted mt-1">{currentOrderLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOrderOpen(false);
                  orderButtonRef.current?.focus();
                }}
                aria-label="Cerrar ordenamiento"
                className="grid h-11 w-11 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-2">
              {orderOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setOrder(option.value)}
                  className={`min-h-12 border px-4 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${
                    currentOrden === option.value
                      ? 'border-brand-gold bg-brand-white text-brand-gold-dark'
                      : 'border-brand-beige-line bg-brand-white text-brand-text-dark'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MobileFilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-brand-beige-line py-5 first:pt-0">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-brand-text-muted">{title}</h3>
      <div className="grid gap-2">{children}</div>
    </section>
  );
}

function MobileFilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-brand-text-dark transition-colors hover:text-brand-gold-dark">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-brand-gold cursor-pointer"
      />
      <span>{label}</span>
    </label>
  );
}
