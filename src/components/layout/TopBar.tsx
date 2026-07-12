'use client';

import { useState, useEffect } from 'react';

type TopBarMessage = {
  id: number;
  message: string;
};

export function TopBar({ messages }: { messages: TopBarMessage[] }) {
  const [current, setCurrent] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (messages.length <= 1 || paused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length, paused]);

  useEffect(() => {
    function handleScroll() {
      const nextScrolled = window.scrollY > 12;
      setScrolled(nextScrolled);
      window.dispatchEvent(new CustomEvent('pg-header-scroll', { detail: nextScrolled }));
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (messages.length === 0) return null;

  const goPrev = () => setCurrent((prev) => (prev - 1 + messages.length) % messages.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % messages.length);

  return (
    <aside
      aria-label="Información de la tienda"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className={`fixed top-0 inset-x-0 z-50 bg-brand-cream text-brand-text-dark h-[var(--topbar-height)] flex items-center justify-center px-11 border-b border-brand-beige-line transition-transform duration-[var(--transition-standard)] motion-reduce:transition-none ${
        scrolled ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <button
        onClick={goPrev}
        aria-label="Mensaje anterior"
        className="absolute left-3 sm:left-5 grid h-8 w-8 place-items-center text-lg cursor-pointer hover:text-brand-gold-dark focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-gold-dark transition-colors"
      >
        ‹
      </button>

      <span key={messages[current].id} className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-center px-2 line-clamp-1 animate-[fade-in_0.35s_ease] motion-reduce:animate-none">
        {messages[current].message}
      </span>

      <button
        onClick={goNext}
        aria-label="Mensaje siguiente"
        className="absolute right-3 sm:right-5 grid h-8 w-8 place-items-center text-lg cursor-pointer hover:text-brand-gold-dark focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-gold-dark transition-colors"
      >
        ›
      </button>
    </aside>
  );
}
