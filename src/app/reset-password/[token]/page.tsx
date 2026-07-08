'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { validateResetToken, resetPassword } from '../actions';

export default function ResetPasswordTokenPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function check() {
      const result = await validateResetToken(token);
      setValid(result.valid);
      setChecking(false);
    }
    check();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setStatus('saving');
    const result = await resetPassword(token, password);

    if (result.error) {
      setStatus('error');
      setErrorMsg(result.error);
      return;
    }

    router.push('/login');
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-cream">
        <p className="text-brand-text-muted">Verificando enlace...</p>
      </main>
    );
  }

  if (!valid) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display italic text-2xl text-brand-text-dark mb-3">
            Enlace Inválido o Expirado
          </h1>
          <p className="text-sm text-brand-text-muted mb-6">
            Este enlace ya no es válido. Solicita uno nuevo.
          </p>
          <Link href="/reset-password" className="text-brand-gold-dark hover:underline text-sm">
            Solicitar Nuevo Enlace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8">
          <h1 className="font-display italic text-3xl text-brand-text-dark">P&G Decants</h1>
        </Link>

        <div className="bg-brand-white p-8 border border-brand-beige-line">
          <h2 className="font-display italic text-2xl text-brand-text-dark mb-6 text-center">
            Nueva Contraseña
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
            />
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
            />

            {status === 'error' && <p className="text-sm text-red-600">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === 'saving'}
              className="w-full bg-brand-black text-brand-cream py-3 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors cursor-pointer disabled:opacity-50"
            >
              {status === 'saving' ? 'Guardando...' : 'Guardar Nueva Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}