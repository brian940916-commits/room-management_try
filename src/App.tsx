import { useState } from 'react';
import type { CartItem, Booking, SearchParams } from './types/property';
import { useRoute } from './hooks/useRoute';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';
import { useLang } from './hooks/useLang';
import { useAuth } from './hooks/useAuth';

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

export function App() {
  const { page, params, navigate } = useRoute();
  const { items: cartItems, addItem, removeItem, clearCart, count: cartCount } = useCart();
  const { favoriteIds, toggle: toggleFavorite, isFavorite } = useFavorites();
  const { lang, toggleLang } = useLang();
  const { user, login, logout, showModal, openModal, closeModal, isLoggedIn } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({ station: '', checkIn: '', checkOut: '', guests: 2 });

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
    setBookings(prev => [booking, ...prev]);
    setLastBooking(booking);
    clearCart();
    navigate('bookingConfirm');
  }

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
          />
        )}

        {page === 'results' && (
          <ResultsPage
            lang={lang}
            searchParams={searchParams}
            favoriteIds={favoriteIds}
            onFavoriteToggle={toggleFavorite}
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
        <p>© 2025 Agent TT · 中彰投台鐵小站住宿平台</p>
        <p className="mt-1 text-primary-400 text-xs">台中 · 豐原 · 彰化 · 員林 · 二水 · 集集 · 水里 · 車埕</p>
      </footer>

      {showModal && (
        <AuthModal lang={lang} onClose={closeModal} onLogin={login} />
      )}
    </div>
  );
}
