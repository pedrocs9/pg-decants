'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError('');
    setLoading(true);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8">
          <h1 className="font-display italic text-3xl text-brand-text-dark">P&G Decants</h1>
        </Link>

        <div className="bg-brand-white p-8 border border-brand-beige-line">
          <h2 className="font-display italic text-2xl text-brand-text-dark mb-6 text-center">
            Iniciar Sesión
          </h2>

          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 border border-brand-beige-line py-3 text-sm font-medium text-brand-text-dark hover:bg-brand-cream transition-colors cursor-pointer mb-6"
          >
            <GoogleIcon />
            Continuar con Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-brand-beige-line" />
            <span className="text-xs text-brand-text-muted uppercase">o</span>
            <div className="flex-1 h-px bg-brand-beige-line" />
          </div>

          <form action={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-brand-text-muted block mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
              />
            </div>

              <div>
              <label className="text-xs uppercase tracking-wide text-brand-text-muted block mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
              />
              <Link href="/reset-password" className="text-xs text-brand-gold-dark hover:underline block mt-1.5 text-right">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-black text-brand-cream py-3 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-sm text-brand-text-muted text-center mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-brand-gold-dark hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96C.35 6.18 0 7.55 0 9s.35 2.82.96 4.04l2.99-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.99 2.33C4.66 5.16 6.65 3.58 9 3.58z" />
    </svg>
  );
}