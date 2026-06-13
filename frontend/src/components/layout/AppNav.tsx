'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../exam/Logo';

export function AppNav() {
  const pathname = usePathname();

  // Hide on exam taking, result, and attempt detail pages.
  // They have their own dedicated headers.
  if (
    pathname.startsWith('/exam/') ||
    pathname.startsWith('/attempts/')
  ) {
    return null;
  }

  const links = [
    { href: '/', label: 'Đề thi', aliases: ['/exams'] },
    { href: '/analytics', label: 'Phân tích' },
    { href: '/history', label: 'Lịch sử' },
    { href: '/profile', label: 'Hồ sơ' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
        <Link href="/" className="group flex shrink-0 items-center gap-2" aria-label="ManMath Home">
          <Logo className="h-6 w-6 transition-transform group-hover:scale-105" />
          <span className="font-[family-name:var(--font-outfit)] font-bold text-text-primary transition-colors group-hover:text-primary">
            ManMath
          </span>
        </Link>
        
        <div className="flex shrink-0 items-center gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href || link.aliases?.includes(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
