import type { Lang, CartItem } from '../types/property';
import { t } from '../data/i18n';

interface CartPageProps {
  lang: Lang;
  items: CartItem[];
  onRemove: (index: number) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export function CartPage({ lang, items, onRemove, onCheckout, onContinueShopping }: CartPageProps) {
  const tr = t(lang);
  const total = items.reduce((s, item) => s + item.price * item.nights, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-700 mb-2">{tr.cart.empty}</h2>
        <button onClick={onContinueShopping} className="mt-4 px-6 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors">
          {tr.nav.home}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.cart.title}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-card shadow-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {lang === 'zh' ? item.propertyName.zh : item.propertyName.en}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {lang === 'zh' ? item.roomType.zh : item.roomType.en}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(i)}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  {tr.cart.remove} ✕
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                <span>📅 {item.checkIn} → {item.checkOut}</span>
                <span>🌙 {item.nights} {tr.common.nightShort}</span>
                <span>👤 {item.guests} {tr.common.guestsUnit}</span>
              </div>

              <div className="mt-3 border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  NT${item.price.toLocaleString()} × {item.nights} {tr.common.nightShort}
                </span>
                <span className="font-bold text-primary-700">
                  NT${(item.price * item.nights).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-card shadow-card p-5 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">{tr.cart.total}</h3>
            <div className="space-y-2 text-sm">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-gray-600">
                  <span className="truncate flex-1">{lang === 'zh' ? item.propertyName.zh : item.propertyName.en}</span>
                  <span className="flex-shrink-0 ml-2">NT${(item.price * item.nights).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-gray-900">
              <span>{tr.cart.total}</span>
              <span>NT${total.toLocaleString()}</span>
            </div>
            <button
              onClick={onCheckout}
              className="mt-4 w-full py-3 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-colors"
            >
              {tr.cart.checkout}
            </button>
            <button
              onClick={onContinueShopping}
              className="mt-2 w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {lang === 'zh' ? '繼續搜尋房源' : 'Continue browsing'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
