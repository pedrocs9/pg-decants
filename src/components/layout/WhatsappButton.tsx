'use client';

import { WhatsappIcon } from '@/components/icons';

export function WhatsappButton() {
  const phoneNumber = '56923736983';
  const message = encodeURIComponent('Hola, tengo una consulta sobre P&G Decants ');

   return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-6 right-6 z-30 group"
    >
     <div className="w-14 h-14 bg-brand-black hover:bg-brand-text-dark rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-brand-gold/40 ring-4 ring-brand-cream/10">
        <WhatsappIcon className="w-6 h-6 text-brand-gold" />
      </div>

      <span className="hidden sm:block absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-brand-black text-brand-cream text-xs px-3 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Escríbenos
      </span>
     </a>
  );
}