'use client';

import { useState } from 'react';
import { submitPerfumeRequest } from './actions';

export function PerfumeRequestForm() {
  const [form, setForm] = useState({ name: '', email: '', perfumeName: '', notes: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');

    const result = await submitPerfumeRequest(form);

    if (result.error) {
      setStatus('error');
      return;
    }

    setStatus('sent');
    setForm({ name: '', email: '', perfumeName: '', notes: '' });
  }

  if (status === 'sent') {
    return (
      <div className="bg-brand-white border border-brand-beige-line p-8 text-center">
        <p className="text-brand-text-dark font-medium mb-1">¡Solicitud recibida!</p>
        <p className="text-sm text-brand-text-muted">
          Te avisaremos apenas tengamos esa fragancia disponible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-brand-white border border-brand-beige-line p-6 sm:p-8 flex flex-col gap-4">
      <div>
        <label className="text-xs text-brand-text-muted block mb-1">Tu nombre</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-brand-text-muted block mb-1">Tu correo</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-brand-text-muted block mb-1">¿Qué perfume buscas?</label>
        <input
          type="text"
          required
          placeholder="Ej: Tom Ford Oud Wood"
          value={form.perfumeName}
          onChange={(e) => setForm({ ...form, perfumeName: e.target.value })}
          className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-brand-text-muted block mb-1">Notas adicionales (opcional)</label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600">Hubo un problema. Intenta de nuevo.</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-brand-black text-brand-cream py-3.5 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors cursor-pointer disabled:opacity-50"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar Solicitud'}
      </button>
    </form>
  );
}