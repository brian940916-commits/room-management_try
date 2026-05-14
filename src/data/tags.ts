import type { Tag } from '../types/property';

export const tags: Tag[] = [
  { code: 'wifi',        icon: '📶', zh: 'Wi-Fi',     en: 'Wi-Fi' },
  { code: 'parking',    icon: '🅿️', zh: '停車場',    en: 'Parking' },
  { code: 'breakfast',  icon: '🍳', zh: '含早餐',    en: 'Breakfast' },
  { code: 'petFriendly',icon: '🐾', zh: '寵物友善',  en: 'Pet Friendly' },
  { code: 'nonSmoking', icon: '🚭', zh: '禁菸',      en: 'Non-Smoking' },
  { code: 'accessible', icon: '♿', zh: '無障礙',    en: 'Accessible' },
  { code: 'pool',       icon: '🏊', zh: '游泳池',    en: 'Pool' },
  { code: 'gym',        icon: '💪', zh: '健身房',    en: 'Gym' },
  { code: 'aircon',     icon: '❄️', zh: '冷氣',      en: 'Air Conditioning' },
  { code: 'laundry',    icon: '👕', zh: '洗衣機',    en: 'Laundry' },
  { code: 'kitchen',    icon: '🍽️', zh: '廚房',      en: 'Kitchen' },
  { code: 'bbq',        icon: '🔥', zh: 'BBQ',       en: 'BBQ' },
];

export const tagMap: Record<string, Tag> = Object.fromEntries(tags.map(t => [t.code, t]));
