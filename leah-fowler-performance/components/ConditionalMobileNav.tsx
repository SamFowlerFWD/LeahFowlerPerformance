'use client';

import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';

export default function ConditionalMobileNav() {
  const pathname = usePathname();

  // Don't render MobileNav on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <MobileNav />;
}