import type { Lang, Booking } from '../types/property';
import { t } from '../data/i18n';

interface BookingConfirmProps {
  lang: Lang;
  booking: Booking;
  onBackHome: () => void;
  onViewOrders: () => void;
}

export function BookingConfirm({ lang, booking, onBackHome, onViewOrders }: BookingConfirmProps) {
  const tr = t(lang);
  const totalNights = booking.cartItems.reduce((s, i) => s + i.nights, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{tr.booking.successTitle}</h1>
      <p className="text-gray-500 mb-2">{tr.booking.successMsg}</p>
      <p className="text-sm text-gray-400 mb-8">{lang === 'zh' ? `訂單編號：` : `Booking ID: `}{booking.id}</p>

      {/* Coupon for 2+ nights */}
      {totalNights >= 2 && (
        <div className="bg-accent-50 border border-accent-200 rounded-2xl p-5 mb-8 text-left">
          <p className="text-accent-700 font-medium">{tr.booking.coupon}</p>
          <div className="mt-3 bg-white border-2 border-dashed border-accent-300 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-accent-500">80% OFF</p>
            <p className="text-sm text-gray-500 mt-1">
              {lang === 'zh' ? '下次訂房可使用 · 效期 30 天' : 'Valid for next booking · Expires in 30 days'}
            </p>
            <p className="text-xs font-mono text-gray-400 mt-2">AGENTTT-{booking.id}</p>
          </div>
        </div>
      )}

      {/* Booking summary */}
      <div className="bg-white rounded-card shadow-card p-5 text-left mb-8">
        <h2 className="font-bold text-gray-800 mb-3">{lang === 'zh' ? '訂房明細' : 'Booking Summary'}</h2>
        {booking.cartItems.map((item, i) => (
          <div key={i} className="border-b border-gray-100 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
            <p className="font-medium text-gray-800">{lang === 'zh' ? item.propertyName.zh : item.propertyName.en}</p>
            <p className="text-sm text-gray-500">{lang === 'zh' ? item.roomType.zh : item.roomType.en}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {item.checkIn} → {item.checkOut} · {item.nights} {tr.common.nightShort}
            </p>
          </div>
        ))}
        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
          <span>{tr.property.total}</span>
          <span>NT${booking.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onViewOrders}
          className="flex-1 py-3 border border-primary-600 text-primary-700 rounded-xl hover:bg-primary-50 transition-colors font-medium"
        >
          {tr.booking.viewOrders}
        </button>
        <button
          onClick={onBackHome}
          className="flex-1 py-3 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors font-bold"
        >
          {tr.booking.backHome}
        </button>
      </div>
    </div>
  );
}
