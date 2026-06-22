'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/graphic', label: 'Graphics', exact: true },
  { href: '/graphic/inspirations', label: 'Inspirations' },
  { href: '/graphic/ads', label: 'Ads' },
  { href: '/graphic/svg-icons', label: 'SVG Icons' },
  {
    href: '/graphic/designers',
    label: 'Designers',
    count: '116',
    badge: 'New',
  },
  { href: '/graphic/stock-images', label: 'Stock Images' },
  { href: '/graphic/logos', label: 'Logos' },
  { href: '/graphic/tools', label: 'Tools' },
] as const;

const tabTriggerClass =
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export function GraphicMainTabs() {
  const pathname = usePathname();

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className="inline-flex h-10 max-w-full items-center justify-center overflow-x-auto scrollbar-hide rounded-md bg-muted-surface p-1 text-muted w-full md:w-auto"
    >
      <div className="flex space-x-2">
        {TABS.map((tab) => {
          const active =
            'exact' in tab && tab.exact
              ? pathname === tab.href
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              role="tab"
              aria-selected={active}
              className={cn(
                tabTriggerClass,
                active
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted hover:text-foreground',
              )}
            >
              {tab.label}
              {'count' in tab && tab.count && (
                <span className="text-ali ml-1 font-medium">{tab.count}</span>
              )}
              {'badge' in tab && tab.badge && (
                <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs font-normal leading-none text-black">
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
