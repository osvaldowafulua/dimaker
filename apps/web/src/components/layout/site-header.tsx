'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Equal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DesignaliLogo } from './designali-logo';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

const brandMenu = [
  { href: '/', label: 'Home' },
  { href: '#', label: 'About' },
  { href: '/explore', label: 'Works' },
  { href: '/graphic', label: 'Graphic' },
  { href: '/fonts', label: 'Fonts' },
  { href: '#', label: 'Agency' },
  { href: '#', label: 'DIcons' },
  { href: '/explore?type=vector', label: 'Components' },
  { href: '#', label: 'Blogs' },
  { href: '/creators/demo', label: 'Designers' },
  { href: '/creator', label: 'Dashboard' },
  { href: '#', label: 'Contact' },
  { href: '#', label: 'Terms' },
];

const navLinks = [
  { href: '/fonts', label: 'Fonts', badge: 'New' as const },
  { href: '/graphic', label: 'Graphic', badge: 'New' as const },
  { href: '/explore?type=vector', label: 'Components' },
];

function NavBadge() {
  return (
    <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs font-normal leading-none text-black">
      New
    </span>
  );
}

function isNavActive(href: string, pathname: string) {
  if (href === '/fonts') return pathname.startsWith('/fonts');
  if (href === '/graphic') return pathname === '/graphic' || pathname.startsWith('/graphic/');
  const base = href.split('?')[0];
  return pathname === href || pathname.startsWith(`${base}/`);
}

function NavLink({
  href,
  label,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  badge?: 'New';
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isNavActive(href, pathname);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'group inline-flex h-8 w-max items-center rounded-full px-4 py-2 text-sm transition-colors',
        'text-foreground/60 hover:text-foreground',
        active && 'bg-highlight text-foreground',
      )}
    >
      {label}
      {badge && <NavBadge />}
    </Link>
  );
}

export function SiteHeader() {
  const [brandOpen, setBrandOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const brandRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setBrandOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-1 origin-left bg-gradient-to-r from-[#a5ff1d] via-[#0026ff] to-[#ff0000]"
        aria-hidden
      />
      <header className="sticky top-2 z-50 px-2 sm:px-4">
        <nav
          aria-label="Main"
          className="container-wrapper glass-nav !max-w-7xl"
        >
          <div className="flex h-14 items-center justify-between gap-2 px-1 sm:px-2">
            <div className="flex min-w-0 flex-1 items-center">
              <Link
                href="/"
                aria-label="Logo"
                className="flex shrink-0 items-center gap-2 pl-2 font-semibold text-[#f50537] sm:pl-3"
              >
                <DesignaliLogo />
              </Link>

              <div className="hidden md:block pl-1">
                <ul className="flex list-none items-center space-x-1">
                  <li ref={brandRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setBrandOpen(!brandOpen)}
                      className={cn(
                        'group inline-flex h-8 w-max items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors',
                        'text-foreground/60 hover:text-foreground',
                        brandOpen && 'bg-highlight text-foreground',
                      )}
                      aria-expanded={brandOpen}
                    >
                      Dimaker
                    </button>
                    {brandOpen && (
                      <div className="absolute left-0 top-full z-50 mt-2 min-w-[180px] rounded-xl border border-white/10 bg-stone-900/95 p-1.5 shadow-xl backdrop-blur-md">
                        {brandMenu.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setBrandOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-white/10 hover:text-foreground"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                  {navLinks.map((item) => (
                    <li key={item.href}>
                      <NavLink {...item} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-white/10 md:hidden"
                aria-label="Open menu"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <Equal className="h-5 w-5" />
              </button>
              <div className="hidden md:block">
                <Link href="/creator">
                  <span className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                    Sign In
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {mobileOpen && (
            <div className="border-t border-white/10 px-3 py-3 md:hidden">
              <ul className="flex flex-col gap-1">
                {brandMenu.slice(0, 6).map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-white/10"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <NavLink {...item} onNavigate={() => setMobileOpen(false)} />
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    href="/creator"
                    className="flex h-9 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
