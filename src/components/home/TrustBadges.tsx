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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-brand-beige-line">
          {badges.map((badge, i) => {
            const Icon = iconMap[badge.icon];
            return (
              <AnimateIn key={badge.id} delay={i * 100} animation="pop">
                <div className="group flex flex-col items-center text-center gap-3 px-4 py-2 transition-transform duration-300 hover:-translate-y-1 cursor-default">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full border border-brand-beige-line bg-brand-cream transition-all duration-300 group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:shadow-lg group-hover:shadow-brand-gold/30">
                    <Icon className="w-6 h-6 text-brand-gold transition-colors duration-300 group-hover:text-brand-black" />
                  </div>
                  <p className="text-sm font-medium text-brand-text-dark">{badge.title}</p>
                  {badge.subtitle && (
                    <p className="text-xs text-brand-text-muted">{badge.subtitle}</p>
                  )}
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}