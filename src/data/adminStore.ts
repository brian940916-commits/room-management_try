import { properties as staticProperties } from './properties';
import type { Property, PropertyStatus, Booking } from '../types/property';
import type { PricingRule, PricingHistoryEntry, CannedResponses, CompensationRecord } from '../types/admin';

const K = {
  propStatus:      'agenttt_prop_status',
  propEdits:       'agenttt_prop_edits',
  newProps:        'agenttt_new_props',
  nextId:          'agenttt_next_prop_id',
  pricingRules:    'agenttt_pricing_rules',
  pricingHistory:  'agenttt_pricing_hist',
  bookings:        'agenttt_bookings',
  canned:          'agenttt_canned',
  hiddenReviews:   'agenttt_hidden_reviews',
  compensations:   'agenttt_compensations',
};

function load<T>(key: string, fallback: T): T {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) as T : fallback; } catch { return fallback; }
}
function save(key: string, val: unknown) { localStorage.setItem(key, JSON.stringify(val)); }

// ── Property status ──────────────────────────────────────────────────
export function getPropertyStatus(id: number): PropertyStatus {
  const map = load<Record<number, PropertyStatus>>(K.propStatus, {});
  return map[id] ?? 'active';
}

export function setPropertyStatus(id: number, status: PropertyStatus) {
  const map = load<Record<number, PropertyStatus>>(K.propStatus, {});
  map[id] = status;
  save(K.propStatus, map);
}

// ── Property edits ────────────────────────────────────────────────────
export function getPropertyEdits(): Record<number, Partial<Property>> {
  return load<Record<number, Partial<Property>>>(K.propEdits, {});
}

export function applyPropertyEdit(id: number, changes: Partial<Property>) {
  const edits = getPropertyEdits();
  edits[id] = { ...(edits[id] ?? {}), ...changes };
  save(K.propEdits, edits);
}

// ── New properties (admin-added) ─────────────────────────────────────
export function getNewProperties(): Property[] {
  return load<Property[]>(K.newProps, []);
}

export function addProperty(prop: Omit<Property, 'id'>): Property {
  const existing = getNewProperties();
  const nextId = load<number>(K.nextId, 1000);
  const newProp: Property = { ...prop, id: nextId, status: 'pending' };
  save(K.newProps, [...existing, newProp]);
  save(K.nextId, nextId + 1);
  return newProp;
}

export function updateNewProperty(id: number, changes: Partial<Property>) {
  const list = getNewProperties().map(p => p.id === id ? { ...p, ...changes } : p);
  save(K.newProps, list);
}

// ── Merged properties (static + overrides + new) ─────────────────────
export function getAllProperties(): Property[] {
  const edits = getPropertyEdits();
  const statusMap = load<Record<number, PropertyStatus>>(K.propStatus, {});
  const merged = staticProperties.map(p => ({
    ...p,
    ...(edits[p.id] ?? {}),
    status: statusMap[p.id] ?? 'active',
  }));
  const newProps = getNewProperties().map(p => ({
    ...p,
    status: statusMap[p.id] ?? p.status ?? 'pending',
  }));
  return [...merged, ...newProps];
}

export function getActiveProperties(): Property[] {
  return getAllProperties().filter(p => p.status === 'active');
}

// ── Pricing ───────────────────────────────────────────────────────────
export function getPricingRules(): PricingRule[] {
  return load<PricingRule[]>(K.pricingRules, []);
}

export function getPricingRule(propertyId: number, roomId: number): PricingRule | undefined {
  return getPricingRules().find(r => r.propertyId === propertyId && r.roomId === roomId);
}

export function setPricingRule(rule: PricingRule) {
  const rules = getPricingRules().filter(r => !(r.propertyId === rule.propertyId && r.roomId === rule.roomId));
  save(K.pricingRules, [...rules, rule]);
  // record history
  const hist = getPricingHistory();
  const entry: PricingHistoryEntry = {
    propertyId: rule.propertyId,
    roomId: rule.roomId,
    changedAt: new Date().toISOString(),
    field: 'weekdayPrice',
    oldValue: 0,
    newValue: rule.weekdayPrice,
  };
  save(K.pricingHistory, [entry, ...hist].slice(0, 50));
}

export function getPricingHistory(): PricingHistoryEntry[] {
  return load<PricingHistoryEntry[]>(K.pricingHistory, []);
}

// ── Bookings ──────────────────────────────────────────────────────────
export function getAllBookings(): Booking[] {
  return load<Booking[]>(K.bookings, []);
}

export function persistBooking(booking: Booking) {
  const existing = getAllBookings();
  save(K.bookings, [booking, ...existing.filter(b => b.id !== booking.id)]);
}

export function updateBookingStatus(id: string, status: Booking['status']) {
  const list = getAllBookings().map(b => b.id === id ? { ...b, status } : b);
  save(K.bookings, list);
}

export function detectOverlap(bookings: Booking[]): { a: Booking; b: Booking }[] {
  const conflicts: { a: Booking; b: Booking }[] = [];
  for (let i = 0; i < bookings.length; i++) {
    for (let j = i + 1; j < bookings.length; j++) {
      const a = bookings[i], b = bookings[j];
      for (const ai of a.cartItems) {
        for (const bi of b.cartItems) {
          if (ai.propertyId === bi.propertyId && ai.roomId === bi.roomId) {
            const aIn = new Date(ai.checkIn), aOut = new Date(ai.checkOut);
            const bIn = new Date(bi.checkIn), bOut = new Date(bi.checkOut);
            if (aIn < bOut && bIn < aOut) {
              if (!conflicts.find(c => c.a.id === a.id && c.b.id === b.id))
                conflicts.push({ a, b });
            }
          }
        }
      }
    }
  }
  return conflicts;
}

// ── Canned responses ──────────────────────────────────────────────────
const DEFAULT_CANNED: CannedResponses = {
  zh: ['如何前往？', '停車資訊', '早餐時間', '行李寄放', '取消政策', '寵物入住'],
  en: ['How to get there?', 'Parking Info', 'Breakfast Time', 'Luggage Storage', 'Cancellation Policy', 'Pet Policy'],
};

export function getCannedResponses(): CannedResponses {
  return load<CannedResponses>(K.canned, DEFAULT_CANNED);
}

export function setCannedResponses(r: CannedResponses) {
  save(K.canned, r);
}

// ── Review visibility ─────────────────────────────────────────────────
export function isReviewHidden(propId: number, idx: number): boolean {
  const map = load<Record<string, boolean>>(K.hiddenReviews, {});
  return !!map[`${propId}_${idx}`];
}

export function toggleReviewVisibility(propId: number, idx: number) {
  const map = load<Record<string, boolean>>(K.hiddenReviews, {});
  const key = `${propId}_${idx}`;
  map[key] = !map[key];
  save(K.hiddenReviews, map);
}

// ── Compensation ──────────────────────────────────────────────────────
export function getCompensations(): CompensationRecord[] {
  return load<CompensationRecord[]>(K.compensations, []);
}

export function isCompensationSent(bookingId: string): boolean {
  return getCompensations().some(c => c.bookingId === bookingId);
}

export function markCompensationSent(bookingId: string, amount: number) {
  const list = getCompensations();
  save(K.compensations, [...list, { bookingId, sentAt: new Date().toISOString(), amount }]);
}
