import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { OrderState, CheckoutData, Order } from '../types';
import {
  createOrder as createOrderApi,
  getOrders as getOrdersApi,
  getOrder as getOrderApi,
  cancelOrder as cancelOrderApi,
  trackOrder as trackOrderApi,
  requestReturn as requestReturnApi,
  processPayment as processPaymentApi,
  verifyPayment as verifyPaymentApi,
  clearCart as clearCartApi
} from '../apiCalls';

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isFetching: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  checkoutLoading: false,
  hasInitialized: false,
};

// Async Thunks
export const checkout = createAsyncThunk(
  'order/checkout',
  async (checkoutData: CheckoutData) => {
    const order = await createOrderApi(checkoutData);
    
    // If payment method is not COD, process payment
    if (checkoutData.paymentMethod !== 'cod') {
      const paymentResult = await processPaymentApi({
        orderId: order._id,
        paymentMethod: checkoutData.paymentMethod,
        cardToken: checkoutData.cardDetails?.token
      });
      
      if (paymentResult.success) {
        // Clear cart after successful payment
        await clearCartApi();
        return paymentResult.order;
      } else {
        throw new Error('Payment failed');
      }
    }
    
    // For COD, clear cart immediately
    await clearCartApi();
    return order;
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const response = await getOrdersApi(page, limit);
    return response;
  }
);

export const fetchOrder = createAsyncThunk(
  'order/fetchSingle',
  async (orderId: string) => {
    const order = await getOrderApi(orderId);
    return order;
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancel',
  async ({ orderId, reason }: { orderId: string; reason?: string }) => {
    const order = await cancelOrderApi(orderId, reason);
    return order;
  }
);

export const trackOrder = createAsyncThunk(
  'order/track',
  async (orderId: string) => {
    const tracking = await trackOrderApi(orderId);
    return tracking;
  }
);

export const requestReturn = createAsyncThunk(
  'order/requestReturn',
  async ({ orderId, data }: { 
    orderId: string; 
    data: { 
      items: Array<{ productId: string; quantity: number; reason: string }>;
      reason: string;
    }
  }) => {
    const response = await requestReturnApi(orderId, data);
    return { orderId, response };
  }
);

export const verifyPayment = createAsyncThunk(
  'order/verifyPayment',
  async (paymentId: string) => {
    const result = await verifyPaymentApi(paymentId);
    return result;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.hasInitialized = false;
    },
  },
  extraReducers: (builder) => {
    // Checkout
    builder.addCase(checkout.pending, (state) => {
      state.checkoutLoading = true;
      state.error = null;
    });
    builder.addCase(checkout.fulfilled, (state, action) => {
      state.checkoutLoading = false;
      state.currentOrder = action.payload;
      // Add to orders list if not already present
      const exists = state.orders.find(order => order._id === action.payload._id);
      if (!exists) {
        state.orders.unshift(action.payload);
      }
      state.error = null;
    });
    builder.addCase(checkout.rejected, (state, action) => {
      state.checkoutLoading = false;
      state.error = action.error.message || 'Checkout failed';
    });

    // Fetch Orders
    builder.addCase(fetchOrders.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.isFetching = false;
      if (action.meta.arg?.page === 1 || !action.meta.arg?.page) {
        state.orders = action.payload.orders;
      } else {
        state.orders = [...state.orders, ...action.payload.orders];
      }
      state.currentPage = action.payload.currentPage;
      state.hasMore = action.payload.hasMore;
      state.hasInitialized = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to fetch orders';
    });

    // Fetch Single Order
    builder.addCase(fetchOrder.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchOrder.fulfilled, (state, action) => {
      state.isFetching = false;
      state.currentOrder = action.payload;
      // Update in orders list if exists
      const index = state.orders.findIndex(order => order._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      state.error = null;
    });
    builder.addCase(fetchOrder.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to fetch order';
    });

    // Cancel Order
    builder.addCase(cancelOrder.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      state.isFetching = false;
      // Update in orders list
      const index = state.orders.findIndex(order => order._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      // Update current order if it's the same
      if (state.currentOrder?._id === action.payload._id) {
        state.currentOrder = action.payload;
      }
      state.error = null;
    });
    builder.addCase(cancelOrder.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to cancel order';
    });

    // Track Order
    builder.addCase(trackOrder.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(trackOrder.fulfilled, (state, action) => {
      state.isFetching = false;
      state.currentOrder = action.payload.order;
      // Update in orders list
      const index = state.orders.findIndex(order => order._id === action.payload.order._id);
      if (index !== -1) {
        state.orders[index] = action.payload.order;
      }
      state.error = null;
    });
    builder.addCase(trackOrder.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to track order';
    });

    // Request Return
    builder.addCase(requestReturn.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(requestReturn.fulfilled, (state) => {
      state.isFetching = false;
      state.error = null;
    });
    builder.addCase(requestReturn.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to request return';
    });

    // Verify Payment
    builder.addCase(verifyPayment.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(verifyPayment.fulfilled, (state, action) => {
      state.isFetching = false;
      if (action.payload.verified && action.payload.order) {
        // Update order in list
        const index = state.orders.findIndex(order => order._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
        // Update current order
        if (state.currentOrder?._id === action.payload.order._id) {
          state.currentOrder = action.payload.order;
        }
      }
      state.error = null;
    });
    builder.addCase(verifyPayment.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Payment verification failed';
    });
  },
});

export const { clearError, clearCurrentOrder, resetOrders } = orderSlice.actions;
export default orderSlice.reducer; 