export interface PricingRule {
  propertyId: number;
  roomId: number;
  weekdayPrice: number;
  weekendMultiplier: number;
  holidayMultiplier: number;
  earlyBirdDays: number;
  earlyBirdDiscount: number;
}

export interface PricingHistoryEntry {
  propertyId: number;
  roomId: number;
  changedAt: string;
  field: string;
  oldValue: number;
  newValue: number;
}

export interface CannedResponses {
  zh: string[];
  en: string[];
}

export interface CompensationRecord {
  bookingId: string;
  sentAt: string;
  amount: number;
}
