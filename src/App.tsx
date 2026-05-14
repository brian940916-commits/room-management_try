import { useState, useEffect } from 'react';
import type { CartItem, Booking, SearchParams } from './types/property';
import { useRoute } from './hooks/useRoute';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';
import { useLang } from './hooks/useLang';
import { useAuth } from './hooks/useAuth';
import { useAdmin } from './hooks/useAdmin';
import { persistBooking, updateBookingStatus, getAllBookings, getActiveProperties } from './data/adminStore';

import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ResultsPage } from './components/ResultsPage';
import { PropertyDetailPage } from './components/PropertyDetailPage';
import { CartPage } from './components/CartPage';
import { BookingFlow } from './components/BookingFlow';
import { BookingConfirm } from './components/BookingConfirm';
import { OrdersPage } from './components/OrdersPage';
import { ChatPage } from './components/ChatPage';
import { ItineraryPage } from './components/ItineraryPage';
import { FavoritesPage } from './components/FavoritesPage';
import { AuthModal } from './components/AuthModal';

import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProperties } from './components/admin/AdminProperties';
import { AdminPricing } from './components/admin/AdminPricing';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminInteractions } from './components/admin/AdminInteractions';

export function App() {
  const { page, params, navigate } = useRoute();
  const { items: cartItems, addItem, removeItem, clearCart, count: cartCount } = useCart();
  const { favoriteIds, toggle: toggleFavorite, isFavorite } = useFavorites();
  const { lang, toggleLang } = useLang();
  const { user, login, logout, showModal, openModal, closeModal, isLoggedIn } = useAuth();
  const { isAdminLoggedIn, adminLogin, adminLogout, loginError } = useAdmin();

  // Bookings: loaded from localStorage so admin can see them
  const [bookings, setBookings] = useState<Booking[]>(() => getAllBookings());
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({ station: '', checkIn: '', checkOut: '', guests: 2 });

  // Active properties (respects admin status overrides)
  const [activeProperties, setActiveProperties] = useState(() => getActiveProperties());
  useEffect(() => { setActiveProperties(getActiveProperties()); }, [page]);

  function handleSearch(sp: SearchParams) {
    setSearchParams(sp);
    navigate('results', { station: sp.station });
  }

  function handleStationClick(stationId: string) {
    setSearchParams({ station: stationId, checkIn: '', checkOut: '', guests: 2 });
    navigate('results', { station: stationId });
  }

  function handleBookNow(item: CartItem) {
    addItem(item);
    navigate('booking');
  }

  function handleAddToCart(item: CartItem) {
    addItem(item);
  }

  function handleBookingComplete(booking: Booking) {
    persistBooking(booking);
    setBookings(getAllBookings());
    setLastBooking(booking);
    clearCart();
    navigate('bookingConfirm');
  }

  function handleCancelOrder(id: string, _refundAmount: number) {
    updateBookingStatus(id, 'cancelled');
    setBookings(getAllBookings());
  }

  const isAdminPage = page.startsWith('admin');

  // ── Admin pages ──────────────────────────────────────────────────────
  if (isAdminPage) {
    if (!isAdminLoggedIn) {
      return (
        <AdminLogin
          onLogin={adminLogin}
          error={loginError}
          onBackToSite={() => navigate('home')}
        />
      );
    }

    const adminContent = (() => {
      switch (page) {
        case 'adminDashboard':    return <AdminDashboard />;
        case 'adminProperties':   return <AdminProperties />;
        case 'adminPricing':      return <AdminPricing />;
        case 'adminOrders':       return <AdminOrders />;
        case 'adminInteractions': return <AdminInteractions />;
        default:                  return <AdminDashboard />;
      }
    })();

    return (
      <AdminLayout currentPage={page} onNavigate={navigate} onLogout={adminLogout}>
        {adminContent}
      </AdminLayout>
    );
  }

  // ── Front-end pages ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        lang={lang}
        toggleLang={toggleLang}
        cartCount={cartCount}
        favCount={favoriteIds.length}
        isLoggedIn={isLoggedIn}
        userName={user?.name}
        onNavigate={navigate}
        onLoginClick={openModal}
        onLogout={logout}
        currentPage={page}
      />

      <main className="flex-1">
        {page === 'home' && (
          <HomePage
            lang={lang}
            favoriteIds={favoriteIds}
            onFavoriteToggle={toggleFavorite}
            onSearch={handleSearch}
            onPropertyClick={id => navigate('property', { propertyId: id })}
            onStationClick={handleStationClick}
            properties={activeProperties}
          />
        )}

        {page === 'results' && (
          <ResultsPage
            lang={lang}
            searchParams={searchParams}
            favoriteIds={favoriteIds}
            onFavoriteToggle={toggleFavorite}
            properties={activeProperties}
            onPropertyClick={id => navigate('property', {
              propertyId: id,
              checkIn: searchParams.checkIn,
              checkOut: searchParams.checkOut,
              guests: searchParams.guests,
            })}
          />
        )}

        {page === 'property' && params.propertyId != null && (
          <PropertyDetailPage
            lang={lang}
            propertyId={params.propertyId}
            checkIn={params.checkIn}
            checkOut={params.checkOut}
            guests={params.guests}
            isFavorite={isFavorite(params.propertyId)}
            onFavoriteToggle={toggleFavorite}
            onAddToCart={handleAddToCart}
            onBookNow={handleBookNow}
            onBack={() => navigate('results')}
          />
        )}

        {page === 'favorites' && (
          <FavoritesPage
            lang={lang}
            favoriteIds={favoriteIds}
            onFavoriteToggle={toggleFavorite}
            onPropertyClick={id => navigate('property', { propertyId: id })}
            onBack={() => navigate('home')}
          />
        )}

        {page === 'cart' && (
          <CartPage
            lang={lang}
            items={cartItems}
            onRemove={removeItem}
            onCheckout={() => navigate('booking')}
            onContinueShopping={() => navigate('home')}
          />
        )}

        {page === 'booking' && (
          <BookingFlow
            lang={lang}
            items={cartItems}
            onRemoveItem={removeItem}
            onComplete={handleBookingComplete}
            onCancel={() => navigate('cart')}
          />
        )}

        {page === 'bookingConfirm' && lastBooking && (
          <BookingConfirm
            lang={lang}
            booking={lastBooking}
            onBackHome={() => navigate('home')}
            onViewOrders={() => navigate('orders')}
          />
        )}

        {page === 'orders' && (
          <OrdersPage
            lang={lang}
            bookings={bookings}
            onCancel={handleCancelOrder}
            onBack={() => navigate('home')}
          />
        )}

        {page === 'chat' && <ChatPage lang={lang} />}

        {page === 'itinerary' && (
          <ItineraryPage lang={lang} bookings={bookings} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary-800 text-primary-200 text-center py-6 text-sm mt-auto">
        <p>© 2026 Agent TT · 中彰投台鐵小站住宿平台</p>
        <p className="mt-1 text-primary-400 text-xs">台中 · 豐原 · 彰化 · 員林 · 二水 · 集集 · 水里 · 車埕</p>
        <button
          onClick={() => navigate('adminLogin')}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary-700 hover:bg-primary-600 text-white text-sm font-medium rounded-xl border border-primary-600 transition-colors shadow-sm"
        >
          <span>⚙️</span> 後台管理
        </button>
      </footer>

      {showModal && (
        <AuthModal lang={lang} onClose={closeModal} onLogin={login} />
      )}
    </div>
  );
}
