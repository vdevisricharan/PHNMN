'use client';

import { Provider } from 'react-redux';
import store from './store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { fetchProducts } from './slices/productsSlice';
import { fetchProfile } from './slices/userSlice';
import Cookies from 'js-cookie';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch initial products
    dispatch(fetchProducts());

    // Check for token and fetch user profile if logged in
    const token = Cookies.get('token');
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
}