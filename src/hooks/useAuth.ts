import { useState, useCallback } from 'react';

interface User {
  name: string;
  email: string;
}

const STORAGE_KEY = 'agenttt_user';

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(loadUser);
  const [showModal, setShowModal] = useState(false);

  const login = useCallback((name: string, email: string) => {
    const u = { name, email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    setShowModal(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return { user, login, logout, showModal, openModal, closeModal, isLoggedIn: !!user };
}
