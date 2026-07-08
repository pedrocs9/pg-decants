type BannerMessage = {
  id: number;
  message: string;
};

export function AnimatedBanner({ messages }: { messages: BannerMessage[] }) {
  if (messages.length === 0) return null;

  // Duplicamos la lista para que el scroll infinito se vea continuo, sin salto
  const loopMessages = [...messages, ...messages];

  return (
    <div className="w-full bg-brand-gold overflow-hidden py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {loopMessages.map((msg, index) => (
          <span
            key={`${msg.id}-${index}`}
            className="text-brand-black text-sm font-medium tracking-wide uppercase flex items-center px-8"
          >
            {msg.message}
            <span className="mx-8 text-brand-black/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}