'use client';

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };

  return (
    <div className={`flex gap-0.5 ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} ${
            star <= value ? 'text-brand-gold' : 'text-brand-beige-line'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}