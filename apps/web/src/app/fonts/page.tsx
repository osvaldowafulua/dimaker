import type { Metadata } from 'next';
import { FontsPage } from '@/components/fonts/fonts-page';

export const metadata: Metadata = {
  title: 'Free Fonts — Dimaker',
  description:
    'Discover beautifully crafted typefaces for every creative project — from modern displays to vintage-inspired lettering.',
};

export default function Page() {
  return <FontsPage />;
}
