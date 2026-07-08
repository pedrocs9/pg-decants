'use client';

import { useState, useEffect } from 'react';
import {
  getTopBarMessages,
  createTopBarMessage,
  toggleTopBarMessage,
  deleteTopBarMessage,
  getBannerMessages,
  createBannerMessage,
  toggleBannerMessage,
  deleteBannerMessage,
} from './actions';

type Message = { id: number; message: string; displayOrder: number; isActive: boolean };

export default function MessagesPage() {
  const [topBar, setTopBar] = useState<Message[]>([]);
  const [banner, setBanner] = useState<Message[]>([]);
  const [topBarInput, setTopBarInput] = useState('');
  const [bannerInput, setBannerInput] = useState('');

  async function refresh() {
    setTopBar(await getTopBarMessages());
    setBanner(await getBannerMessages());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  async function handleAddTopBar(e: React.FormEvent) {
    e.preventDefault();
    await createTopBarMessage(topBarInput, topBar.length);
    setTopBarInput('');
    refresh();
  }

  async function handleAddBanner(e: React.FormEvent) {
    e.preventDefault();
    await createBannerMessage(bannerInput, banner.length);
    setBannerInput('');
    refresh();
  }

  return (
    <div className="max-w-2xl flex flex-col gap-10">
      <div>
        <h1 className="font-display italic text-3xl text-brand-text-dark mb-2">Home: Mensajes</h1>
        <p className="text-sm text-brand-text-muted">
          Administra los mensajes de la barra superior y el banner animado de la home.
        </p>
      </div>

      {/* TopBar */}
      <section>
        <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-3">Barra Superior (TopBar)</h2>
        <form onSubmit={handleAddTopBar} className="flex gap-3 mb-4">
          <input
            type="text"
            required
            value={topBarInput}
            onChange={(e) => setTopBarInput(e.target.value)}
            placeholder="Ej: Envío a todo Chile"
            className="flex-1 border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
          <button type="submit" className="bg-brand-gold text-brand-black px-5 py-2 text-sm font-medium hover:bg-brand-gold-dark hover:text-brand-cream transition-colors cursor-pointer">
            + Agregar
          </button>
        </form>

        <div className="bg-brand-white border border-brand-beige-line">
          {topBar.map((m) => (
            <MessageRow
              key={m.id}
              message={m}
              onToggle={async () => { await toggleTopBarMessage(m.id, !m.isActive); refresh(); }}
              onDelete={async () => { if (confirm('¿Eliminar?')) { await deleteTopBarMessage(m.id); refresh(); } }}
            />
          ))}
          {topBar.length === 0 && <p className="text-center py-6 text-brand-text-muted text-sm">Sin mensajes.</p>}
        </div>
      </section>

      {/* Animated Banner */}
      <section>
        <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-3">Banner Animado</h2>
        <form onSubmit={handleAddBanner} className="flex gap-3 mb-4">
          <input
            type="text"
            required
            value={bannerInput}
            onChange={(e) => setBannerInput(e.target.value)}
            placeholder="Ej: Despachamos a todo Chile"
            className="flex-1 border border-brand-beige-line px-3 py-2 text-sm outline-none focus:border-brand-gold"
          />
          <button type="submit" className="bg-brand-gold text-brand-black px-5 py-2 text-sm font-medium hover:bg-brand-gold-dark hover:text-brand-cream transition-colors cursor-pointer">
            + Agregar
          </button>
        </form>

        <div className="bg-brand-white border border-brand-beige-line">
          {banner.map((m) => (
            <MessageRow
              key={m.id}
              message={m}
              onToggle={async () => { await toggleBannerMessage(m.id, !m.isActive); refresh(); }}
              onDelete={async () => { if (confirm('¿Eliminar?')) { await deleteBannerMessage(m.id); refresh(); } }}
            />
          ))}
          {banner.length === 0 && <p className="text-center py-6 text-brand-text-muted text-sm">Sin mensajes.</p>}
        </div>
      </section>
    </div>
  );
}

function MessageRow({
  message,
  onToggle,
  onDelete,
}: {
  message: Message;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-brand-beige-line last:border-0">
      <span className="text-sm text-brand-text-dark">{message.message}</span>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
          <input type="checkbox" checked={message.isActive} onChange={onToggle} className="accent-brand-gold" />
          Activo
        </label>
        <button onClick={onDelete} className="text-red-600 text-xs hover:underline cursor-pointer">
          Eliminar
        </button>
      </div>
    </div>
  );
}