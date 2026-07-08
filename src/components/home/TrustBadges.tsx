import { PerfumeIcon, ShippingIcon, SecurePaymentIcon, HeartIcon, CartIcon } from '@/components/icons';

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge) => {
            const Icon = iconMap[badge.icon];
            return (
              <div key={badge.id} className="flex flex-col items-center text-center gap-2">
                <Icon className="w-7 h-7 text-brand-gold" />
                <p className="text-sm font-medium text-brand-text-dark">{badge.title}</p>
                {badge.subtitle && <p className="text-xs text-brand-text-muted">{badge.subtitle}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}