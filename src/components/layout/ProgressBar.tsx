'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.15 });

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercepta todos los clicks en links internos para iniciar la barra al instante
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a');
      if (
        target &&
        target.href &&
        target.origin === window.location.origin &&
        !target.hasAttribute('target') &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        NProgress.start();
      }
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}