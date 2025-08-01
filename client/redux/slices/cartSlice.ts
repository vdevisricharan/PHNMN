import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItemPopulated, CartState } from '../types';
import {
  getCart as getCartApi,
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  removeFromCart as removeFromCartApi,
  clearCart as clearCartApi
} from '../apiCalls';

const initialState: CartState = {
  items: [],
  quantity: 0,
  total: 0,
  isFetching: false,
  error: null,
  hasInitialized: false,
};

// Helper function for calculating cart totals
const calculateCartTotals = (items: CartItemPopulated[]) => {
  return {
    quantity: items.reduce((acc: number, item: CartItemPopulated) => acc + item.quantity, 0),
    total: items.reduce((acc: number, item: CartItemPopulated) => {
      const price = item.productId.price * (1 - item.productId.discount / 100);
      return acc + price * item.quantity;
    }, 0),
  };
};

// Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async () => {
    const response = await getCartApi();
    return response as CartItemPopulated[];
  }
);

export const addToCart = createAsyncThunk(
  'cart/add',
  async (data: { productId: string; size: string; color: string; quantity: number }) => {
    const response = await addToCartApi(data);
    return response as CartItemPopulated[];
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const response = await updateCartItemApi(productId, { quantity });
    return response as CartItemPopulated[];
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (productId: string) => {
    await removeFromCartApi(productId);
    return productId;
  }
);

export const clearCartAPI = createAsyncThunk(
  'cart/clear',
  async () => {
    await clearCartApi();
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.quantity = 0;
      state.total = 0;
    },
    addToCartOptimistic: (state, action) => {
      const { product, size, color, quantity } = action.payload;
      const existing = state.items.find(
        item =>
          item.productId._id === product._id &&
          item.size === size &&
          item.color === color
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          productId: product,
          size,
          color,
          quantity,
          addedAt: new Date().toISOString(),
        });
      }
      const totals = calculateCartTotals(state.items);
      state.quantity = totals.quantity;
      state.total = totals.total;
    },
    removeFromCartOptimistic: (state, action) => {
      const { productId, size, color } = action.payload;
      state.items = state.items.filter(
        item =>
          !(
            item.productId._id === productId &&
            item.size === size &&
            item.color === color
          )
      );
      const totals = calculateCartTotals(state.items);
      state.quantity = totals.quantity;
      state.total = totals.total;
    },
    updateCartItemOptimistic: (state, action) => {
      const { productId, size, color, quantity, product } = action.payload;
      const item = state.items.find(
        item =>
          item.productId._id === productId &&
          item.size === size &&
          item.color === color
      );
      if (item && quantity > 0) {
        item.quantity = quantity;
        if (product) item.productId = product;
      }
      const totals = calculateCartTotals(state.items);
      state.quantity = totals.quantity;
      state.total = totals.total;
    }
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.isFetching = false;
      state.items = action.payload;
      const totals = calculateCartTotals(action.payload);
      state.quantity = totals.quantity;
      state.total = totals.total;
      state.hasInitialized = true;
      state.error = null;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to fetch cart';
    });

    // Add to Cart
    builder.addCase(addToCart.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isFetching = false;
      state.items = action.payload;
      const totals = calculateCartTotals(action.payload);
      state.quantity = totals.quantity;
      state.total = totals.total;
      state.error = null;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to add item to cart';
    });

    // Update Cart Item
    builder.addCase(updateCartItem.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      state.isFetching = false;
      state.items = action.payload;
      const totals = calculateCartTotals(action.payload);
      state.quantity = totals.quantity;
      state.total = totals.total;
      state.error = null;
    });
    builder.addCase(updateCartItem.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to update cart item';
    });

    // Remove from Cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.isFetching = false;
      state.items = state.items.filter(item => item.productId._id !== action.payload);
      const totals = calculateCartTotals(state.items);
      state.quantity = totals.quantity;
      state.total = totals.total;
      state.error = null;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to remove item from cart';
    });
    // Clear Cart
    builder.addCase(clearCartAPI.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(clearCartAPI.fulfilled, (state) => {
      state.isFetching = false;
      state.items = [];
      state.quantity = 0;
      state.total = 0;
      state.error = null;
    });
    builder.addCase(clearCartAPI.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to clear cart';
    });
  },
});

export const {
  clearError,
  clearCart,
  addToCartOptimistic,
  removeFromCartOptimistic,
  updateCartItemOptimistic,
} = cartSlice.actions;
export default cartSlice.reducer;