import { useState, useMemo } from 'react';
import type { Lang, SearchParams, Property } from '../types/property';
import { t } from '../data/i18n';
import { stations } from '../data/stations';
import { PropertyCard } from './PropertyCard';
import { FilterSidebar, DEFAULT_FILTERS, type FilterState } from './FilterSidebar';

interface ResultsPageProps {
  lang: Lang;
  searchParams: SearchParams;
  favoriteIds: number[];
  onFavoriteToggle: (id: number) => void;
  onPropertyClick: (id: number) => void;
  properties: Property[];
}

type SortKey = 'recommended' | 'priceLow' | 'priceHigh' | 'rating' | 'distance';

const SORT_OPTIONS: { value: SortKey; zh: string; en: string }[] = [
  { value: 'recommended', zh: '推薦排序', en: 'Recommended' },
  { value: 'priceLow',    zh: '價格低到高', en: 'Price: Low to High' },
  { value: 'priceHigh',   zh: '價格高到低', en: 'Price: High to Low' },
  { value: 'rating',      zh: '評分高到低', en: 'Top Rated' },
  { value: 'distance',    zh: '距車站近到遠', en: 'Nearest Station' },
];

function sortProperties(list: Property[], sort: SortKey): Property[] {
  const copy = [...list];
  switch (sort) {
    case 'priceLow':
      return copy.sort((a, b) => Math.min(...a.rooms.map(r => r.price)) - Math.min(...b.rooms.map(r => r.price)));
    case 'priceHigh':
      return copy.sort((a, b) => Math.min(...b.rooms.map(r => r.price)) - Math.min(...a.rooms.map(r => r.price)));
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'distance':
      return copy.sort((a, b) => a.distKm - b.distKm);
    default:
      return copy;
  }
}

export function ResultsPage({ lang, searchParams, favoriteIds, onFavoriteToggle, onPropertyClick, properties }: ResultsPageProps) {
  const tr = t(lang);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>('recommended');
  const [showFilter, setShowFilter] = useState(false);

  const station = stations.find(s => s.id === searchParams.station);

  const filtered = useMemo(() => {
    const base = properties.filter(p => {
      if (p.status && p.status !== 'active') return false;
      if (searchParams.station && p.station !== searchParams.station) return false;
      const minP = Math.min(...p.rooms.map(r => r.price));
      if (minP < filters.minPrice || minP > filters.maxPrice) return false;
      if (p.rating < filters.minRating) return false;
      if (p.distKm > filters.maxDistKm) return false;
      if (filters.amenities.length > 0 && !filters.amenities.every(a => p.amenities.includes(a))) return false;
      if (filters.capacities.length > 0) {
        const matchCap = filters.capacities.some(cap => {
          if (cap === 6) return p.rooms.some(r => r.capacity >= 5);
          if (cap === 4) return p.rooms.some(r => r.capacity >= 3 && r.capacity <= 4);
          return p.rooms.some(r => r.capacity === cap);
        });
        if (!matchCap) return false;
      }
      return true;
    });
    return sortProperties(base, sort);
  }, [searchParams, filters, sort, properties]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {station ? (lang === 'zh' ? station.zh : station.en) : (lang === 'zh' ? '全部房源' : 'All Properties')}
        </h2>
        {searchParams.checkIn && searchParams.checkOut && (
          <p className="text-gray-500 mt-1 text-sm">
            {searchParams.checkIn} → {searchParams.checkOut}
            {searchParams.guests > 0 && ` · ${searchParams.guests} ${tr.common.guestsUnit}`}
          </p>
        )}
        <p className="text-gray-400 text-sm mt-0.5">
          {filtered.length} {lang === 'zh' ? '筆結果' : 'results'}
        </p>
      </div>

      {/* Sort + Filter toggle row */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <button
          onClick={() => setShowFilter(v => !v)}
          className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          🎛️ {tr.filter.title}
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-500 hidden sm:block">{lang === 'zh' ? '排序：' : 'Sort:'}</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {lang === 'zh' ? opt.zh : opt.en}
              </option>
            ))}
          </select>
        </div>
      </div>

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
