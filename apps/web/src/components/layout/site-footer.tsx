import Link from 'next/link';
import { DesignaliLogo } from './designali-logo';

const columns = [
  {
    title: 'About',
    links: [
      { href: '#', label: 'Works' },
      { href: '/graphic', label: 'Graphic' },
      { href: '/fonts', label: 'Fonts' },
      { href: '#', label: 'Agency' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '#', label: 'DIcons' },
      { href: '/explore?type=vector', label: 'Components' },
      { href: '#', label: 'Blogs' },
      { href: '/creators/demo', label: 'Designers' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/creator', label: 'Dashboard' },
      { href: '#', label: 'Contact' },
      { href: '#', label: 'Terms' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-border">
      <div className="container-wrapper !max-w-7xl py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 text-[#f50537]">
              <DesignaliLogo />
              <span className="font-semibold text-foreground">Dimaker</span>
            </Link>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted">
              I&apos;m creating designs for designers. Clean systems, beautiful interfaces, and
              thoughtful details — made for you.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Dimaker</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <a href="#" className="font-medium text-foreground/80 hover:text-foreground">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
