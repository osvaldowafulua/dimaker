import { cn } from '@/lib/utils';

/** Designali-style page panel: container + rounded top card */
export function MarketingPageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('pb-16', className)}>
      <div className="container-wrapper mt-4 rounded-t-3xl border border-b-0 p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
}

export function MarketingHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="grid justify-center px-2 pb-2 text-center sm:px-4">
      <p className="text-ali mt-6 text-center text-xl sm:mt-10">{eyebrow}</p>
      <h1 className="z-20 justify-center py-3 text-center text-4xl font-bold tracking-tighter md:text-7xl">
        {title}
      </h1>
      <p className="mx-auto max-w-xl text-center text-xs text-muted sm:text-sm">{description}</p>
      {actions && (
        <div className="flex flex-wrap items-center justify-center gap-2 py-6 sm:py-10">
          {actions}
        </div>
      )}
    </div>
  );
}
