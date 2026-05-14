import { useState } from 'react';

interface AdminLoginProps {
  onLogin: (user: string, pass: string) => boolean;
  error: string;
  onBackToSite: () => void;
}

export function AdminLogin({ onLogin, error, onBackToSite }: AdminLoginProps) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLogin(user, pass);
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🚂</div>
          <h1 className="text-2xl font-bold text-gray-900">Agent TT</h1>
          <p className="text-sm text-gray-500 mt-1">後台管理系統 / Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">帳號 / Username</label>
            <input
              type="text"
              required
              value={user}
              onChange={e => setUser(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">密碼 / Password</label>
            <input
              type="password"
              required
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors"
          >
            登入 / Login
          </button>
        </form>

        <button
          onClick={onBackToSite}
          className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 返回前台 / Back to site
        </button>
      </div>
    </div>
  );
}
