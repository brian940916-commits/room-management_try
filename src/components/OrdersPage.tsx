import { useState } from 'react';
import type { Lang, Booking } from '../types/property';
import { t } from '../data/i18n';

interface OrdersPageProps {
  lang: Lang;
  bookings: Booking[];
  onCancel: (id: string, refundAmount: number) => void;
  onBack: () => void;
}

const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-600',
};

function calcRefund(booking: Booking): { pct: number; amount: number; label: { zh: string; en: string } } {
  const checkIn = booking.cartItems[0]?.checkIn;
  if (!checkIn) return { pct: 0, amount: 0, label: { zh: '不退款', en: 'No refund' } };
  const daysUntil = Math.round((new Date(checkIn).getTime() - Date.now()) / 86400000);
  if (daysUntil >= 10) return { pct: 100, amount: booking.totalAmount, label: { zh: '全額退款', en: 'Full refund' } };
  if (daysUntil >= 4)  return { pct: 70,  amount: Math.round(booking.totalAmount * 0.7), label: { zh: '退款 70%（收取 30% 手續費）', en: '70% refund (30% fee)' } };
  return { pct: 0, amount: 0, label: { zh: '不退款（距入住不足 4 天）', en: 'No refund (within 4 days)' } };
}

export function OrdersPage({ lang, bookings, onCancel, onBack }: OrdersPageProps) {
  const tr = t(lang);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

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
        {bookings.map(booking => {
          return (
            <div key={booking.id} className="bg-white rounded-card shadow-card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-400 font-mono">{booking.id}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(booking.createdAt).toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US')}
                  </p>
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
                    · 👤 {item.guests} {tr.common.guestsUnit}
                  </p>
                </div>
              ))}

              {booking.specialRequests && (
                <p className="text-xs text-gray-400 mt-2">
                  📝 {lang === 'zh' ? '特殊需求：' : 'Special requests: '}{booking.specialRequests}
                </p>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="font-bold text-primary-700">NT${booking.totalAmount.toLocaleString()}</span>
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => setCancelTarget(booking)}
                    className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    {lang === 'zh' ? '取消訂單' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel confirmation modal */}
      {cancelTarget && (() => {
        const refund = calcRefund(cancelTarget);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setCancelTarget(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {lang === 'zh' ? '確認取消訂單？' : 'Cancel this booking?'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {lang === 'zh' ? cancelTarget.cartItems[0]?.propertyName.zh : cancelTarget.cartItems[0]?.propertyName.en}
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{lang === 'zh' ? '訂單金額' : 'Order amount'}</span>
                  <span>NT${cancelTarget.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className={refund.pct > 0 ? 'text-green-600' : 'text-red-600'}>
                    {lang === 'zh' ? refund.label.zh : refund.label.en}
                  </span>
                  <span className={refund.pct > 0 ? 'text-green-600' : 'text-red-600'}>
                    {refund.pct > 0 ? `NT$${refund.amount.toLocaleString()}` : '—'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelTarget(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {tr.common.cancel}
                </button>
                <button
                  onClick={() => { onCancel(cancelTarget.id, refund.amount); setCancelTarget(null); }}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                >
                  {lang === 'zh' ? '確認取消' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
