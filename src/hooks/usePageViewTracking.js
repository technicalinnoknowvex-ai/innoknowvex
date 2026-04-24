'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageViewTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Get page title
    const pageTitle = document.title || pathname;

    // Track page view with custom data
    if (window.fbq) {
      window.fbq('track', 'PageView', {
        page_path: pathname,
        page_title: pageTitle,
      });

      // Console log for debugging
      console.log('📊 Pixel Tracked - Page:', pathname, 'Title:', pageTitle);
    }
  }, [pathname]);
}
