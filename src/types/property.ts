export type Lang = 'zh' | 'en';

export interface Attraction {
  nameZh: string;
  nameEn: string;
  distMin: number;
  type: 'park' | 'culture' | 'food' | 'museum' | 'heritage' | 'nature' | 'temple' | 'activity';
  icon: string;
}

export interface Station {
  id: string;
  zh: string;
  en: string;
  line: string;
  coverEmoji: string;
  attractions: Attraction[];
}

export interface Tag {
  code: string;
  icon: string;
  zh: string;
  en: string;
}

export interface Review {
  author: string;
  rating: number;
  date: string;
  commentZh: string;
  commentEn: string;
}

export interface Room {
  id: number;
  type: { zh: string; en: string };
  capacity: number;
  price: number;
  originalPrice: number;
  qty: number;
}

export interface Policy {
  checkIn: string;
  checkOut: string;
  maxCapacity: number;
}

export type PropertyStatus = 'active' | 'inactive' | 'pending';

export interface Property {
  id: number;
  name: { zh: string; en: string };
  station: string;
  distKm: number;
  rating: number;
  reviewCount: number;
  photos: string[];
  amenities: string[];
  desc: { zh: string; en: string };
  reviews: Review[];
  rooms: Room[];
  policies: Policy;
  status?: PropertyStatus;
}

export interface CartItem {
  propertyId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  price: number;
  originalPrice: number;
  propertyName: { zh: string; en: string };
  roomType: { zh: string; en: string };
}

export interface Booking {
  id: string;
  cartItems: CartItem[];
  guestName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  paymentMethod: 'creditCard' | 'ePay' | 'bankTransfer';
  status: 'confirmed' | 'pending' | 'cancelled';
  totalAmount: number;
  discountApplied: boolean;
  createdAt: string;
}

export interface SearchParams {
  station: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}
