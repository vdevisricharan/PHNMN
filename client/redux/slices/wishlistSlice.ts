import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WishlistState } from '../types';
import {
  getWishlist as getWishlistApi,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi
} from '../apiCalls';

const initialState: WishlistState = {
  items: [],
  isFetching: false,
  error: null,
};

// Async Thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async () => {
    const response = await getWishlistApi();
    return response;
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productId: string) => {
    const response = await addToWishlistApi(productId);
    return response;
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (productId: string) => {
    await removeFromWishlistApi(productId);
    return productId;
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder.addCase(fetchWishlist.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.isFetching = false;
      state.items = action.payload;
      state.error = null;
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to fetch wishlist';
    });

    // Add to Wishlist
    builder.addCase(addToWishlist.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.isFetching = false;
      state.items = action.payload;
      state.error = null;
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to add to wishlist';
    });

    // Remove from Wishlist
    builder.addCase(removeFromWishlist.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.isFetching = false;
      state.items = state.items.filter(item => item.productId._id !== action.payload);
      state.error = null;
    });
    builder.addCase(removeFromWishlist.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to remove from wishlist';
    });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer; 