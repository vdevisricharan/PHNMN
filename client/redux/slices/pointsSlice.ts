import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PointsState } from '../types';
import {
  getPointsBalance as getPointsBalanceApi,
  redeemPoints as redeemPointsApi,
  getPointsTransactions as getPointsTransactionsApi
} from '../apiCalls';

const initialState: PointsState = {
  balance: 0,
  transactions: [],
  isFetching: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  hasInitialized: false,
};

// Async Thunks
export const fetchPointsBalance = createAsyncThunk(
  'points/fetchBalance',
  async () => {
    const response = await getPointsBalanceApi();
    return response;
  }
);

export const redeemPoints = createAsyncThunk(
  'points/redeem',
  async ({ points, rewardId }: { points: number; rewardId: string }) => {
    const response = await redeemPointsApi({ points, rewardId });
    return response;
  }
);

export const fetchPointsTransactions = createAsyncThunk(
  'points/fetchTransactions',
  async ({ page = 1, limit = 10 }: { page: number; limit: number }) => {
    const response = await getPointsTransactionsApi(page, limit);
    return { transactions: response, page };
  }
);

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetTransactions: (state) => {
      state.transactions = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    // Fetch Balance
    builder.addCase(fetchPointsBalance.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchPointsBalance.fulfilled, (state, action) => {
      state.isFetching = false;
      state.balance = action.payload.points;
      state.hasInitialized = true;
      state.error = null;
    });
    builder.addCase(fetchPointsBalance.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to fetch points balance';
    });

    // Redeem Points
    builder.addCase(redeemPoints.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(redeemPoints.fulfilled, (state, action) => {
      state.isFetching = false;
      state.balance = action.payload.points;
      state.error = null;
    });
    builder.addCase(redeemPoints.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to redeem points';
    });

    // Fetch Transactions
    builder.addCase(fetchPointsTransactions.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchPointsTransactions.fulfilled, (state, action) => {
      state.isFetching = false;
      if (action.payload.page === 1) {
        state.transactions = action.payload.transactions;
      } else {
        state.transactions = [...state.transactions, ...action.payload.transactions];
      }
      state.currentPage = action.payload.page;
      state.hasMore = action.payload.transactions.length > 0;
      state.error = null;
    });
    builder.addCase(fetchPointsTransactions.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to fetch transactions';
    });
  },
});

export const { clearError, resetTransactions } = pointsSlice.actions;
export default pointsSlice.reducer; 