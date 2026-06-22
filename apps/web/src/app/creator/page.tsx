import Link from 'next/link';

export default function CreatorPage() {
  return (
    <main className="pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-20 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Start posting</h1>
        <p className="text-muted mt-4 text-sm leading-relaxed">
          Create a creator profile, upload PSDs and mockups, and earn with Stripe
          Connect. Sign in via the API to get started.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/explore"
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-elevated"
          >
            Browse marketplace
          </Link>
          <Link
            href="/pricing"
            className="rounded-full bg-foreground text-surface px-6 py-3 text-sm font-medium hover:opacity-90"
          >
            View Elements plans
          </Link>
        </div>
      </div>
    </main>
  );
}
