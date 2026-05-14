import type { ReactNode } from 'react';
import type { Page } from '../../hooks/useRoute';

interface AdminLayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  children: ReactNode;
}

const NAV_ITEMS: { page: Page; icon: string; zh: string; en: string }[] = [
  { page: 'adminDashboard',    icon: '📊', zh: '儀表板',     en: 'Dashboard' },
  { page: 'adminProperties',   icon: '🏨', zh: '房源管理',   en: 'Properties' },
  { page: 'adminPricing',      icon: '💰', zh: '定價管理',   en: 'Pricing' },
  { page: 'adminOrders',       icon: '📋', zh: '訂單管理',   en: 'Orders' },
  { page: 'adminInteractions', icon: '💬', zh: '互動管理',   en: 'Interactions' },
];

export function AdminLayout({ currentPage, onNavigate, onLogout, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="px-5 py-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚂</span>
            <div>
              <p className="font-bold text-sm">Agent TT</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                currentPage === item.page
                  ? 'bg-primary-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.zh}</span>
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-700 space-y-1">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span>🌐</span>
            <span>前往前台</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span>🚪</span>
            <span>登出</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
