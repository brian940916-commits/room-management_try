import type { Station } from '../types/property';

export const stations: Station[] = [
  {
    id: 'taichung',
    zh: '台中站',
    en: 'Taichung Station',
    line: '台灣鐵路',
    coverEmoji: '🏙️',
    attractions: [
      { nameZh: '台中國家歌劇院', nameEn: 'National Taichung Theater', distMin: 15, type: 'culture', icon: '🎭' },
      { nameZh: '宮原眼科', nameEn: 'Miyahara', distMin: 5, type: 'food', icon: '🍦' },
      { nameZh: '彩虹眷村', nameEn: 'Rainbow Village', distMin: 25, type: 'heritage', icon: '🌈' },
      { nameZh: '台中公園', nameEn: 'Taichung Park', distMin: 8, type: 'park', icon: '🌳' },
    ],
  },
  {
    id: 'fengyuan',
    zh: '豐原站',
    en: 'Fengyuan Station',
    line: '台灣鐵路',
    coverEmoji: '🏞️',
    attractions: [
      { nameZh: '豐原廟東夜市', nameEn: 'Fengyuan Miao-Dong Night Market', distMin: 5, type: 'food', icon: '🍢' },
      { nameZh: '豐原慈濟宮', nameEn: 'Fengyuan Ciji Temple', distMin: 8, type: 'temple', icon: '⛩️' },
      { nameZh: '后豐鐵馬道', nameEn: 'Houfeng Bike Path', distMin: 20, type: 'activity', icon: '🚴' },
    ],
  },
  {
    id: 'changhua',
    zh: '彰化站',
    en: 'Changhua Station',
    line: '台灣鐵路',
    coverEmoji: '🐄',
    attractions: [
      { nameZh: '彰化大佛', nameEn: 'Changhua Giant Buddha', distMin: 20, type: 'heritage', icon: '🙏' },
      { nameZh: '彰化扇形車庫', nameEn: 'Changhua Fan-Shaped Locomotive Depot', distMin: 15, type: 'museum', icon: '🚂' },
      { nameZh: '彰化孔廟', nameEn: 'Changhua Confucius Temple', distMin: 10, type: 'temple', icon: '⛩️' },
    ],
  },
  {
    id: 'yuanlin',
    zh: '員林站',
    en: 'Yuanlin Station',
    line: '台灣鐵路',
    coverEmoji: '🌸',
    attractions: [
      { nameZh: '員林百果山', nameEn: 'Yuanlin Baiguo Mountain', distMin: 25, type: 'nature', icon: '⛰️' },
      { nameZh: '員林公園', nameEn: 'Yuanlin Park', distMin: 10, type: 'park', icon: '🌳' },
      { nameZh: '員林老街', nameEn: 'Yuanlin Old Street', distMin: 8, type: 'culture', icon: '🏮' },
    ],
  },
  {
    id: 'ershui',
    zh: '二水站',
    en: 'Ershui Station',
    line: '台灣鐵路',
    coverEmoji: '🚵',
    attractions: [
      { nameZh: '八堡圳親水公園', nameEn: 'Babao Irrigation Canal Park', distMin: 10, type: 'park', icon: '💧' },
      { nameZh: '源泉車站', nameEn: 'Yuanquan Station', distMin: 30, type: 'activity', icon: '🚴' },
      { nameZh: '二水花卉農場', nameEn: 'Ershui Flower Farm', distMin: 15, type: 'nature', icon: '🌺' },
    ],
  },
  {
    id: 'jiji',
    zh: '集集站',
    en: 'Jiji Station',
    line: '集集線',
    coverEmoji: '🌿',
    attractions: [
      { nameZh: '集集火車站', nameEn: 'Jiji Train Station', distMin: 1, type: 'heritage', icon: '🚂' },
      { nameZh: '明新書院', nameEn: 'Mingxin Academy', distMin: 10, type: 'temple', icon: '⛩️' },
      { nameZh: '集集綠色隧道', nameEh: 'Jiji Green Tunnel', distMin: 5, type: 'nature', icon: '🌳' },
    ] as Station['attractions'],
  },
  {
    id: 'shuili',
    zh: '水里站',
    en: 'Shuili Station',
    line: '集集線',
    coverEmoji: '🌊',
    attractions: [
      { nameZh: '日月潭', nameEn: 'Sun Moon Lake', distMin: 30, type: 'nature', icon: '🏞️' },
      { nameZh: '水里蛇窯', nameEn: 'Shuili Snake Kiln', distMin: 10, type: 'museum', icon: '🏺' },
      { nameZh: '水里老街', nameEn: 'Shuili Old Street', distMin: 5, type: 'food', icon: '🍜' },
    ],
  },
  {
    id: 'checheng',
    zh: '車埕站',
    en: 'Checheng Station',
    line: '集集線',
    coverEmoji: '🏕️',
    attractions: [
      { nameZh: '車埕木業展示館', nameEn: 'Checheng Lumber Industry Museum', distMin: 5, type: 'museum', icon: '🪵' },
      { nameZh: '明潭水庫', nameEn: 'Mingtan Reservoir', distMin: 15, type: 'nature', icon: '💧' },
      { nameZh: '車埕老街', nameEn: 'Checheng Old Street', distMin: 3, type: 'food', icon: '🍡' },
    ],
  },
];
