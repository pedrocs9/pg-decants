'use client';

import { useState, useEffect } from 'react';

type TopBarMessage = {
  id: number;
  message: string;
};

export function TopBar({ messages }: { messages: TopBarMessage[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  if (messages.length === 0) return null;

  const goPrev = () => setCurrent((prev) => (prev - 1 + messages.length) % messages.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % messages.length);

 return (
    <div className="relative bg-brand-cream text-brand-text-dark text-sm py-2 px-12 flex items-center justify-center border-b border-brand-beige-line">
      <button
        onClick={goPrev}
        aria-label="Mensaje anterior"
        className="absolute left-4 cursor-pointer hover:text-brand-gold-dark transition-colors"
      >
        ‹
      </button>

      <span className="font-body text-center px-2">{messages[current].message}</span>

      <button
        onClick={goNext}
        aria-label="Mensaje siguiente"
        className="absolute right-4 cursor-pointer hover:text-brand-gold-dark transition-colors"
      >
        ›
      </button>
    </div>
  );
}