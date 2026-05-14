import { useState, useCallback } from 'react';

export type Page =
  | 'home'
  | 'results'
  | 'property'
  | 'cart'
  | 'booking'
  | 'bookingConfirm'
  | 'orders'
  | 'chat'
  | 'itinerary'
  | 'favorites'
  | 'adminLogin'
  | 'adminDashboard'
  | 'adminProperties'
  | 'adminPricing'
  | 'adminOrders'
  | 'adminInteractions';

export interface RouteParams {
  propertyId?: number;
  station?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export function useRoute() {
  const [page, setPage] = useState<Page>('home');
  const [params, setParams] = useState<RouteParams>({});

  const navigate = useCallback((nextPage: Page, nextParams: RouteParams = {}) => {
    setPage(nextPage);
    setParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { page, params, navigate };
}
