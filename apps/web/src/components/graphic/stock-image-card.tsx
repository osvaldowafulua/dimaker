export function StockImageCard({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string;
}) {
  return (
    <div className="group cursor-zoom-in">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        width={300}
        height={300}
        className="h-[300px] w-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
}
