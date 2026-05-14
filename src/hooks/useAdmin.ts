import { useState, useCallback } from 'react';

const ADMIN_USER = 'qwer';
const ADMIN_PASS = '1234';
const STORAGE_KEY = 'agenttt_admin_session';

export function useAdmin() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  );
  const [loginError, setLoginError] = useState('');

  const adminLogin = useCallback((user: string, pass: string): boolean => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAdminLoggedIn(true);
      setLoginError('');
      return true;
    }
    setLoginError('帳號或密碼錯誤 / Invalid credentials');
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAdminLoggedIn(false);
  }, []);

  return { isAdminLoggedIn, adminLogin, adminLogout, loginError };
}
