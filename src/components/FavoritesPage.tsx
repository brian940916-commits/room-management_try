import type { Lang } from '../types/property';
import { t } from '../data/i18n';
import { properties } from '../data/properties';
import { PropertyCard } from './PropertyCard';

interface FavoritesPageProps {
  lang: Lang;
  favoriteIds: number[];
  onFavoriteToggle: (id: number) => void;
  onPropertyClick: (id: number) => void;
  onBack: () => void;
}

export function FavoritesPage({ lang, favoriteIds, onFavoriteToggle, onPropertyClick, onBack }: FavoritesPageProps) {
  const tr = t(lang);
  const favProperties = properties.filter(p => favoriteIds.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.nav.favorites}</h1>

      {favProperties.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🤍</p>
          <p>{lang === 'zh' ? '尚無收藏房源，點擊心型圖示收藏。' : 'No favorites yet. Click the heart icon to save properties.'}</p>
          <button onClick={onBack} className="mt-6 px-6 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors">
            {tr.nav.home}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {favProperties.map(p => (
            <PropertyCard
              key={p.id}
              property={p}
              lang={lang}
              isFavorite
              onFavoriteToggle={onFavoriteToggle}
              onClick={onPropertyClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
