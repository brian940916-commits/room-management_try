import type { Property } from '../types/property';

export const properties: Property[] = [
  {
    id: 1,
    name: { zh: '台中驛旅文旅', en: 'Taichung Station Inn' },
    station: 'taichung',
    distKm: 0.3,
    rating: 4.7,
    reviewCount: 128,
    photos: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    ],
    amenities: ['wifi', 'aircon', 'nonSmoking', 'breakfast', 'parking'],
    desc: {
      zh: '位於台中車站正對面，交通便利，步行即可抵達各大景點與商圈。房間寬敞舒適，提供豐盛早餐，是商務與休閒旅行的最佳選擇。',
      en: 'Directly across from Taichung Station. Spacious rooms with daily breakfast included. Perfect for business or leisure travel.',
    },
    reviews: [
      { author: '小明', rating: 5, date: '2024-10-15', commentZh: '位置超棒，離車站步行3分鐘！', commentEn: 'Great location, 3 min walk to station!' },
      { author: 'Alice', rating: 4, date: '2024-09-20', commentZh: '早餐種類豐富，服務態度好。', commentEn: 'Great breakfast variety, friendly staff.' },
    ],
    rooms: [
      { id: 1, type: { zh: '標準雙人房', en: 'Standard Double' }, capacity: 2, price: 2200, originalPrice: 2800, qty: 3 },
      { id: 2, type: { zh: '豪華四人房', en: 'Deluxe Quad' }, capacity: 4, price: 3800, originalPrice: 4500, qty: 2 },
    ],
    policies: { checkIn: '15:00', checkOut: '11:00', maxCapacity: 4 },
  },
  {
    id: 2,
    name: { zh: '宮原旅宿', en: 'Miyahara Stay' },
    station: 'taichung',
    distKm: 0.5,
    rating: 4.5,
    reviewCount: 95,
    photos: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
    ],
    amenities: ['wifi', 'aircon', 'nonSmoking', 'kitchen'],
    desc: {
      zh: '坐落於舊城區，鄰近宮原眼科與台中公園，感受台中的歷史底蘊與現代魅力。備有共用廚房，適合自助旅行者。',
      en: 'Located in the historic district near Miyahara and Taichung Park. Shared kitchen available, ideal for self-catering travelers.',
    },
    reviews: [
      { author: '旅行者777', rating: 4, date: '2024-11-01', commentZh: '房間乾淨整潔，位置不錯。', commentEn: 'Clean room, good location.' },
    ],
    rooms: [
      { id: 1, type: { zh: '日式和室', en: 'Japanese Tatami' }, capacity: 2, price: 1800, originalPrice: 2200, qty: 4 },
      { id: 2, type: { zh: '商務單人房', en: 'Business Single' }, capacity: 1, price: 1200, originalPrice: 1500, qty: 5 },
    ],
    policies: { checkIn: '14:00', checkOut: '12:00', maxCapacity: 2 },
  },
  {
    id: 3,
    name: { zh: '豐原老街旅店', en: 'Fengyuan Old Street Lodge' },
    station: 'fengyuan',
    distKm: 0.4,
    rating: 4.3,
    reviewCount: 67,
    photos: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    ],
    amenities: ['wifi', 'parking', 'nonSmoking', 'aircon'],
    desc: {
      zh: '鄰近豐原廟東夜市，晚上可享受道地小吃。客房樸實溫馨，提供免費停車，適合自駕旅客。',
      en: 'Near Miao-Dong Night Market. Simple cozy rooms with free parking, great for road trippers.',
    },
    reviews: [
      { author: '夜市控', rating: 4, date: '2024-10-08', commentZh: '走路就到廟東夜市，超方便！', commentEn: 'Walking distance to night market, very convenient!' },
    ],
    rooms: [
      { id: 1, type: { zh: '標準雙人房', en: 'Standard Double' }, capacity: 2, price: 1600, originalPrice: 2000, qty: 6 },
      { id: 2, type: { zh: '家庭房', en: 'Family Room' }, capacity: 4, price: 2800, originalPrice: 3200, qty: 2 },
    ],
    policies: { checkIn: '15:00', checkOut: '11:00', maxCapacity: 4 },
  },
  {
    id: 4,
    name: { zh: '彰化佛國民宿', en: 'Changhua Buddha View B&B' },
    station: 'changhua',
    distKm: 0.8,
    rating: 4.6,
    reviewCount: 83,
    photos: [
      'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80',
    ],
    amenities: ['wifi', 'breakfast', 'nonSmoking', 'aircon', 'parking'],
    desc: {
      zh: '可遠眺彰化大佛，景觀絕佳。提供傳統台式早餐，老闆熱情分享在地文化，是深度旅行的好選擇。',
      en: 'Views of the Changhua Giant Buddha. Traditional Taiwanese breakfast and a warm host who shares local culture.',
    },
    reviews: [
      { author: '佛系旅人', rating: 5, date: '2024-09-15', commentZh: '老闆超親切，早餐超好吃！', commentEn: 'Super friendly host, amazing breakfast!' },
      { author: 'Tom', rating: 4, date: '2024-08-20', commentZh: '景觀很棒，交通也方便。', commentEn: 'Great views, easy access.' },
    ],
    rooms: [
      { id: 1, type: { zh: '景觀雙人房', en: 'View Double' }, capacity: 2, price: 2000, originalPrice: 2500, qty: 3 },
      { id: 2, type: { zh: '標準單人房', en: 'Standard Single' }, capacity: 1, price: 1100, originalPrice: 1400, qty: 4 },
    ],
    policies: { checkIn: '15:00', checkOut: '10:00', maxCapacity: 2 },
  },
  {
    id: 5,
    name: { zh: '員林百果山莊', en: 'Yuanlin Baiguo Mountain Villa' },
    station: 'yuanlin',
    distKm: 1.2,
    rating: 4.4,
    reviewCount: 52,
    photos: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    ],
    amenities: ['wifi', 'parking', 'bbq', 'petFriendly', 'aircon'],
    desc: {
      zh: '位於百果山麓，環境清幽，適合攀登健行。提供 BBQ 設備與寵物友善空間，是家庭旅遊的好去處。',
      en: 'Located at the foot of Baiguo Mountain. BBQ facilities and pet-friendly grounds. Great for family getaways.',
    },
    reviews: [
      { author: '爸媽帶小孩', rating: 4, date: '2024-11-10', commentZh: '帶狗狗一起來，非常歡迎，空間大！', commentEn: 'Brought our dog, very welcome. Lots of space!' },
    ],
    rooms: [
      { id: 1, type: { zh: '山景雙人房', en: 'Mountain View Double' }, capacity: 2, price: 1900, originalPrice: 2300, qty: 4 },
      { id: 2, type: { zh: 'BBQ 家庭套房', en: 'BBQ Family Suite' }, capacity: 6, price: 4500, originalPrice: 5500, qty: 1 },
    ],
    policies: { checkIn: '15:00', checkOut: '11:00', maxCapacity: 6 },
  },
  {
    id: 6,
    name: { zh: '集集綠隧民宿', en: 'Jiji Green Tunnel Inn' },
    station: 'jiji',
    distKm: 0.2,
    rating: 4.8,
    reviewCount: 114,
    photos: [
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    ],
    amenities: ['wifi', 'breakfast', 'parking', 'nonSmoking', 'aircon', 'laundry'],
    desc: {
      zh: '緊鄰集集綠色隧道入口，四季皆美。步行即可到達集集火車站，是搭乘集集線探索南投的最佳基地。',
      en: 'Next to Jiji Green Tunnel. Walk to Jiji Station — the perfect base for exploring Nantou on the Jiji Line.',
    },
    reviews: [
      { author: 'Wen', rating: 5, date: '2024-10-22', commentZh: '早晨在綠隧散步，超療癒！', commentEn: 'Morning walk in the green tunnel was so healing!' },
      { author: '鐵道迷', rating: 5, date: '2024-09-30', commentZh: '離集集站只要走路2分鐘，太方便了！', commentEn: '2 minutes to Jiji Station, so convenient!' },
    ],
    rooms: [
      { id: 1, type: { zh: '綠景雙人房', en: 'Garden View Double' }, capacity: 2, price: 2400, originalPrice: 2800, qty: 5 },
      { id: 2, type: { zh: '精緻四人房', en: 'Deluxe Quad' }, capacity: 4, price: 3600, originalPrice: 4200, qty: 2 },
    ],
    policies: { checkIn: '15:00', checkOut: '11:00', maxCapacity: 4 },
  },
  {
    id: 7,
    name: { zh: '日月潭水岸旅館', en: 'Sun Moon Lake Waterfront Hotel' },
    station: 'shuili',
    distKm: 0.6,
    rating: 4.9,
    reviewCount: 203,
    photos: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
    ],
    amenities: ['wifi', 'pool', 'breakfast', 'parking', 'nonSmoking', 'aircon', 'accessible'],
    desc: {
      zh: '距水里站僅600公尺，可搭公車快速前往日月潭。游泳池與日出觀景台是一大亮點，早餐現做現吃，品質極佳。',
      en: '600m from Shuili Station. Bus to Sun Moon Lake nearby. Pool and sunrise deck are highlights, fresh-made breakfast daily.',
    },
    reviews: [
      { author: '月美', rating: 5, date: '2024-11-05', commentZh: '泳池景色太美了，早餐也很豐盛！', commentEn: 'The pool view is stunning and breakfast is amazing!' },
      { author: 'David', rating: 5, date: '2024-10-28', commentZh: '日出看得到日月潭，值回票價！', commentEn: 'Sunrise views of Sun Moon Lake, absolutely worth it!' },
    ],
    rooms: [
      { id: 1, type: { zh: '湖景豪華雙人房', en: 'Lake View Deluxe Double' }, capacity: 2, price: 4800, originalPrice: 5800, qty: 4 },
      { id: 2, type: { zh: '標準三人房', en: 'Standard Triple' }, capacity: 3, price: 3500, originalPrice: 4200, qty: 3 },
    ],
    policies: { checkIn: '15:00', checkOut: '11:00', maxCapacity: 3 },
  },
  {
    id: 8,
    name: { zh: '車埕木業驛站', en: 'Checheng Lumber Lodge' },
    station: 'checheng',
    distKm: 0.1,
    rating: 4.6,
    reviewCount: 76,
    photos: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
      'https://images.unsplash.com/photo-1440778303588-435521a205bc?w=800&q=80',
    ],
    amenities: ['wifi', 'parking', 'nonSmoking', 'aircon', 'breakfast'],
    desc: {
      zh: '終點站車埕的特色木造民宿，使用當地老木料打造，充滿溫暖的木質氣息。距車埕站僅百步，是集集線終點旅行的完美句點。',
      en: 'A charming wooden lodge at the end of the Jiji Line, built with local timber. Just steps from Checheng Station.',
    },
    reviews: [
      { author: '木頭控', rating: 5, date: '2024-10-18', commentZh: '全木造建築，質感超好！', commentEn: 'All-wood construction, so beautiful!' },
      { author: 'Sarah', rating: 4, date: '2024-09-25', commentZh: '終點站的旅程有這家民宿真的太棒了。', commentEn: 'Perfect way to end the Jiji Line journey.' },
    ],
    rooms: [
      { id: 1, type: { zh: '木香雙人房', en: 'Timber Double' }, capacity: 2, price: 2600, originalPrice: 3000, qty: 4 },
      { id: 2, type: { zh: '閣樓家庭房', en: 'Loft Family Room' }, capacity: 4, price: 3800, originalPrice: 4500, qty: 2 },
    ],
    policies: { checkIn: '15:00', checkOut: '11:00', maxCapacity: 4 },
  },
];
