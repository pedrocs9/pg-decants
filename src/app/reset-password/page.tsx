'use client';

import { useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from './actions';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');

    const result = await requestPasswordReset(email);

    if (result.error) {
      setStatus('error');
      setErrorMsg(result.error);
      return;
    }

    setStatus('sent');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8">
          <h1 className="font-display italic text-3xl text-brand-text-dark">P&G Decants</h1>
        </Link>

        <div className="bg-brand-white p-8 border border-brand-beige-line">
          <h2 className="font-display italic text-2xl text-brand-text-dark mb-2 text-center">
            Recuperar Contraseña
          </h2>

          {status === 'sent' ? (
            <div className="text-center py-4">
              <p className="text-sm text-brand-text-dark mb-2">Revisa tu correo</p>
              <p className="text-sm text-brand-text-muted">
                Si existe una cuenta con ese correo, te enviamos un enlace para restablecer tu contraseña.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-brand-text-muted text-center mb-6">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
                />

                {status === 'error' && <p className="text-sm text-red-600">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-brand-black text-brand-cream py-3 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors cursor-pointer disabled:opacity-50"
                >
                  {status === 'sending' ? 'Enviando...' : 'Enviar Enlace'}
                </button>
              </form>
            </>
          )}

          <p className="text-sm text-brand-text-muted text-center mt-6">
            <Link href="/login" className="text-brand-gold-dark hover:underline">
              Volver a Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}