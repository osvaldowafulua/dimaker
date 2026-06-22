import Link from 'next/link';
import { cn } from '@/lib/utils';

export function ShineButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative inline-grid place-items-center rounded-3xl border bg-white/5 p-2 backdrop-blur-md dark:bg-black/5',
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-80 animate-shine-pulse bg-[radial-gradient(transparent,transparent,#FF007F,#39FF14,#00FFFF,transparent,transparent)] bg-shine-size"
      />
      <span className="relative inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 [&_svg]:size-4">
        {children}
      </span>
    </Link>
  );
}
