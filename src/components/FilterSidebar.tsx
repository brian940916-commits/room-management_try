import type { Lang } from '../types/property';
import { t } from '../data/i18n';
import { tags } from '../data/tags';

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  maxDistKm: number;
  amenities: string[];
  capacities: number[];   // 0 = any, 1, 2, 4, 6+
}

const DEFAULT_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  maxDistKm: 5,
  amenities: [],
  capacities: [],
};

interface FilterSidebarProps {
  lang: Lang;
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

export { DEFAULT_FILTERS };

const CAPACITY_OPTIONS = [
  { value: 1, zh: '單人（1人）',    en: 'Single (1)' },
  { value: 2, zh: '雙人（2人）',    en: 'Double (2)' },
  { value: 4, zh: '四人（3-4人）',  en: 'Quad (3-4)' },
  { value: 6, zh: '家庭（5人以上）', en: 'Family (5+)' },
];

export function FilterSidebar({ lang, filters, onChange }: FilterSidebarProps) {
  const tr = t(lang);

  function toggleCapacity(val: number) {
    const next = filters.capacities.includes(val)
      ? filters.capacities.filter(c => c !== val)
      : [...filters.capacities, val];
    onChange({ ...filters, capacities: next });
  }

  function toggleAmenity(code: string) {
    const next = filters.amenities.includes(code)
      ? filters.amenities.filter(c => c !== code)
      : [...filters.amenities, code];
    onChange({ ...filters, amenities: next });
  }

  return (
    <div className="bg-white rounded-card shadow-card p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">{tr.filter.title}</h3>
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-xs text-primary-600 hover:underline"
        >
          {tr.filter.reset}
        </button>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr.filter.price}
          <span className="text-xs text-gray-400 ml-1">({tr.common.optional})</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            max={filters.maxPrice}
            value={filters.minPrice}
            onChange={e => onChange({ ...filters, minPrice: Number(e.target.value) })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="NT$ 0"
          />
          <span className="text-gray-400 flex-shrink-0">~</span>
          <input
            type="number"
            min={filters.minPrice}
            value={filters.maxPrice}
            onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="NT$ 10000"
          />
        </div>
      </div>

      {/* Room type / capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr.filter.roomType}
          <span className="text-xs text-gray-400 ml-1">({tr.common.optional})</span>
        </label>
        <div className="space-y-1.5">
          {CAPACITY_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.capacities.includes(opt.value)}
                onChange={() => toggleCapacity(opt.value)}
                className="w-4 h-4 accent-primary-700 rounded"
              />
              <span className="text-sm text-gray-700">
                {lang === 'zh' ? opt.zh : opt.en}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr.filter.rating}
          <span className="text-xs text-gray-400 ml-1">({tr.common.optional})</span>
        </label>
        <div className="flex gap-2">
          {[0, 4, 4.5, 4.8].map(r => (
            <button
              key={r}
              onClick={() => onChange({ ...filters, minRating: r })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filters.minRating === r
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {r === 0 ? (lang === 'zh' ? '不限' : 'Any') : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr.filter.distance}
          <span className="text-xs text-gray-400 ml-1">({tr.common.optional})</span>
        </label>
        <div className="flex gap-2">
          {[0.5, 1, 2, 5].map(d => (
            <button
              key={d}
              onClick={() => onChange({ ...filters, maxDistKm: d })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filters.maxDistKm === d
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {d}km
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {tr.filter.amenities}
          <span className="text-xs text-gray-400 ml-1">({tr.common.optional})</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.code}
              onClick={() => toggleAmenity(tag.code)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-colors ${
                filters.amenities.includes(tag.code)
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {tag.icon} {lang === 'zh' ? tag.zh : tag.en}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
