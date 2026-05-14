import { useState } from 'react';
import type { Lang, CartItem, Booking } from '../types/property';
import { t } from '../data/i18n';

interface BookingFlowProps {
  lang: Lang;
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onComplete: (booking: Booking) => void;
  onCancel: () => void;
}

type PaymentMethod = 'creditCard' | 'ePay' | 'bankTransfer';

function generateId() {
  return 'BK' + Date.now().toString(36).toUpperCase();
}

export function BookingFlow({ lang, items, onRemoveItem, onComplete, onCancel }: BookingFlowProps) {
  const tr = t(lang);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  const [processing, setProcessing] = useState(false);

  const total = items.reduce((s, i) => s + i.price * i.nights, 0);

  const steps = [
    tr.booking.step1,
    tr.booking.step2,
    tr.booking.step3,
  ];

  async function handleConfirm() {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1200));
    const totalNights = items.reduce((s, i) => s + i.nights, 0);
    onComplete({
      id: generateId(),
      cartItems: items,
      guestName,
      email,
      phone,
      paymentMethod,
      status: 'confirmed',
      totalAmount: total,
      discountApplied: totalNights >= 2,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.booking.title}</h1>

      {/* Progress bar */}
      <div className="flex items-center mb-8">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${i < step - 1 ? 'text-primary-600' : i === step - 1 ? 'text-primary-700 font-medium' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i < step - 1 ? 'bg-primary-600 text-white' : i === step - 1 ? 'bg-primary-700 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step - 1 ? '✓' : i + 1}
              </div>
              <span className="text-sm hidden sm:block">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i < step - 1 ? 'bg-primary-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-card shadow-card p-6">
        {/* Step 1: Review */}
        {step === 1 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">{tr.booking.step1}</h2>
            {items.length === 0 && (
              <div className="text-center py-8 text-gray-400 mb-4">
                <p className="text-3xl mb-2">🛒</p>
                <p className="text-sm">{tr.cart.empty}</p>
              </div>
            )}
            <div className="space-y-3 mb-6">
              {items.map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">{lang === 'zh' ? item.propertyName.zh : item.propertyName.en}</p>
                      <p className="text-gray-500">{lang === 'zh' ? item.roomType.zh : item.roomType.en}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(i)}
                      className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors text-base leading-none p-1"
                      title={tr.cart.remove}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex justify-between mt-2 text-gray-600">
                    <span>{item.checkIn} → {item.checkOut} ({item.nights} {tr.common.nightShort})</span>
                    <span className="font-medium">NT${(item.price * item.nights).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-lg border-t pt-4 mb-6">
              <span>{tr.cart.total}</span>
              <span>NT${total.toLocaleString()}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                {tr.common.cancel}
              </button>
              <button
                disabled={items.length === 0}
                onClick={() => setStep(2)}
                className="flex-1 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {tr.common.confirm} →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Guest info */}
        {step === 2 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">{tr.booking.step2}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">{tr.booking.guestName} *</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  placeholder={lang === 'zh' ? '請輸入姓名' : 'Enter your name'}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{tr.booking.email} *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{tr.booking.phone}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  placeholder="+886 9xx-xxx-xxx"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                ← {tr.common.back}
              </button>
              <button
                disabled={!guestName || !email}
                onClick={() => setStep(3)}
                className="flex-1 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {tr.common.confirm} →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div>
            <h2 className="font-bold text-gray-800 mb-4">{tr.booking.step3}</h2>

            <div className="space-y-3 mb-6">
              {[
                { value: 'creditCard' as PaymentMethod, label: tr.booking.creditCard, icon: '💳' },
                { value: 'ePay' as PaymentMethod, label: tr.booking.ePay, icon: '📱' },
                { value: 'bankTransfer' as PaymentMethod, label: tr.booking.bankTransfer, icon: '🏦' },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === opt.value ? 'border-primary-600 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={() => setPaymentMethod(opt.value)}
                    className="sr-only"
                  />
                  <span className="text-xl">{opt.icon}</span>
                  <span className="font-medium text-gray-800">{opt.label}</span>
                  {paymentMethod === opt.value && <span className="ml-auto text-primary-600">✓</span>}
                </label>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>{tr.property.total}</span>
                <span>NT${total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{lang === 'zh' ? '（模擬付款，不會實際扣款）' : '(Simulated payment only)'}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                ← {tr.common.back}
              </button>
              <button
                disabled={processing}
                onClick={handleConfirm}
                className="flex-1 py-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600 disabled:opacity-60 transition-colors font-bold"
              >
                {processing ? (lang === 'zh' ? '處理中…' : 'Processing…') : tr.booking.confirm}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
