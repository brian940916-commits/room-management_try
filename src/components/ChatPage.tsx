import { useState, useRef, useEffect } from 'react';
import type { Lang } from '../types/property';
import { t } from '../data/i18n';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

const CANNED_RESPONSES: Record<string, { zh: string; en: string }> = {
  '如何前往？':        { zh: '您可以搭乘台鐵到最近車站，步行或叫車前往。我們也提供接駁服務，請提前告知。', en: 'Take TRA to the nearest station. Walk or taxi. We also offer shuttle service — please inform us in advance.' },
  '停車資訊':          { zh: '我們提供免費停車場，共 10 個車位，建議提前預約。', en: 'Free parking available (10 spots). Reservation recommended.' },
  '早餐時間':          { zh: '早餐時間為 07:30 ~ 09:30，提供台式與西式選擇。', en: 'Breakfast is served from 07:30 to 09:30, with Taiwanese and Western options.' },
  '取消政策':          { zh: '入住前 10 天可免費取消。4～9 天收 30%。3 天內不退款。', en: '10+ days: free cancel. 4–9 days: 30% fee. Within 3 days: no refund.' },
  '寵物入住':          { zh: '部分房源支援寵物入住，請在搜尋時勾選「寵物友善」篩選。', en: 'Some properties are pet-friendly. Filter by "Pet Friendly" when searching.' },
  'How to get there?': { zh: '', en: 'Take TRA to the nearest station. Walk or taxi. We also offer shuttle service — please inform us in advance.' },
  'Parking Info':      { zh: '', en: 'Free parking available (10 spots). Reservation recommended.' },
  'Breakfast Time':    { zh: '', en: 'Breakfast is served from 07:30 to 09:30, with Taiwanese and Western options.' },
  'Cancellation Policy':{ zh: '', en: '10+ days: free cancel. 4–9 days: 30% fee. Within 3 days: no refund.' },
  'Pet Policy':        { zh: '', en: 'Some properties are pet-friendly. Filter by "Pet Friendly" when searching.' },
};

interface ChatPageProps {
  lang: Lang;
}

export function ChatPage({ lang }: ChatPageProps) {
  const tr = t(lang);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: tr.chat.botGreeting },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const canned = CANNED_RESPONSES[text];
    const reply = canned ? (lang === 'zh' ? canned.zh || canned.en : canned.en) : (
      lang === 'zh'
        ? '感謝您的訊息！我們的客服人員將盡快回覆您。如有緊急問題，請致電 0800-123-456。'
        : 'Thank you for your message! Our team will reply shortly. For urgent issues, call 0800-123-456.'
    );

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    }, 600);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tr.chat.title}</h1>

      <div className="bg-white rounded-card shadow-card flex flex-col" style={{ height: '60vh' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1">
                  🚂
                </div>
              )}
              <div className={`max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-700 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Quick replies */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tr.chat.quickReplies.map(qr => (
              <button
                key={qr}
                onClick={() => sendMessage(qr)}
                className="flex-shrink-0 px-3 py-1.5 text-xs border border-primary-200 text-primary-700 rounded-full hover:bg-primary-50 transition-colors"
              >
                {qr}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder={tr.chat.placeholder}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <button
            onClick={() => sendMessage(input)}
            className="px-4 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            {tr.chat.send}
          </button>
        </div>
      </div>
    </div>
  );
}
