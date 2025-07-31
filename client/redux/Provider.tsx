'use client';

import { Provider } from 'react-redux';
import store from './store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';
import { fetchProfile } from './slices/userSlice';
import { fetchWalletBalance } from './slices/walletSlice';
import { fetchPointsBalance } from './slices/pointsSlice';
import { fetchAddresses } from './slices/addressSlice';
import { fetchWishlist } from './slices/wishlistSlice';
import { fetchCart } from './slices/cartSlice';
import { fetchProducts } from './slices/productsSlice';
import Cookies from 'js-cookie';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, isFetching: userFetching, isAuthenticated } = useSelector((state: RootState) => state.user);
  const { hasInitialized: productsInitialized, isFetching: productsFetching } = useSelector((state: RootState) => state.products);
  const { hasInitialized: walletInitialized, isFetching: walletFetching } = useSelector((state: RootState) => state.wallet);
  const { hasInitialized: pointsInitialized, isFetching: pointsFetching } = useSelector((state: RootState) => state.points);
  const { hasInitialized: addressesInitialized, isFetching: addressesFetching } = useSelector((state: RootState) => state.address);
  const { hasInitialized: wishlistInitialized, isFetching: wishlistFetching } = useSelector((state: RootState) => state.wishlist);
  const { hasInitialized: cartInitialized, isFetching: cartFetching } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const token = Cookies.get('token');
    
    // Fetch products first (available to everyone)
    if (!productsInitialized && !productsFetching) {
      dispatch(fetchProducts());
    }
    
    // Only proceed with user-specific data if there's a token and user is not currently being fetched
    if (token && !userFetching) {
      // Fetch user profile if no current user
      if (!currentUser) {
        dispatch(fetchProfile());
      }
      
      // If user is authenticated, fetch related data
      if (isAuthenticated || currentUser) {
        // Fetch wallet balance if not already initialized and not currently fetching
        if (!walletInitialized && !walletFetching) {
          dispatch(fetchWalletBalance());
        }
        
        // Fetch points balance if not already initialized and not currently fetching
        if (!pointsInitialized && !pointsFetching) {
          dispatch(fetchPointsBalance());
        }
        
        // Fetch addresses if not already initialized and not currently fetching
        if (!addressesInitialized && !addressesFetching) {
          dispatch(fetchAddresses());
        }
        
        // Fetch wishlist if not already initialized and not currently fetching
        if (!wishlistInitialized && !wishlistFetching) {
          dispatch(fetchWishlist());
        }
        
        // Fetch cart if not already initialized and not currently fetching
        if (!cartInitialized && !cartFetching) {
          dispatch(fetchCart());
        }
      }
    }
  }, [dispatch, currentUser, isAuthenticated, userFetching, productsInitialized, productsFetching, walletInitialized, walletFetching, pointsInitialized, pointsFetching, addressesInitialized, addressesFetching, wishlistInitialized, wishlistFetching, cartInitialized, cartFetching]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
}