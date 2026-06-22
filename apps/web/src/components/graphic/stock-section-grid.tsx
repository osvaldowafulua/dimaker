import {
  STOCK_BY_SECTION,
  type GraphicSectionId,
} from '@/data/graphic-sections';
import { StockImageCard } from './stock-image-card';

const LOAD_DELAY_MS = 500;

export async function StockSectionGrid({ section }: { section: GraphicSectionId }) {
  await new Promise((resolve) => setTimeout(resolve, LOAD_DELAY_MS));

  const items = STOCK_BY_SECTION[section];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <StockImageCard key={item.id} title={item.title} imageUrl={item.imageUrl} />
      ))}
    </div>
  );
}
