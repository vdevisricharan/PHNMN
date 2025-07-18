'use client';

import { Provider } from 'react-redux';
import { store, AppDispatch } from './store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from './slices/productsSlice';

function ProductsFetcher({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ProductsFetcher>{children}</ProductsFetcher>
    </Provider>
  );
}