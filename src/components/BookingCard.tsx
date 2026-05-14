import { useState } from 'react';
import type { Lang, Property, Room, CartItem } from '../types/property';
import { t } from '../data/i18n';

interface BookingCardProps {
  property: Property;
  lang: Lang;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultGuests?: number;
  onAddToCart: (item: CartItem) => void;
  onBookNow: (item: CartItem) => void;
}

function calcNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / 86400000));
}

export function BookingCard({
  property,
  lang,
  defaultCheckIn = '',
  defaultCheckOut = '',
  defaultGuests = 2,
  onAddToCart,
  onBookNow,
}: BookingCardProps) {
  const tr = t(lang);
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(defaultCheckIn || today);
  const [checkOut, setCheckOut] = useState(defaultCheckOut || tomorrow);
  const [guests, setGuests] = useState(defaultGuests);
  const [selectedRoom, setSelectedRoom] = useState<Room>(property.rooms[0]);

  const nights = calcNights(checkIn, checkOut);
  const subtotal = selectedRoom.price * nights;
  const savings = (selectedRoom.originalPrice - selectedRoom.price) * nights;
  const isValid = checkIn && checkOut && checkOut > checkIn && nights > 0;

  function buildItem(): CartItem {
    return {
      propertyId: property.id,
      roomId: selectedRoom.id,
      checkIn,
      checkOut,
      guests,
      nights,
      price: selectedRoom.price,
      originalPrice: selectedRoom.originalPrice,
      propertyName: property.name,
      roomType: selectedRoom.type,
    };
  }

  return (
    <div className="bg-white rounded-card shadow-card p-5 sticky top-24">
      <div className="text-2xl font-bold text-primary-700 mb-1">
        NT${selectedRoom.price.toLocaleString()}
        <span className="text-sm font-normal text-gray-400"> {tr.property.perNight}</span>
      </div>
      {selectedRoom.originalPrice > selectedRoom.price && (
        <p className="text-xs text-gray-400 line-through mb-3">
          NT${selectedRoom.originalPrice.toLocaleString()}
        </p>
      )}

      {/* Room selector */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1">{tr.property.rooms}</label>
        <select
          value={selectedRoom.id}
          onChange={e => {
            const r = property.rooms.find(r => r.id === Number(e.target.value));
            if (r) setSelectedRoom(r);
          }}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          {property.rooms.map(r => (
            <option key={r.id} value={r.id}>
              {lang === 'zh' ? r.type.zh : r.type.en} — NT${r.price.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">{tr.property.checkIn}</label>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={e => setCheckIn(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{tr.property.checkOut}</label>
          <input
            type="date"
            min={checkIn || tomorrow}
            value={checkOut}
            onChange={e => setCheckOut(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1">{tr.property.guests}</label>
        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2">
          <button
            onClick={() => setGuests(g => Math.max(1, g - 1))}
            className="text-gray-500 hover:text-primary-700 font-bold"
          >−</button>
          <span className="flex-1 text-center text-sm font-medium">{guests} {tr.common.guestsUnit}</span>
          <button
            onClick={() => setGuests(g => Math.min(selectedRoom.capacity, g + 1))}
            className="text-gray-500 hover:text-primary-700 font-bold"
          >+</button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {lang === 'zh' ? `最多 ${selectedRoom.capacity} 人` : `Max ${selectedRoom.capacity} guests`}
        </p>
      </div>

      {/* Price breakdown */}
      {isValid && (
        <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>NT${selectedRoom.price.toLocaleString()} × {nights} {tr.common.nightShort}</span>
            <span>NT${subtotal.toLocaleString()}</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-accent-600">
              <span>{tr.property.discount}</span>
              <span>−NT${savings.toLocaleString()}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-900">
            <span>{tr.property.total}</span>
            <span>NT${subtotal.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <button
        disabled={!isValid}
        onClick={() => isValid && onBookNow(buildItem())}
        className="w-full py-3 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-2"
      >
        {tr.property.bookNow}
      </button>
      <button
        disabled={!isValid}
        onClick={() => isValid && onAddToCart(buildItem())}
        className="w-full py-3 border border-primary-600 text-primary-700 font-medium rounded-xl hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {tr.property.addToCart}
      </button>

      {/* Policy brief */}
      <div className="mt-4 text-xs text-gray-400 leading-relaxed">
        <p>✓ {tr.policy.rule1}</p>
        <p className="mt-1">✓ {lang === 'zh' ? `入住前 4～9 天：30% 費用` : `4–9 days before: 30% fee`}</p>
      </div>
    </div>
  );
}
