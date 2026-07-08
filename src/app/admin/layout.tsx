import Link from 'next/link';
import { AdminNav } from './AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-brand-cream">
      <aside className="w-64 bg-brand-black text-brand-cream flex-shrink-0 p-6 flex flex-col">
        <Link href="/" className="font-display italic text-xl block mb-8">
          P&G Decants
        </Link>
        <p className="text-xs uppercase tracking-wide text-brand-cream/50 mb-4">Panel Admin</p>
        <AdminNav />

        <div className="mt-auto pt-6 border-t border-brand-cream/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-brand-cream hover:bg-brand-cream/10 transition-colors rounded"
          >
            ← Volver a la Tienda
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}