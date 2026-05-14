import { useState, useMemo } from 'react';
import type { Lang, SearchParams } from '../types/property';
import { t } from '../data/i18n';
import { properties } from '../data/properties';
import { stations } from '../data/stations';
import { PropertyCard } from './PropertyCard';
import { FilterSidebar, DEFAULT_FILTERS, type FilterState } from './FilterSidebar';

interface ResultsPageProps {
  lang: Lang;
  searchParams: SearchParams;
  favoriteIds: number[];
  onFavoriteToggle: (id: number) => void;
  onPropertyClick: (id: number) => void;
}

export function ResultsPage({ lang, searchParams, favoriteIds, onFavoriteToggle, onPropertyClick }: ResultsPageProps) {
  const tr = t(lang);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilter, setShowFilter] = useState(false);

  const station = stations.find(s => s.id === searchParams.station);

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (searchParams.station && p.station !== searchParams.station) return false;
      const minP = Math.min(...p.rooms.map(r => r.price));
      if (minP < filters.minPrice || minP > filters.maxPrice) return false;
      if (p.rating < filters.minRating) return false;
      if (p.distKm > filters.maxDistKm) return false;
      if (filters.amenities.length > 0 && !filters.amenities.every(a => p.amenities.includes(a))) return false;
      return true;
    });
  }, [searchParams, filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {station ? (lang === 'zh' ? station.zh : station.en) : (lang === 'zh' ? '全部房源' : 'All Properties')}
        </h2>
        {searchParams.checkIn && searchParams.checkOut && (
          <p className="text-gray-500 mt-1 text-sm">
            {searchParams.checkIn} → {searchParams.checkOut}
            {searchParams.guests > 0 && ` · ${searchParams.guests} ${tr.common.guestsUnit}`}
          </p>
        )}
        <p className="text-gray-400 text-sm mt-1">
          {filtered.length} {lang === 'zh' ? '筆結果' : 'results'}
        </p>
      </div>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setShowFilter(v => !v)}
        className="md:hidden mb-4 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
      >
        🎛️ {tr.filter.title}
      </button>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className={`${showFilter ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <FilterSidebar lang={lang} filters={filters} onChange={setFilters} />
        </div>

        {/* Results */}
        <div className="flex-1 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p>{lang === 'zh' ? '沒有符合條件的房源，請調整篩選條件。' : 'No properties match your filters.'}</p>
            </div>
          ) : (
            filtered.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                lang={lang}
                isFavorite={favoriteIds.includes(p.id)}
                onFavoriteToggle={onFavoriteToggle}
                onClick={onPropertyClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
