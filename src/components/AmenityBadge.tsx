import type { Lang } from '../types/property';
import { tagMap } from '../data/tags';

interface AmenityBadgeProps {
  code: string;
  lang: Lang;
  size?: 'sm' | 'md';
}

export function AmenityBadge({ code, lang, size = 'md' }: AmenityBadgeProps) {
  const tag = tagMap[code];
  if (!tag) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-full text-gray-600 font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span>{tag.icon}</span>
      <span>{lang === 'zh' ? tag.zh : tag.en}</span>
    </span>
  );
}
