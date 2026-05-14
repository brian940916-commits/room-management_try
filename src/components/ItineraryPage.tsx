import type { Lang, Booking } from '../types/property';
import { t } from '../data/i18n';
import { stations } from '../data/stations';
import { properties } from '../data/properties';

interface ItineraryPageProps {
  lang: Lang;
  bookings: Booking[];
}

const MOCK_TRAINS = [
  { from: '台中', to: '集集', departs: '08:15', arrives: '10:30', trainNo: '1131' },
  { from: '彰化', to: '水里', departs: '09:00', arrives: '11:20', trainNo: '2255' },
];

function hasConflict(trainArrivesAt: string, checkInTime: string): boolean {
  const [ah, am] = trainArrivesAt.split(':').map(Number);
  const [ch, cm] = checkInTime.split(':').map(Number);
  const arriveMin = ah * 60 + am;
  const checkInMin = ch * 60 + cm;
  return arriveMin > checkInMin;
}

export function ItineraryPage({ lang, bookings }: ItineraryPageProps) {
  const tr = t(lang);

  const items = bookings.flatMap(b => b.cartItems);
  const hasBookings = items.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.itinerary.title}</h1>

      {/* Mock train info */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
          🚂 {tr.itinerary.trainInfo}
          <span className="text-xs text-gray-400 font-normal">({lang === 'zh' ? '模擬資料' : 'Simulated'})</span>
        </h2>
        <div className="space-y-3">
          {MOCK_TRAINS.map(train => (
            <div key={train.trainNo} className="bg-white rounded-card shadow-card p-4 flex items-center gap-4">
              <div className="text-3xl">🚂</div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  {train.from} → {train.to}
                  <span className="ml-2 text-xs text-gray-400">No. {train.trainNo}</span>
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{train.departs} → {train.arrives}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel info */}
      <div>
        <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
          🏨 {tr.itinerary.hotelInfo}
        </h2>

        {!hasBookings ? (
          <div className="bg-gray-50 rounded-card p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">🗓️</p>
            <p>{tr.itinerary.noBookings}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => {
              const prop = properties.find(p => p.id === item.propertyId);
              const station = prop ? stations.find(s => s.id === prop.station) : null;
              const checkInTime = prop?.policies.checkIn ?? '15:00';

              // Check conflict with any mock train that arrives at the same station area
              const conflict = MOCK_TRAINS.some(train =>
                station && (lang === 'zh' ? station.zh : station.en).includes(train.to) &&
                item.checkIn === new Date().toISOString().split('T')[0] &&
                hasConflict(train.arrives, checkInTime)
              );

              return (
                <div key={i} className="bg-white rounded-card shadow-card p-5">
                  {conflict && (
                    <div className="mb-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                      {tr.itinerary.conflict}
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center text-2xl flex-shrink-0">
                      🏨
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">
                        {lang === 'zh' ? item.propertyName.zh : item.propertyName.en}
                      </p>
                      <p className="text-sm text-gray-500">{lang === 'zh' ? item.roomType.zh : item.roomType.en}</p>
                      {station && (
                        <p className="text-sm text-gray-500 mt-0.5">
                          📍 {lang === 'zh' ? station.zh : station.en}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-3 text-sm">
                        <span className="bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full">
                          {tr.property.checkIn}: {item.checkIn} {checkInTime}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                          {tr.property.checkOut}: {item.checkOut} {prop?.policies.checkOut ?? '11:00'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {item.nights} {tr.common.nightShort} · NT${(item.price * item.nights).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
