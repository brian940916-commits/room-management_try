import type { Lang, Property } from '../types/property';
import { t } from '../data/i18n';
import { AmenityBadge } from './AmenityBadge';
import { stations } from '../data/stations';

interface PropertyCardProps {
  property: Property;
  lang: Lang;
  isFavorite: boolean;
  onFavoriteToggle: (id: number) => void;
  onClick: (id: number) => void;
}

const gradients = [
  'from-blue-400 to-indigo-600',
  'from-teal-400 to-cyan-600',
  'from-violet-400 to-purple-600',
  'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-green-600',
];

export function PropertyCard({ property, lang, isFavorite, onFavoriteToggle, onClick }: PropertyCardProps) {
  const tr = t(lang);
  const station = stations.find(s => s.id === property.station);
  const minRoom = property.rooms.reduce((min, r) => r.price < min.price ? r : min, property.rooms[0]);
  const discount = minRoom.originalPrice > minRoom.price;
  const gradientClass = gradients[property.id % gradients.length];

  return (
    <div className="bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-200 flex overflow-hidden">
      {/* Photo */}
      <div
        className="relative w-44 sm:w-52 flex-shrink-0 cursor-pointer"
        onClick={() => onClick(property.id)}
      >
        {property.photos.length > 0 ? (
          <img
            src={property.photos[0]}
            alt={lang === 'zh' ? property.name.zh : property.name.en}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <span className="text-4xl">🏨</span>
          </div>
        )}
        {discount && (
          <div className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {lang === 'zh' ? '特惠' : 'SALE'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <button
              onClick={() => onClick(property.id)}
              className="text-left font-bold text-gray-900 hover:text-primary-700 transition-colors line-clamp-1"
            >
              {lang === 'zh' ? property.name.zh : property.name.en}
            </button>
            <button
              onClick={() => onFavoriteToggle(property.id)}
              className="flex-shrink-0 text-xl transition-transform hover:scale-110"
              title={isFavorite ? tr.property.unfavorite : tr.property.favorite}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <span>📍 {station ? (lang === 'zh' ? station.zh : station.en) : property.station}</span>
            <span>·</span>
            <span>{property.distKm} {tr.property.km}</span>
          </div>

          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-semibold text-gray-800">{property.rating}</span>
            <span className="text-xs text-gray-400">({property.reviewCount} {tr.property.reviews})</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {property.amenities.slice(0, 4).map(code => (
              <AmenityBadge key={code} code={code} lang={lang} size="sm" />
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between mt-3">
          <div>
            {discount && (
              <div className="text-xs text-gray-400 line-through">
                NT${minRoom.originalPrice.toLocaleString()}
              </div>
            )}
            <div className="text-xl font-bold text-primary-700">
              NT${minRoom.price.toLocaleString()}
              <span className="text-sm font-normal text-gray-400"> {tr.property.perNight}</span>
            </div>
          </div>
          <button
            onClick={() => onClick(property.id)}
            className="px-4 py-2 bg-primary-700 text-white text-sm font-medium rounded-xl hover:bg-primary-600 transition-colors"
          >
            {tr.property.bookNow}
          </button>
        </div>
      </div>
    </div>
  );
}
