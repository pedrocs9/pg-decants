type BannerMessage = {
  id: number;
  message: string;
};

export function AnimatedBanner({ messages }: { messages: BannerMessage[] }) {
  if (messages.length === 0) return null;

  // Duplicamos la lista para que el scroll infinito se vea continuo, sin salto
  const loopMessages = [...messages, ...messages];

  return (
    <aside aria-label="Novedades" className="group w-full bg-brand-gold-dark overflow-hidden border-y border-brand-black/10 py-2">
      <div className="flex animate-marquee-slow whitespace-nowrap group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {loopMessages.map((msg, index) => (
          <span
            key={`${msg.id}-${index}`}
            className="text-brand-cream text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase flex items-center px-6"
          >
            {msg.message}
            <span aria-hidden="true" className="mx-6 text-brand-cream/45">•</span>
          </span>
        ))}
      </div>
    </aside>
  );
}
