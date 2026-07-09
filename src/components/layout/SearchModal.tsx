'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SearchIcon, CloseIcon } from '@/components/icons';
import { searchProducts } from '@/app/search-actions';

type Result = {
  id: number;
  name: string;
  slug: string;
  brandName: string;
  image: string;
  minPrice: number;
};

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      const data = await searchProducts(query);
      setResults(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length > 0) {
      setOpen(false);
      router.push(`/decants?buscar=${encodeURIComponent(query)}`);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Buscar"
        className="text-brand-gold hover:text-brand-gold-dark transition-colors cursor-pointer"
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-brand-black/60" onClick={() => setOpen(false)} />

          <div className="relative max-w-2xl mx-auto mt-24 px-4">
            <div className="bg-brand-cream shadow-2xl">
              <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-brand-beige-line">
                <SearchIcon className="w-5 h-5 text-brand-text-muted flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar perfumes, marcas..."
                  className="flex-1 bg-transparent outline-none text-brand-text-dark placeholder:text-brand-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar búsqueda"
                  className="text-brand-text-muted hover:text-brand-text-dark transition-colors cursor-pointer flex-shrink-0"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </form>

              {query.trim().length >= 2 && (
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <p className="text-center py-8 text-sm text-brand-text-muted">Buscando...</p>
                  ) : results.length > 0 ? (
                    <div className="py-2">
                      {results.map((r) => (
                        <Link
                          key={r.id}
                          href={`/producto/${r.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-brand-white transition-colors"
                        >
                          <div className="relative w-12 h-12 bg-brand-white flex-shrink-0 overflow-hidden">
                            {r.image && <Image src={r.image} alt={r.name} fill className="object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-brand-text-muted uppercase">{r.brandName}</p>
                            <p className="text-sm text-brand-text-dark truncate">{r.name}</p>
                          </div>
                          <p className="text-sm text-brand-gold-dark font-medium flex-shrink-0">
                            ${r.minPrice.toLocaleString('es-CL')}
                          </p>
                        </Link>
                      ))}
                      <button
                        onClick={handleSubmit}
                        className="w-full text-center py-3 text-sm text-brand-gold-dark hover:bg-brand-white transition-colors cursor-pointer border-t border-brand-beige-line mt-1"
                      >
                        Ver todos los resultados para &quot;{query}&quot;
                      </button>
                    </div>
                  ) : (
                    <p className="text-center py-8 text-sm text-brand-text-muted">
                      No encontramos resultados para &quot;{query}&quot;
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}