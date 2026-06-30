'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

const ROOT_PATHS = new Set(['/', '/dashboard', '/login']);

export default function AndroidBackButtonHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let isMounted = true;
    let removeListener: (() => void) | undefined;

    App.addListener('backButton', ({ canGoBack }) => {
      const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

      if (canGoBack && !ROOT_PATHS.has(currentPath)) {
        router.back();
        return;
      }

      App.exitApp();
    }).then((handle) => {
      if (!isMounted) {
        handle.remove();
        return;
      }

      removeListener = () => {
        handle.remove();
      };
    });

    return () => {
      isMounted = false;
      removeListener?.();
    };
  }, [router, pathname]);

  return null;
}
