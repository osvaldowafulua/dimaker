import Link from 'next/link';

const GRADIENTS = [
  'from-violet-600/40 via-fuchsia-500/20 to-transparent',
  'from-blue-600/40 via-cyan-500/20 to-transparent',
  'from-amber-600/40 via-orange-500/20 to-transparent',
  'from-emerald-600/40 via-teal-500/20 to-transparent',
  'from-rose-600/40 via-pink-500/20 to-transparent',
];

export type AssetTileProps = {
  id: string;
  title: string;
  slug: string;
  creator_handle: string;
  asset_type?: string;
  views?: number;
  index?: number;
  variant?: 'scroll' | 'grid';
};

export function AssetTile({
  title,
  slug,
  creator_handle,
  asset_type,
  views = 0,
  index = 0,
  variant = 'scroll',
}: AssetTileProps) {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const href = `/creators/${creator_handle}/${slug}`;

  if (variant === 'grid') {
    return (
      <Link
        href={href}
        className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-card aspect-[4/5] block"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="font-medium text-sm line-clamp-2">{title}</p>
          <p className="text-xs text-muted mt-1 flex items-center gap-2">
            <span>@{creator_handle}</span>
            {views > 0 && (
              <>
                <span className="opacity-50">·</span>
                <span className="flex items-center gap-1">
                  <EyeIcon />
                  {views}
                </span>
              </>
            )}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group shrink-0 w-[200px] sm:w-[220px] rounded-2xl bg-card border border-border shadow-card overflow-hidden block"
    >
      <div className={`aspect-[4/3] bg-gradient-to-br ${gradient} relative`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        {asset_type && (
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider font-medium bg-black/50 backdrop-blur px-2 py-1 rounded-full">
            {asset_type}
          </span>
        )}
      </div>
      <div className="p-3.5">
        <p className="font-medium text-sm truncate">{title}</p>
        <p className="text-xs text-muted mt-1 flex items-center gap-1.5">
          <EyeIcon />
          {views || '—'}
        </p>
      </div>
    </Link>
  );
}

function EyeIcon() {
  return (
    <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}
