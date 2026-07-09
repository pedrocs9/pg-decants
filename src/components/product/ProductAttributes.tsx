'use client';

import { useState } from 'react';

type AttributeItem = {
  name: string;
  icon: string;
  tooltip: string;
};

const familyIcons: Record<string, { icon: string; tooltip: string }> = {
  oriental:   { icon: '🕌', tooltip: 'Familia Oriental — cálido, especiado, amaderado' },
  floral:     { icon: '🌸', tooltip: 'Familia Floral — fresco, femenino, aromático' },
  amaderado:  { icon: '🌲', tooltip: 'Familia Amaderada — seco, terroso, sofisticado' },
  fresco:     { icon: '💧', tooltip: 'Familia Fresca — acuático, cítrico, limpio' },
  cítrico:    { icon: '🍋', tooltip: 'Familia Cítrica — energizante, vibrante' },
  gourmand:   { icon: '🍫', tooltip: 'Familia Gourmand — dulce, comestible, cálido' },
  aromático:  { icon: '🌿', tooltip: 'Familia Aromática — herbal, verde, masculino' },
  chipre:     { icon: '🌊', tooltip: 'Familia Chipre — musgo de roble, bergamota, terroso' },
  fougère:    { icon: '🌾', tooltip: 'Familia Fougère — lavanda, cumarina, amaderado' },
  'cuero':    { icon: '🟫', tooltip: 'Familia Cuero — animal, ahumado, intenso' },
};

const noteIcons: Record<string, string> = {
  'ámbar':     '🟡',
  'vainilla':  '🤎',
  'rosa':      '🌹',
  'jazmín':    '🌼',
  'sándalo':   '🪵',
  'cedro':     '🌲',
  'pachulí':   '🌿',
  'bergamota': '🍋',
  'lavanda':   '💜',
  'musgo':     '🍃',
  'almizcle':  '⚪',
  'incienso':  '🕯️',
  'oud':       '🪵',
  'neroli':    '🌸',
};

const seasonIcons: Record<string, { icon: string; tooltip: string }> = {
  primavera: { icon: '🌸', tooltip: 'Ideal para primavera — fresco y floral' },
  verano:    { icon: '☀️', tooltip: 'Ideal para verano — fresco y ligero' },
  otoño:     { icon: '🍂', tooltip: 'Ideal para otoño — cálido y especiado' },
  invierno:  { icon: '❄️', tooltip: 'Ideal para invierno — intenso y amaderado' },
};

function Chip({ icon, label, tooltip }: { icon: string; label: string; tooltip: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-beige-line bg-brand-cream text-xs text-brand-text-dark cursor-default hover:border-brand-gold transition-colors"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <span>{icon}</span>
        {label}
      </span>
      {show && tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-48 bg-brand-black text-brand-cream text-xs px-3 py-2 text-center pointer-events-none">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-black" />
        </div>
      )}
    </div>
  );
}

export function FamilyChips({ families }: { families: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {families.map((name) => {
        const key = name.toLowerCase();
        const meta = familyIcons[key] ?? { icon: '🌀', tooltip: `Familia ${name}` };
        return <Chip key={name} icon={meta.icon} label={name} tooltip={meta.tooltip} />;
      })}
    </div>
  );
}

export function NoteChips({ notes }: { notes: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {notes.map((name) => {
        const icon = noteIcons[name.toLowerCase()] ?? '✨';
        return <Chip key={name} icon={icon} label={name} tooltip={`Nota olfativa: ${name}`} />;
      })}
    </div>
  );
}

export function SeasonChips({ seasons }: { seasons: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {seasons.map((name) => {
        const key = name.toLowerCase();
        const meta = seasonIcons[key] ?? { icon: '📅', tooltip: `Temporada ${name}` };
        return <Chip key={name} icon={meta.icon} label={name} tooltip={meta.tooltip} />;
      })}
    </div>
  );
}