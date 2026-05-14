import type { Lang, SearchParams } from '../types/property';
import { t } from '../data/i18n';
import { HeroSearch } from './HeroSearch';
import { StationCard } from './StationCard';
import { PropertyCard } from './PropertyCard';
import { stations } from '../data/stations';
import { properties } from '../data/properties';

interface HomePageProps {
  lang: Lang;
  favoriteIds: number[];
  onFavoriteToggle: (id: number) => void;
  onSearch: (params: SearchParams) => void;
  onPropertyClick: (id: number) => void;
  onStationClick: (stationId: string) => void;
}

export function HomePage({
  lang,
  favoriteIds,
  onFavoriteToggle,
  onSearch,
  onPropertyClick,
  onStationClick,
}: HomePageProps) {
  const tr = t(lang);
  const featured = properties.slice(0, 4);

  return (
    <div>
      <HeroSearch lang={lang} onSearch={onSearch} />

      <div className="max-w-6xl mx-auto px-4">
        {/* Popular stations */}
        <section className="py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {lang === 'zh' ? '熱門車站' : 'Popular Stations'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stations.map(s => (
              <StationCard
                key={s.id}
                station={s}
                lang={lang}
                onClick={id => onStationClick(id)}
              />
            ))}
          </div>
        </section>

        {/* Featured properties */}
        <section className="pb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {lang === 'zh' ? '精選住宿' : 'Featured Stays'}
          </h2>
          <div className="space-y-4">
            {featured.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                lang={lang}
                isFavorite={favoriteIds.includes(p.id)}
                onFavoriteToggle={onFavoriteToggle}
                onClick={onPropertyClick}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => onStationClick('')}
              className="px-8 py-3 border-2 border-primary-600 text-primary-700 rounded-xl font-medium hover:bg-primary-50 transition-colors"
            >
              {lang === 'zh' ? '查看所有房源' : 'View All Properties'} →
            </button>
          </div>
        </section>

        {/* About section */}
        <section className="pb-12 border-t border-gray-100 pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🚂', titleZh: '台鐵沿線', titleEn: 'TRA Line Stays', descZh: '精選中彰投台鐵沿線優質住宿', descEn: 'Curated stays along the TRA lines in Central Taiwan' },
              { icon: '🗺️', titleZh: '行程整合', titleEn: 'Trip Integration', descZh: '住宿與車票、行程無縫整合', descEn: 'Seamlessly combine stays with train tickets and itinerary' },
              { icon: '💰', titleZh: '優惠保障', titleEn: 'Best Value', descZh: '訂兩晚以上享八折優惠券', descEn: 'Book 2+ nights and earn a 20% off coupon' },
            ].map(item => (
              <div key={item.titleZh} className="text-center p-6 bg-white rounded-card shadow-card">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{lang === 'zh' ? item.titleZh : item.titleEn}</h3>
                <p className="text-sm text-gray-500">{lang === 'zh' ? item.descZh : item.descEn}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cancel policy note */}
        <div className="mb-12 bg-primary-50 border border-primary-100 rounded-2xl p-6">
          <h3 className="font-bold text-primary-800 mb-3">📋 {tr.policy.cancel}</h3>
          <ul className="space-y-1.5 text-sm text-primary-700">
            <li>✓ {tr.policy.rule1}</li>
            <li>✓ {tr.policy.rule2}</li>
            <li>✗ {tr.policy.rule3}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
