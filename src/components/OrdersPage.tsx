import type { Lang, Booking } from '../types/property';
import { t } from '../data/i18n';

interface OrdersPageProps {
  lang: Lang;
  bookings: Booking[];
  onBack: () => void;
}

const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-600',
};

export function OrdersPage({ lang, bookings, onBack }: OrdersPageProps) {
  const tr = t(lang);

  if (bookings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">📋</p>
        <h2 className="text-xl font-bold text-gray-700 mb-2">{tr.orders.empty}</h2>
        <button onClick={onBack} className="mt-4 px-6 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors">
          {tr.booking.backHome}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.orders.title}</h1>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-card shadow-card p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-400 font-mono">{booking.id}</p>
                <p className="text-sm text-gray-500 mt-0.5">{new Date(booking.createdAt).toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US')}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[booking.status]}`}>
                {tr.orders.status[booking.status]}
              </span>
            </div>

            {booking.cartItems.map((item, i) => (
              <div key={i} className="border-b border-gray-100 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                <p className="font-medium text-gray-800">{lang === 'zh' ? item.propertyName.zh : item.propertyName.en}</p>
                <p className="text-sm text-gray-500">{lang === 'zh' ? item.roomType.zh : item.roomType.en}</p>
                <p className="text-sm text-gray-500 mt-1">
                  📅 {item.checkIn} → {item.checkOut} · {item.nights} {tr.common.nightShort}
                </p>
              </div>
            ))}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">{tr.orders.amount}</span>
              <span className="font-bold text-primary-700">NT${booking.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
