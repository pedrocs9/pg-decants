import { db } from '@/db';
import { perfumeRequests } from '@/db/schema';
import { desc } from 'drizzle-orm';

export default async function SolicitudesPage() {
  const requests = await db.select().from(perfumeRequests).orderBy(desc(perfumeRequests.createdAt));

  return (
    <div>
      <h1 className="font-display italic text-3xl text-brand-text-dark mb-8">Solicitudes de Perfumes</h1>

      <div className="bg-brand-white border border-brand-beige-line">
        {requests.map((r) => (
          <div key={r.id} className="px-4 py-4 border-b border-brand-beige-line last:border-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-brand-text-dark font-medium">{r.perfumeName}</p>
              <p className="text-xs text-brand-text-muted">
                {new Date(r.createdAt).toLocaleDateString('es-CL')}
              </p>
            </div>
            <p className="text-xs text-brand-text-muted">{r.name} · {r.email}</p>
            {r.notes && <p className="text-sm text-brand-text-muted mt-1">{r.notes}</p>}
          </div>
        ))}
        {requests.length === 0 && <p className="text-center py-12 text-brand-text-muted">Sin solicitudes todavía.</p>}
      </div>
    </div>
  );
}