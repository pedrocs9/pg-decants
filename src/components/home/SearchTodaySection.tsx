import Link from 'next/link';
import Image from 'next/image';
import { SearchIcon, ArrowIcon } from '@/components/icons';

const categories = [
  {
    label: 'Árabe',
    href: '/decants?tipo=arabe',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80',
  },
  {
    label: 'Diseñador',
    href: '/decants?tipo=diseñador',
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80',
  },
  {
    label: 'Nicho',
    href: '/decants?tipo=nicho',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
  },
  {
    label: 'Ver Todo',
    href: '/decants',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
  },
];

export function SearchTodaySection() {
  return (
    <section className="w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="font-display italic text-3xl sm:text-4xl text-brand-text-dark flex items-center gap-3 mb-8">
        ¿Qué buscas hoy?
        <SearchIcon className="w-6 h-6 text-brand-gold" />
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
         <Link
            key={cat.label}
            href={cat.href}
            className="group relative block w-full h-48 sm:h-64 lg:h-72 overflow-hidden"
          >
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-brand-black/35 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 bg-brand-cream px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium tracking-wide text-brand-text-dark uppercase">
                {cat.label}
              </span>
              {cat.label !== 'Ver Todo' && (
                <ArrowIcon className="w-4 h-4 text-brand-gold-dark" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}