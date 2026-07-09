'use client';

import { useState, useEffect } from 'react';

type TopBarMessage = {
  id: number;
  message: string;
};

export function TopBar({ messages }: { messages: TopBarMessage[] }) {
  const [current, setCurrent] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (messages.length === 0) return null;

  const goPrev = () => setCurrent((prev) => (prev - 1 + messages.length) % messages.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % messages.length);

  return (
    <div
      className={`fixed top-0 inset-x-0 z-50 bg-brand-cream text-brand-text-dark text-sm h-10 flex items-center justify-center px-12 border-b border-brand-beige-line transition-transform duration-300 ${
        scrolled ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
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