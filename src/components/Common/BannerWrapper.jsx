'use client';

import { usePathname } from 'next/navigation';
// import HolidayBanner from './HolidayBanner/HolidayBanner';

export default function BannerWrapper({ initialVisible }) {
  const pathname = usePathname();
  const isAdminPage = pathname.includes('/admin');

  // Don't show banner on admin pages
  if (isAdminPage) {
    return null;
  }

  // return <HolidayBanner initialVisible={initialVisible} />;
}
