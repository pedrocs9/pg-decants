'use client';

import { useState } from 'react';
import { sendContactMessage } from './actions';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const result = await sendContactMessage(form);

    if (result.error) {
      setStatus('error');
      setErrorMsg(result.error);
      return;
    }

    setStatus('sent');
    setForm({ name: '', email: '', message: '' });
  }

  if (status === 'sent') {
    return (
      <div className="bg-brand-white border border-brand-beige-line p-8 text-center">
        <p className="text-brand-text-dark font-medium mb-1">¡Mensaje enviado!</p>
        <p className="text-sm text-brand-text-muted">Te responderemos lo antes posible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-brand-white border border-brand-beige-line p-6 sm:p-8 flex flex-col gap-4">
      <div>
        <label className="text-xs text-brand-text-muted block mb-1">Nombre</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-brand-text-muted block mb-1">Correo electrónico</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-brand-text-muted block mb-1">Mensaje</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors resize-none"
        />
      </div>

      {status === 'error' && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-brand-black text-brand-cream py-3.5 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors cursor-pointer disabled:opacity-50"
      >
        {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
      </button>
    </form>
  );
}