'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { CloseIcon } from '@/components/icons';

type FilterOptions = {
  brandOptions: { id: number; name: string; slug: string }[];
  familyOptions: { id: number; name: string }[];
  seasonOptions: { id: number; name: string }[];
};

export function FiltersSidebar({ options }: { options: FilterOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentGenero = searchParams.get('genero');
  const currentTipo = searchParams.get('tipo');
  const currentMarcas = searchParams.getAll('marca');
  const currentFamilias = searchParams.getAll('familia');
  const currentTemporadas = searchParams.getAll('temporada');
  const currentOrden = searchParams.get('orden') ?? 'relevancia';

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleMultiParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    if (current.includes(value)) {
      current.filter((v) => v !== value).forEach((v) => params.append(key, v));
    } else {
      [...current, value].forEach((v) => params.append(key, v));
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function setOrden(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('orden', value);
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasActiveFilters =
    currentGenero || currentTipo || currentMarcas.length > 0 || currentFamilias.length > 0 || currentTemporadas.length > 0;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display italic text-2xl text-brand-text-dark">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-brand-text-muted hover:text-brand-gold-dark transition-colors flex items-center gap-1 cursor-pointer"
          >
            Limpiar <CloseIcon className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Orden (solo visible en mobile arriba de los filtros, opcional) */}
      <div className="mb-6">
        <label className="text-xs uppercase tracking-wide text-brand-text-muted block mb-2">Ordenar por</label>
        <select
          value={currentOrden}
          onChange={(e) => setOrden(e.target.value)}
          className="w-full border border-brand-beige-line bg-brand-white px-3 py-2 text-sm text-brand-text-dark outline-none cursor-pointer"
        >
          <option value="relevancia">Relevancia</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre A-Z</option>
        </select>
      </div>

      {/* Género */}
      <FilterGroup title="Género">
        {['masculino', 'femenino', 'unisex'].map((g) => (
          <FilterCheckbox
            key={g}
            label={g.charAt(0).toUpperCase() + g.slice(1)}
            checked={currentGenero === g}
            onChange={() => updateParam('genero', g)}
          />
        ))}
      </FilterGroup>

      {/* Tipo */}
      <FilterGroup title="Tipo">
        {['arabe', 'diseñador', 'nicho'].map((t) => (
          <FilterCheckbox
            key={t}
            label={t.charAt(0).toUpperCase() + t.slice(1)}
            checked={currentTipo === t}
            onChange={() => updateParam('tipo', t)}
          />
        ))}
      </FilterGroup>

      {/* Marca */}
      {options.brandOptions.length > 0 && (
        <FilterGroup title="Marca">
          {options.brandOptions.map((brand) => (
            <FilterCheckbox
              key={brand.id}
              label={brand.name}
              checked={currentMarcas.includes(brand.slug)}
              onChange={() => toggleMultiParam('marca', brand.slug)}
            />
          ))}
        </FilterGroup>
      )}

      {/* Familia Olfativa */}
      {options.familyOptions.length > 0 && (
        <FilterGroup title="Familia Olfativa">
          {options.familyOptions.map((family) => (
            <FilterCheckbox
              key={family.id}
              label={family.name}
              checked={currentFamilias.includes(family.name)}
              onChange={() => toggleMultiParam('familia', family.name)}
            />
          ))}
        </FilterGroup>
      )}

      {/* Temporada */}
      {options.seasonOptions.length > 0 && (
        <FilterGroup title="Temporada">
          {options.seasonOptions.map((season) => (
            <FilterCheckbox
              key={season.id}
              label={season.name}
              checked={currentTemporadas.includes(season.name)}
              onChange={() => toggleMultiParam('temporada', season.name)}
            />
          ))}
        </FilterGroup>
      )}
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 pb-6 border-b border-brand-beige-line">
      <h4 className="text-xs uppercase tracking-wide text-brand-text-muted mb-3">{title}</h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-brand-text-dark hover:text-brand-gold-dark transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-brand-gold cursor-pointer"
      />
      {label}
    </label>
  );
}