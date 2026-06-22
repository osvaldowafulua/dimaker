import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
            D
          </span>
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Any questions about design?
            </h2>
            <p className="text-muted mt-2 text-sm">Feel free to reach out to us!</p>
          </div>
        </div>
        <Link
          href="/creator"
          className="shrink-0 w-full sm:w-auto text-center rounded-full bg-foreground text-surface font-medium text-sm px-8 py-3 hover:opacity-90 transition-opacity"
        >
          Book a call
        </Link>
      </div>
    </section>
  );
}
