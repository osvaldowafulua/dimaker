'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { renderCanvas, ShineBorder, TypeWriter } from '@/components/ui/hero-designali';
import { Button } from '@/components/ui/button';

const TYPED_STRINGS = [
  'PSD mockups',
  'vector packs',
  'UI templates',
  'brand kits',
  'social graphics',
  'print design',
  'web assets',
];

export function HeroDesignali() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section id="home" className="relative overflow-hidden">
      <div
        className="absolute inset-0 max-md:hidden top-[320px] -z-10 h-[400px] w-full opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #57534e 1px, transparent 1px),
            linear-gradient(to bottom, #57534e 1px, transparent 1px)
          `,
          backgroundSize: '3rem 3rem',
        }}
      />

      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[550px] w-full max-w-[1512px] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(239,68,68,0.15), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 0%, rgba(99,102,241,0.12), transparent 50%)',
        }}
      />

      <div className="relative flex flex-col items-center justify-center px-6 text-center pb-8">
        <div className="mb-6 mt-6 sm:mt-10 md:mb-4">
          <div className="relative flex items-center rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-muted backdrop-blur-sm">
            Introducing Dimaker Elements.
            <Link
              href="/pricing"
              className="ml-1 flex items-center font-semibold text-foreground hover:text-accent transition-colors"
            >
              Explore
              <span aria-hidden className="ml-0.5">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="relative mx-auto border border-border/50 bg-surface/50 py-10 p-6 sm:py-12 [mask-image:radial-gradient(48rem_24rem_at_center,white,transparent)]">
            <h1 className="relative flex flex-col text-center text-4xl font-semibold leading-none tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <Plus
                strokeWidth={4}
                className="text-accent absolute -left-3 -top-3 sm:-left-5 sm:-top-5 h-6 w-6 sm:h-10 sm:w-10"
              />
              <Plus
                strokeWidth={4}
                className="text-accent absolute -bottom-3 -left-3 sm:-bottom-5 sm:-left-5 h-6 w-6 sm:h-10 sm:w-10"
              />
              <Plus
                strokeWidth={4}
                className="text-accent absolute -right-3 -top-3 sm:-right-5 sm:-top-5 h-6 w-6 sm:h-10 sm:w-10"
              />
              <Plus
                strokeWidth={4}
                className="text-accent absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 h-6 w-6 sm:h-10 sm:w-10"
              />
              <span>
                Your complete platform for the{' '}
                <span className="text-accent">Design.</span>
              </span>
            </h1>
            <div className="mt-4 flex items-center justify-center gap-1.5">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
              </span>
              <p className="text-xs text-accent-green font-medium">Marketplace live</p>
            </div>
          </div>

          <p className="mt-6 text-base sm:text-lg text-muted/90">
            Welcome to Dimaker — designs for designers.
          </p>
          <p className="mt-2 text-sm sm:text-base text-muted max-w-lg mx-auto">
            I craft visuals for brands and conjure resources to empower creators. Expert in{' '}
            <span className="text-indigo-400 font-semibold">
              <TypeWriter strings={TYPED_STRINGS} />
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pb-4 pt-6">
            <Link href="/creator">
              <ShineBorder
                borderWidth={3}
                className="border cursor-pointer h-auto w-auto p-2 bg-white/5 backdrop-blur-md dark:bg-black/5"
                color={['#ef4444', '#22c55e', '#6366f1']}
              >
                <Button className="w-full rounded-xl" size="lg">
                  Start posting
                </Button>
              </ShineBorder>
            </Link>
            <Link href="/pricing">
              <Button className="rounded-xl" variant="outline" size="lg">
                Book a call
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <canvas
        className="pointer-events-none absolute inset-0 mx-auto h-full w-full max-h-[700px]"
        id="canvas"
        aria-hidden
      />
    </section>
  );
}
