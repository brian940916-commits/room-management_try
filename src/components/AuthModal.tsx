import { useState } from 'react';
import type { Lang } from '../types/property';
import { t } from '../data/i18n';

interface AuthModalProps {
  lang: Lang;
  onClose: () => void;
  onLogin: (name: string, email: string) => void;
}

type Mode = 'login' | 'register';

export function AuthModal({ lang, onClose, onLogin }: AuthModalProps) {
  const tr = t(lang);
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const displayName = name || email.split('@')[0];
    onLogin(displayName, email);
  }

  function handleThirdParty(provider: string) {
    onLogin(`${provider} User`, `${provider.toLowerCase()}@example.com`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🚂</div>
          <h2 className="text-xl font-bold text-gray-900">Agent TT</h2>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tr.auth.login}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tr.auth.register}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">{lang === 'zh' ? '姓名' : 'Name'}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                placeholder={lang === 'zh' ? '請輸入姓名' : 'Your name'}
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-600 mb-1">{tr.auth.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">{tr.auth.password}</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors"
          >
            {tr.auth.submit}
          </button>
        </form>

        {/* Third party */}
        <div className="mt-5">
          <p className="text-center text-xs text-gray-400 mb-3">{tr.auth.orContinueWith}</p>
          <div className="flex gap-2">
            {[
              { label: tr.auth.google, icon: '🔵', provider: 'Google' },
              { label: tr.auth.line, icon: '🟢', provider: 'LINE' },
              { label: tr.auth.facebook, icon: '🔷', provider: 'Facebook' },
            ].map(p => (
              <button
                key={p.provider}
                onClick={() => handleThirdParty(p.provider)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
