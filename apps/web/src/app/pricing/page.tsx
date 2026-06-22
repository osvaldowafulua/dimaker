import Link from 'next/link';
import { apiGet } from '@/lib/api';

type Plan = {
  code: string;
  name: string;
  monthly_download_quota: number;
  price_cents: number;
};

export default async function PricingPage() {
  let plans: Plan[] = [];
  try {
    plans = await apiGet<Plan[]>('/subscriptions/plans');
  } catch {
    plans = [];
  }

  return (
    <main className="pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 text-center">
        <p className="text-sm text-muted">Dimaker Elements</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">
          Design without limits.
        </h1>
        <p className="text-muted mt-4 max-w-lg mx-auto text-sm">
          Monthly download credits for mockups, PSDs, and templates — one
          subscription, commercial licensing included.
        </p>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-14 grid gap-4 sm:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.code}
            className="rounded-2xl border border-border bg-card p-8 shadow-card"
          >
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="mt-6 text-4xl font-semibold tracking-tight">
              ${(p.price_cents / 100).toFixed(0)}
              <span className="text-base font-normal text-muted">/mo</span>
            </p>
            <p className="text-sm text-muted mt-3">
              {p.monthly_download_quota} downloads per month
            </p>
            <Link
              href="/creator"
              className="mt-8 inline-flex w-full justify-center rounded-full bg-foreground text-surface font-medium text-sm py-3 hover:opacity-90 transition-opacity"
            >
              Subscribe
            </Link>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <p className="text-center text-muted text-sm mt-12">
          Run <code className="text-foreground">pnpm db:seed</code> to load plans.
        </p>
      )}
    </main>
  );
}
