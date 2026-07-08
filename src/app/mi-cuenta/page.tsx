import { auth } from '@/auth';

export default async function MiCuentaPage() {
  const session = await auth();

  return (
    <div className="bg-brand-white border border-brand-beige-line p-6 max-w-md">
      <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-4">Datos Personales</h2>
      <div className="flex flex-col gap-3 text-sm">
        <div>
          <p className="text-xs text-brand-text-muted">Nombre</p>
          <p className="text-brand-text-dark">{session?.user?.name ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs text-brand-text-muted">Correo</p>
          <p className="text-brand-text-dark">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
}