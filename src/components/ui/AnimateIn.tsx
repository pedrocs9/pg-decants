'use client';

import { useInView } from '@/hooks/useInView';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-up' | 'fade-in' | 'pop';
};

export function AnimateIn({ children, className = '', delay = 0, animation = 'fade-up' }: Props) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? undefined : 0,
        animation: inView
          ? `${animation} 0.6s ease ${delay}ms both`
          : 'none',
      }}
    >
      {children}
    </div>
  );
}