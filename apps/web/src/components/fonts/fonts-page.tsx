'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  Download,
  Eye,
  RotateCcw,
  Search,
  Share2,
  Upload,
} from 'lucide-react';
import { FONTS, FONT_TAG_FILTERS, type FontRecord } from '@/data/fonts';
import { MarketingHero, MarketingPageShell } from '@/components/layout/marketing-page-shell';
import { ShineButton } from '@/components/ui/shine-button';
import { cn } from '@/lib/utils';

const DEFAULT_PREVIEW = 'The quick brown fox jumps over the lazy dog.';

type Align = 'left' | 'center' | 'justify';
type Sort = 'newest' | 'popular' | 'name';

const TAG_OPTIONS = ['Select tag', 'Modern', 'Display', 'Serif', 'Basic'] as const;

function googleFontHref(font: FontRecord) {
  if (font.googleWeights) {
    return `https://fonts.googleapis.com/css2?family=${font.googleFamily}:${font.googleWeights}&display=swap`;
  }
  return `https://fonts.googleapis.com/css2?family=${font.googleFamily}&display=swap`;
}

function googleFontFamily(font: FontRecord) {
  return font.googleFamily.replace(/\+/g, ' ');
}

function useGoogleFonts(fonts: FontRecord[]) {
  useEffect(() => {
    const hrefs = [...new Set(fonts.map(googleFontHref))];
    const nodes = hrefs.map((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      return link;
    });
    return () => nodes.forEach((n) => n.remove());
  }, [fonts]);
}

function FontCard({
  font,
  previewText,
  fontSize,
  letterSpacing,
  align,
  showFontName,
}: {
  font: FontRecord;
  previewText: string;
  fontSize: number;
  letterSpacing: number;
  align: Align;
  showFontName: boolean;
}) {
  const displayText = showFontName ? font.name : previewText || DEFAULT_PREVIEW;
  const fontFamily = `"${googleFontFamily(font)}", sans-serif`;

  return (
    <article className="group overflow-hidden rounded-sm border border-border bg-card text-card-foreground shadow-sm">
      <Link
        href={`/fonts#${font.id}`}
        className="flex items-center min-h-[180px] px-6 sm:px-10 py-12 sm:py-14 bg-surface hover:bg-black/80 transition-colors"
      >
        <p
          className="w-full text-white leading-[1.05] break-words"
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing}px`,
            textAlign: align,
          }}
        >
          {displayText}
        </p>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 bg-elevated">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 min-w-0">
          <h3 className="font-semibold text-[15px] text-foreground">{font.name}</h3>
          <span className="text-xs text-muted capitalize">{font.category}</span>
          <span aria-hidden className="text-muted/40 text-xs">•</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Eye className="h-3 w-3" />
            {font.views}
          </span>
          <span aria-hidden className="text-muted/40 text-xs">•</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Download className="h-3 w-3" />
            {font.downloads}
          </span>
          <div className="flex flex-wrap gap-1.5 ml-1">
            {font.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] rounded-md bg-card px-2 py-0.5 text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors"
        >
          <Download className="h-4 w-4" />
          Download Font
        </button>
      </div>
    </article>
  );
}

export function FontsPage() {
  useGoogleFonts(FONTS);

  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW);
  const [fontSize, setFontSize] = useState(50);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [showFontName, setShowFontName] = useState(false);
  const [align, setAlign] = useState<Align>('left');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All Categories');
  const [tag, setTag] = useState<string>('Select tag');
  const [sort, setSort] = useState<Sort>('newest');

  const filtered = useMemo(() => {
    let list = [...FONTS];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.includes(q) ||
          f.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (category !== 'All Categories') {
      if (category === 'Script') {
        list = list.filter((f) => f.category === 'script');
      } else {
        list = list.filter((f) => f.tags.includes(category));
      }
    }
    if (tag !== 'Select tag') {
      list = list.filter((f) => f.tags.includes(tag));
    }
    if (sort === 'popular') {
      list.sort((a, b) => b.views - a.views);
    } else if (sort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [search, category, tag, sort]);

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Explore Unique & Custom Fonts"
        title={
          <>
            <span className="text-ali">Typography </span>
            <span className="text-foreground">Built for Designers.</span>
          </>
        }
        description="Discover beautifully crafted typefaces for every creative project — from modern displays to vintage-inspired lettering."
        actions={
          <>
            <ShineButton href="/creator">
              <Upload className="h-4 w-4" />
              Upload Your Font/Login
            </ShineButton>
            <Link
              href="mailto:support@dimaker.com?subject=Share%20a%20font"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-highlight hover:text-highlight-foreground"
            >
              <Share2 className="h-5 w-5" />
              Share Your Font
            </Link>
          </>
        }
      />

      <div className="mt-4 space-y-4 rounded-lg border border-border/60 bg-muted-surface/30 p-4 sm:p-5">
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            placeholder="Type to preview fonts..."
            className="flex h-12 w-full rounded-lg border border-input bg-background px-5 py-3 text-base placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
          />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 flex-1 min-w-0">
              <label className="flex items-center gap-3 text-sm text-muted whitespace-nowrap">
                <span className="text-foreground font-medium">Font Size:</span>
                <span className="tabular-nums text-foreground w-12 text-center">{fontSize}px</span>
                <input
                  type="range"
                  min={16}
                  max={120}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full max-w-[180px] accent-accent h-1.5"
                />
              </label>
              <label className="flex items-center gap-3 text-sm text-muted whitespace-nowrap">
                <span className="text-foreground font-medium">Letter Spacing:</span>
                <span className="tabular-nums text-foreground w-10 text-center">{letterSpacing}px</span>
                <input
                  type="range"
                  min={-2}
                  max={20}
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full max-w-[180px] accent-accent h-1.5"
                />
              </label>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm text-muted select-none">
                <button
                  type="button"
                  role="switch"
                  aria-checked={showFontName}
                  onClick={() => setShowFontName(!showFontName)}
                  className={cn(
                    'relative h-5 w-9 rounded-full transition-colors shrink-0',
                    showFontName ? 'bg-accent' : 'bg-border',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm',
                      showFontName && 'translate-x-4',
                    )}
                  />
                </button>
                Switch to Font Name
              </label>

              <fieldset className="flex items-center rounded-xl border border-border bg-surface/80 p-1">
                <legend className="sr-only">Text alignment</legend>
                {(
                  [
                    { id: 'left' as Align, icon: AlignLeft, label: 'Align Left' },
                    { id: 'center' as Align, icon: AlignCenter, label: 'Align Center' },
                    { id: 'justify' as Align, icon: AlignJustify, label: 'Align Justify' },
                  ] as const
                ).map(({ id, icon: Icon, label }) => (
                  <label
                    key={id}
                    title={label}
                    className={cn(
                      'cursor-pointer rounded-lg p-1.5 transition-colors has-[:checked]:bg-elevated has-[:checked]:text-foreground text-muted hover:text-foreground',
                    )}
                  >
                    <input
                      type="radio"
                      name="font-align"
                      value={id}
                      checked={align === id}
                      onChange={() => setAlign(id)}
                      className="sr-only"
                    />
                    <Icon className="h-4 w-4" />
                  </label>
                ))}
              </fieldset>

              <button
                type="button"
                onClick={() => {
                  setPreviewText(DEFAULT_PREVIEW);
                  setFontSize(50);
                  setLetterSpacing(0);
                  setAlign('left');
                  setShowFontName(false);
                }}
                title="Reset preview"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface/80 text-muted hover:text-foreground hover:bg-elevated transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fonts..."
            className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {FONT_TAG_FILTERS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {TAG_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="h-10 rounded-md border border-dotted border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:ml-auto"
        >
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="name">Name</option>
        </select>
      </div>

      <section className="mt-8 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-muted py-16 text-sm">No fonts match your filters.</p>
        ) : (
          filtered.map((font) => (
            <FontCard
              key={font.id}
              font={font}
              previewText={previewText}
              fontSize={fontSize}
              letterSpacing={letterSpacing}
              align={align}
              showFontName={showFontName}
            />
          ))
        )}
      </section>
    </MarketingPageShell>
  );
}
