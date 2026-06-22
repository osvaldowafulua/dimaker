'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'mockup', label: 'Mockups' },
  { id: 'psd', label: 'PSDs' },
  { id: 'vector', label: 'Vectors' },
  { id: 'template', label: 'Templates' },
  { id: 'ui-ux', label: 'UI/UX' },
  { id: 'branding', label: 'Branding' },
];

export function CategoryPills() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get('type') ?? '';

  const showOnHome = pathname === '/';
  const showOnExplore = pathname === '/explore';
  if (!showOnHome && !showOnExplore) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 px-4 py-6">
      {CATEGORIES.map((cat) => {
        const href = cat.id ? `/explore?type=${cat.id}` : '/explore';
        const isActive = active === cat.id;
        return (
          <Link
            key={cat.id || 'all'}
            href={href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-foreground text-surface'
                : 'bg-card border border-border text-muted hover:text-foreground hover:bg-elevated'
            }`}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
