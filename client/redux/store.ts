import { configureStore } from '@reduxjs/toolkit';
import {
  UserState,
  CartState,
  WishlistState,
  ProductsState,
  WalletState,
  PointsState,
  AddressState,
  OrderState
} from './types';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import productsReducer from './slices/productsSlice';
import walletReducer from './slices/walletSlice';
import pointsReducer from './slices/pointsSlice';
import addressReducer from './slices/addressSlice';
import orderReducer from './slices/orderSlice';
import { toastReducer } from '../components/Toast';

export interface RootState {
  user: UserState;
  cart: CartState;
  wishlist: WishlistState;
  products: ProductsState;
  wallet: WalletState;
  points: PointsState;
  address: AddressState;
  order: OrderState;
  toast: { toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info'; duration?: number }> };
}

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
    wallet: walletReducer,
    points: pointsReducer,
    address: addressReducer,
    order: orderReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['user/loginSuccess', 'user/fetchProfileSuccess'],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'payload.dateOfBirth', 
          'payload.createdAt', 
          'payload.updatedAt',
          'payload.estimatedDelivery',
          'payload.addedAt'
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'user.currentUser.dateOfBirth',
          'user.currentUser.createdAt',
          'user.currentUser.updatedAt',
          'wallet.transactions.createdAt',
          'points.transactions.createdAt',
          'order.orders.createdAt',
          'order.orders.updatedAt',
          'order.orders.estimatedDelivery',
          'order.currentOrder.createdAt',
          'order.currentOrder.updatedAt',
          'order.currentOrder.estimatedDelivery',
          'cart.items.addedAt',
          'wishlist.items.addedAt',
        ],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export default store;