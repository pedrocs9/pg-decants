'use client';

import { PerfumeIcon, ShippingIcon, SecurePaymentIcon, HeartIcon, CartIcon } from '@/components/icons';
import { AnimateIn } from '@/components/ui/AnimateIn';

const iconMap = {
  perfume: PerfumeIcon,
  shipping: ShippingIcon,
  securePayment: SecurePaymentIcon,
  heart: HeartIcon,
  cart: CartIcon,
};

type Badge = {
  id: number;
  icon: keyof typeof iconMap;
  title: string;
  subtitle: string | null;
};

export function TrustBadges({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) return null;

  return (
    <section className="border-y border-brand-beige-line bg-brand-white">
      <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="grid grid-cols-2 gap-y-1 md:grid-cols-4 md:divide-x md:divide-brand-beige-line">
          {badges.map((badge, i) => {
            const Icon = iconMap[badge.icon];
            return (
              <AnimateIn key={badge.id} delay={i * 70} animation="fade-in">
                <div className="group flex items-center text-left gap-3 px-3 sm:px-5 py-3 cursor-default">
                  <div className="flex shrink-0 items-center justify-center w-9 h-9 border border-brand-beige-line bg-brand-cream transition-colors duration-300 group-hover:border-brand-gold">
                    <Icon className="w-[18px] h-[18px] text-brand-gold-dark transition-colors duration-300 group-hover:text-brand-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] text-brand-text-dark leading-tight">{badge.title}</p>
                    {badge.subtitle && <p className="text-[10px] sm:text-[11px] text-brand-text-muted mt-1 leading-snug line-clamp-2">{badge.subtitle}</p>}
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
