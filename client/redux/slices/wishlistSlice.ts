import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WishlistState, WishlistItemPopulated, Product } from '../types';
import {
  getWishlist as getWishlistApi,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi
} from '../apiCalls';
import { logout } from './userSlice';

interface OptimisticChange {
  type: 'add' | 'remove';
  productId: string;
  product?: Product;
  previousState: WishlistItemPopulated[];
}

interface WishlistStateWithOptimistic extends WishlistState {
  optimisticChange: OptimisticChange | null;
}

const initialState: WishlistStateWithOptimistic = {
  items: [],
  isFetching: false,
  error: null,
  hasInitialized: false,
  optimisticChange: null,
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
    const response = await removeFromWishlistApi(productId);
    return response;
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetWishlist: (state) => {
      state.items = [];
      state.isFetching = false;
      state.error = null;
      state.hasInitialized = false;
      state.optimisticChange = null;
    },
    // Optimistic add to wishlist
    addToWishlistOptimistic: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const isAlreadyInWishlist = state.items.some(item => item.productId._id === product._id);
      
      if (!isAlreadyInWishlist) {
        // Store the previous state for potential rollback
        state.optimisticChange = {
          type: 'add',
          productId: product._id,
          product,
          previousState: [...state.items]
        };
        
        // Add the item optimistically
        const wishlistItem: WishlistItemPopulated = {
          productId: product,
          addedAt: new Date().toISOString()
        };
        state.items.push(wishlistItem);
      }
    },
    // Optimistic remove from wishlist
    removeFromWishlistOptimistic: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const itemIndex = state.items.findIndex(item => item.productId._id === productId);
      
      if (itemIndex !== -1) {
        // Store the previous state for potential rollback
        state.optimisticChange = {
          type: 'remove',
          productId,
          previousState: [...state.items]
        };
        
        // Remove the item optimistically
        state.items.splice(itemIndex, 1);
      }
    },
    // Revert optimistic changes if API call fails
    revertOptimisticChange: (state) => {
      if (state.optimisticChange) {
        state.items = state.optimisticChange.previousState;
        state.optimisticChange = null;
      }
    },
    // Clear optimistic change when API call succeeds
    clearOptimisticChange: (state) => {
      state.optimisticChange = null;
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
      state.hasInitialized = true;
      state.error = null;
      state.optimisticChange = null; // Clear any optimistic changes
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to fetch wishlist';
    });

    // Add to Wishlist (optimistic updates handled in reducers)
    builder.addCase(addToWishlist.pending, (state) => {
      // Don't set isFetching to true since we want immediate UI updates
      state.error = null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      // Replace with server data and clear optimistic change
      state.items = action.payload;
      state.optimisticChange = null;
      state.error = null;
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      // Revert optimistic changes and show error
      if (state.optimisticChange) {
        state.items = state.optimisticChange.previousState;
        state.optimisticChange = null;
      }
      state.error = action.error.message || 'Failed to add to wishlist';
    });

    // Remove from Wishlist (optimistic updates handled in reducers)
    builder.addCase(removeFromWishlist.pending, (state) => {
      // Don't set isFetching to true since we want immediate UI updates
      state.error = null;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      // Replace with server data and clear optimistic change
      state.items = action.payload;
      state.optimisticChange = null;
      state.error = null;
    });
    builder.addCase(removeFromWishlist.rejected, (state, action) => {
      // Revert optimistic changes and show error
      if (state.optimisticChange) {
        state.items = state.optimisticChange.previousState;
        state.optimisticChange = null;
      }
      state.error = action.error.message || 'Failed to remove from wishlist';
    });

    // Listen to logout action from userSlice
    builder.addCase(logout, (state) => {
      state.items = [];
      state.isFetching = false;
      state.error = null;
      state.hasInitialized = false;
      state.optimisticChange = null;
    });
  },
});

export const { 
  clearError, 
  resetWishlist, 
  addToWishlistOptimistic, 
  removeFromWishlistOptimistic, 
  revertOptimisticChange, 
  clearOptimisticChange 
} = wishlistSlice.actions;
export default wishlistSlice.reducer; 