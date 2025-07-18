import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/components/Products';

interface WishlistState {
  products: Product[];
}

const initialState: WishlistState = {
  products: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      if (!state.products.find(p => p._id === action.payload._id)) {
        state.products.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p._id !== action.payload);
    },
    clearWishlist: (state) => {
      state.products = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer; 