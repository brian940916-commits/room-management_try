import type { Lang, CartItem } from '../types/property';
import { t } from '../data/i18n';
import { properties } from '../data/properties';
import { stations } from '../data/stations';
import { PhotoGallery } from './PhotoGallery';
import { AmenityBadge } from './AmenityBadge';
import { ReviewCard } from './ReviewCard';
import { BookingCard } from './BookingCard';

interface PropertyDetailPageProps {
  lang: Lang;
  propertyId: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  isFavorite: boolean;
  onFavoriteToggle: (id: number) => void;
  onAddToCart: (item: CartItem) => void;
  onBookNow: (item: CartItem) => void;
  onBack: () => void;
}

export function PropertyDetailPage({
  lang,
  propertyId,
  checkIn,
  checkOut,
  guests,
  isFavorite,
  onFavoriteToggle,
  onAddToCart,
  onBookNow,
  onBack,
}: PropertyDetailPageProps) {
  const tr = t(lang);
  const property = properties.find(p => p.id === propertyId);

  if (!property) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-3">😕</p>
        <p>{lang === 'zh' ? '找不到此房源' : 'Property not found'}</p>
        <button onClick={onBack} className="mt-4 text-primary-600 hover:underline">{tr.common.back}</button>
      </div>
    );
  }

  const station = stations.find(s => s.id === property.station);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-700 mb-6 transition-colors"
      >
        ← {tr.common.back}
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <PhotoGallery
            photos={property.photos}
            altBase={lang === 'zh' ? property.name.zh : property.name.en}
          />

          {/* Title & rating */}
          <div className="mt-6 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {lang === 'zh' ? property.name.zh : property.name.en}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <span>📍 {station ? (lang === 'zh' ? station.zh : station.en) : property.station}</span>
                <span>·</span>
                <span>{property.distKm} {tr.property.km}</span>
              </div>
            </div>
            <button
              onClick={() => onFavoriteToggle(property.id)}
              className="flex-shrink-0 text-2xl hover:scale-110 transition-transform"
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="font-bold text-gray-800">{property.rating}</span>
            <span className="text-sm text-gray-400">({property.reviewCount} {tr.property.reviews})</span>
          </div>

          {/* Description */}
          <p className="mt-5 text-gray-600 leading-relaxed">
            {lang === 'zh' ? property.desc.zh : property.desc.en}
          </p>

          {/* Amenities */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{tr.property.amenities}</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map(code => (
                <AmenityBadge key={code} code={code} lang={lang} />
              ))}
            </div>
          </div>

          {/* Rooms */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{tr.property.rooms}</h2>
            <div className="space-y-3">
              {property.rooms.map(room => (
                <div key={room.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-800">{lang === 'zh' ? room.type.zh : room.type.en}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      👤 {lang === 'zh' ? `最多 ${room.capacity} 人` : `Max ${room.capacity} guests`}
                      {room.qty <= 3 && (
                        <span className="ml-2 text-accent-600 font-medium">
                          {lang === 'zh' ? `僅剩 ${room.qty} 間` : `Only ${room.qty} left`}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {room.originalPrice > room.price && (
                      <p className="text-xs text-gray-400 line-through">NT${room.originalPrice.toLocaleString()}</p>
                    )}
                    <p className="font-bold text-primary-700">NT${room.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{tr.property.perNight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{tr.property.policies}</h2>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-2">
              <p>🕐 {lang === 'zh' ? `入住：${property.policies.checkIn}` : `Check-in: ${property.policies.checkIn}`}</p>
              <p>🕐 {lang === 'zh' ? `退房：${property.policies.checkOut}` : `Check-out: ${property.policies.checkOut}`}</p>
              <p>👥 {lang === 'zh' ? `最多 ${property.policies.maxCapacity} 人` : `Max ${property.policies.maxCapacity} guests`}</p>
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                <p className="font-medium text-gray-800">{tr.policy.cancel}</p>
                <p>✓ {tr.policy.rule1}</p>
                <p>✓ {tr.policy.rule2}</p>
                <p>✗ {tr.policy.rule3}</p>
              </div>
            </div>
          </div>

          {/* Nearby */}
          {station && (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{tr.property.nearby}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {station.attractions.map(a => (
                  <div key={a.nameZh} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm">
                    <span className="text-xl">{a.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">{lang === 'zh' ? a.nameZh : a.nameEn}</p>
                      <p className="text-xs text-gray-400">{a.distMin} min walk</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{tr.property.reviews_label}</h2>
            <div className="space-y-3">
              {property.reviews.map((r, i) => (
                <ReviewCard key={i} review={r} lang={lang} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking card */}
        <div className="lg:w-80 flex-shrink-0">
          <BookingCard
            property={property}
            lang={lang}
            defaultCheckIn={checkIn}
            defaultCheckOut={checkOut}
            defaultGuests={guests}
            onAddToCart={onAddToCart}
            onBookNow={onBookNow}
          />
        </div>
      </div>
    </div>
  );
}
