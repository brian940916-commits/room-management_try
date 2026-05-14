import type { Lang } from '../types/property';
import type { Page } from '../hooks/useRoute';
import { t } from '../data/i18n';

interface NavbarProps {
  lang: Lang;
  toggleLang: () => void;
  cartCount: number;
  favCount: number;
  isLoggedIn: boolean;
  userName?: string;
  onNavigate: (page: Page) => void;
  onLoginClick: () => void;
  onLogout: () => void;
  currentPage: Page;
}

export function Navbar({
  lang,
  toggleLang,
  cartCount,
  favCount,
  isLoggedIn,
  userName,
  onNavigate,
  onLoginClick,
  onLogout,
  currentPage,
}: NavbarProps) {
  const tr = t(lang);

  const navLinks: { page: Page; label: string }[] = [
    { page: 'home',      label: tr.nav.home },
    { page: 'favorites', label: tr.nav.favorites },
    { page: 'orders',    label: tr.nav.orders },
    { page: 'itinerary', label: tr.nav.itinerary },
    { page: 'chat',      label: tr.nav.chat },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 font-bold text-xl text-primary-700 hover:text-primary-600 transition-colors"
        >
          <span className="text-2xl">🚂</span>
          <span className="hidden sm:block">Agent TT</span>
        </button>

        {/* Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Lang toggle */}
          <button
            onClick={toggleLang}
            className="px-2 py-1 text-xs font-medium border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>

          {/* Favorites */}
          <button
            onClick={() => onNavigate('favorites')}
            className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            title={tr.nav.favorites}
          >
            <span className="text-lg">♡</span>
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {favCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => onNavigate('cart')}
            className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            title={tr.nav.cart}
          >
            <span className="text-lg">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-gray-700 font-medium">{userName}</span>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {tr.nav.logout}
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-3 py-1.5 text-sm bg-primary-700 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              {tr.nav.login}
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-gray-100 overflow-x-auto">
        <div className="flex px-2 py-1">
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentPage === link.page
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
