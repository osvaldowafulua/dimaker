import { HeroDesignali } from '@/components/home/hero-designali';
import { GraphicsGalleryStrip } from '@/components/marketplace/graphics-gallery-strip';
import { FontShowcaseCard } from '@/components/marketplace/font-showcase-card';
import { ProductResourceList } from '@/components/marketplace/product-resource-list';
import { ImageMosaic } from '@/components/home/image-mosaic';
import { SectionDownloadCta } from '@/components/home/section-download-cta';
import { CtaSection } from '@/components/home/cta-section';
import { apiGet } from '@/lib/api';

type Asset = {
  id: string;
  title: string;
  slug: string;
  creator_handle: string;
  asset_type: string;
  view_count?: number;
};

async function fetchAssets(limit = 32) {
  try {
    return await apiGet<Asset[]>(`/assets?limit=${limit}`, 60);
  } catch {
    return [];
  }
}

const TAG_SETS = [
  ['Modern', 'Display'],
  ['Sans serif', 'UI'],
  ['Commercial', 'PSD'],
  ['Branding', 'Vector'],
];

export default async function HomePage() {
  const assets = await fetchAssets(32);
  const strip = assets.slice(0, 12);
  const showcases = assets.slice(0, 4);
  const resources = assets.slice(4, 12).map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    creator_handle: a.creator_handle,
    views: Number(a.view_count) || undefined,
  }));

  return (
    <main className="pb-4">
      <HeroDesignali />

      <p className="text-center text-sm text-muted -mt-2 mb-2 px-4">
        Design without limits. Loved by designers.
      </p>

      <GraphicsGalleryStrip assets={strip} />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-4">
        {showcases.map((asset, i) => (
          <FontShowcaseCard
            key={asset.id}
            {...asset}
            index={i}
            views={Number(asset.view_count) || 180 + i * 37}
            downloads={40 + i * 11}
            tags={TAG_SETS[i % TAG_SETS.length]}
          />
        ))}
      </section>

      <ProductResourceList items={resources} />

      <SectionDownloadCta />

      <ImageMosaic assets={assets} />

      <CtaSection />
    </main>
  );
}
