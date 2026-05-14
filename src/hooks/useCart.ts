import { useState, useCallback } from 'react';
import type { CartItem } from '../types/property';

const STORAGE_KEY = 'agenttt_cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const next = [...prev, item];
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => {
      const next = prev.filter((_, i) => i !== index);
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCart([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.nights, 0);

  return { items, addItem, removeItem, clearCart, total, count: items.length };
}
