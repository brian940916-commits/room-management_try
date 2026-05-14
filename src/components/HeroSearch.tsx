import { useState } from 'react';
import type { Lang, SearchParams } from '../types/property';
import { t } from '../data/i18n';
import { stations } from '../data/stations';

interface HeroSearchProps {
  lang: Lang;
  onSearch: (params: SearchParams) => void;
}

type Step = 1 | 2 | 3;

export function HeroSearch({ lang, onSearch }: HeroSearchProps) {
  const tr = t(lang);
  const [step, setStep] = useState<Step>(1);
  const [station, setStation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  function handleStationSelect(id: string) {
    setStation(id);
    setStep(2);
  }

  function handleDates() {
    if (checkIn && checkOut && checkOut > checkIn) setStep(3);
  }

  function handleSearch() {
    onSearch({ station, checkIn, checkOut, guests });
  }

  const steps = [
    { n: 1, label: tr.hero.step1 },
    { n: 2, label: tr.hero.step2 },
    { n: 3, label: tr.hero.step3 },
  ];

  return (
    <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23ffffff'/%3E%3C/svg%3E\")" }} />

      <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-3 leading-tight">
          {tr.hero.title}
        </h1>
        <p className="text-primary-100 text-lg mb-10">{tr.hero.subtitle}</p>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8 gap-0">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <button
                onClick={() => step > s.n && setStep(s.n as Step)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step === s.n
                    ? 'bg-white text-primary-700 shadow-lg scale-105'
                    : step > s.n
                    ? 'bg-primary-500 text-white cursor-pointer'
                    : 'bg-primary-800 text-primary-300 cursor-not-allowed'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  step > s.n ? 'bg-accent-500 text-white' : step === s.n ? 'bg-primary-700 text-white' : 'bg-primary-600 text-primary-300'
                }`}>
                  {step > s.n ? '✓' : s.n}
                </span>
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${step > s.n ? 'bg-accent-400' : 'bg-primary-600'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 text-left">
          {step === 1 && (
            <div>
              <p className="text-gray-500 text-sm mb-4">{tr.hero.placeholder.station}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stations.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleStationSelect(s.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-center hover:border-primary-400 hover:bg-primary-50 ${
                      station === s.id ? 'border-primary-600 bg-primary-50' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{s.coverEmoji}</div>
                    <div className="text-sm font-medium text-gray-800">
                      {lang === 'zh' ? s.zh : s.en}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.line}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-gray-500 text-sm mb-4">{tr.hero.placeholder.checkIn} → {tr.hero.placeholder.checkOut}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">{tr.property.checkIn}</label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">{tr.property.checkOut}</label>
                  <input
                    type="date"
                    min={checkIn || tomorrow}
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>
              <button
                onClick={handleDates}
                disabled={!checkIn || !checkOut || checkOut <= checkIn}
                className="mt-4 w-full bg-primary-700 text-white py-3 rounded-xl font-medium hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {tr.common.confirm} →
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-gray-500 text-sm mb-4">{tr.hero.placeholder.guests}</p>
              <div className="flex items-center gap-4 justify-center my-4">
                <button
                  onClick={() => setGuests(g => Math.max(1, g - 1))}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl text-gray-600 hover:border-primary-400 hover:text-primary-700 transition-colors"
                >
                  −
                </button>
                <span className="text-4xl font-bold text-primary-700 w-12 text-center">{guests}</span>
                <button
                  onClick={() => setGuests(g => Math.min(10, g + 1))}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl text-gray-600 hover:border-primary-400 hover:text-primary-700 transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-center text-gray-500 text-sm mb-6">
                {guests} {tr.common.guestsUnit}
              </p>
              <button
                onClick={handleSearch}
                className="w-full bg-accent-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-accent-600 transition-colors shadow-lg shadow-accent-200"
              >
                🔍 {tr.hero.search}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
