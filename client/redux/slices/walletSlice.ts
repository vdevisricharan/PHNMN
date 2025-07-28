import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WalletState } from '../types';
import {
  getWalletBalance as getWalletBalanceApi,
  addWalletMoney as addWalletMoneyApi,
  getWalletTransactions as getWalletTransactionsApi
} from '../apiCalls';

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  isFetching: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  hasInitialized: false,
};

// Async Thunks
export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchBalance',
  async () => {
    const response = await getWalletBalanceApi();
    return response;
  }
);

export const addWalletMoney = createAsyncThunk(
  'wallet/addMoney',
  async (amount: number) => {
    const response = await addWalletMoneyApi(amount);
    return response;
  }
);

export const fetchWalletTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async ({ page = 1, limit = 10 }: { page: number; limit: number }) => {
    const response = await getWalletTransactionsApi(page, limit);
    return { transactions: response, page };
  }
);

const walletSlice = createSlice({
  name: 'wallet',
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
    builder.addCase(fetchWalletBalance.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchWalletBalance.fulfilled, (state, action) => {
      state.isFetching = false;
      state.balance = action.payload.balance;
      state.hasInitialized = true;
      state.error = null;
    });
    builder.addCase(fetchWalletBalance.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to fetch wallet balance';
    });

    // Add Money
    builder.addCase(addWalletMoney.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(addWalletMoney.fulfilled, (state, action) => {
      state.isFetching = false;
      state.balance = action.payload.balance;
      state.error = null;
    });
    builder.addCase(addWalletMoney.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to add money to wallet';
    });

    // Fetch Transactions
    builder.addCase(fetchWalletTransactions.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchWalletTransactions.fulfilled, (state, action) => {
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
    builder.addCase(fetchWalletTransactions.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to fetch transactions';
    });
  },
});

export const { clearError, resetTransactions } = walletSlice.actions;
export default walletSlice.reducer; 