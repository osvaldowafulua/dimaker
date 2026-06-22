import Link from 'next/link';
import { Mail } from 'lucide-react';
import { GraphicMainTabs } from './graphic-main-tabs';
import { MarketingHero } from '@/components/layout/marketing-page-shell';
import { ShineButton } from '@/components/ui/shine-button';

export function GraphicBrowseShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden pb-16">
      <div className="mt-10 sm:mt-14">
        <MarketingHero
          eyebrow="Download Free Graphics"
          title={
            <>
              <span className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-clip-text text-transparent">
                Ready for Every
              </span>{' '}
              <span className="text-ali"> Design.</span>
            </>
          }
          description="Discover the essence of creativity in our exquisite collection of top-tier abstract design assets. Each piece is a blend of beauty and utility, perfect for elevating any project."
          actions={
            <>
              <ShineButton href="/creator">
                <span>Upload Your Design/Login</span>
              </ShineButton>
              <Link
                href="mailto:support@dimaker.com?subject=Share%20a%20design"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-highlight hover:text-highlight-foreground"
              >
                <Mail className="h-5 w-5" />
                Share Your Design
              </Link>
            </>
          }
        />
      </div>

      <div className="text-center">
        <div className="container-wrapper flex justify-center px-6">
          <GraphicMainTabs />
        </div>
        <div className="container-wrapper bg-background mt-6 rounded-t-3xl px-4 pb-6 pt-4 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
