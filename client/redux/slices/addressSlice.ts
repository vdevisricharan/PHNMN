import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Address } from '../types';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../apiCalls';

interface AddressState {
  addresses: Address[];
  isFetching: boolean;
  error: string | null;
  hasInitialized: boolean;
}

const initialState: AddressState = {
  addresses: [],
  isFetching: false,
  error: null,
  hasInitialized: false,
};

// Async Thunks
export const fetchAddresses = createAsyncThunk(
  'address/fetchAll',
  async () => {
    const addresses = await getAddresses();
    return addresses;
  }
);

export const createAddress = createAsyncThunk(
  'address/create',
  async (addressData: Omit<Address, '_id' | 'createdAt'>) => {
    const addresses = await addAddress(addressData);
    return addresses;
  }
);

export const editAddress = createAsyncThunk(
  'address/update',
  async ({ addressId, data }: { addressId: string; data: Omit<Address, '_id' | 'createdAt'> }) => {
    const addresses = await updateAddress(addressId, data);
    return addresses;
  }
);

export const removeAddress = createAsyncThunk(
  'address/delete',
  async (addressId: string) => {
    await deleteAddress(addressId);
    return addressId;
  }
);

export const makeDefaultAddress = createAsyncThunk(
  'address/setDefault',
  async (addressId: string) => {
    const addresses = await setDefaultAddress(addressId);
    return addresses;
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Addresses
    builder.addCase(fetchAddresses.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchAddresses.fulfilled, (state, action) => {
      state.isFetching = false;
      state.addresses = action.payload;
      state.hasInitialized = true;
      state.error = null;
    });
    builder.addCase(fetchAddresses.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to fetch addresses';
    });

    // Create Address
    builder.addCase(createAddress.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(createAddress.fulfilled, (state, action) => {
      state.isFetching = false;
      state.addresses = action.payload;
      state.error = null;
    });
    builder.addCase(createAddress.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to create address';
    });

    // Update Address
    builder.addCase(editAddress.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(editAddress.fulfilled, (state, action) => {
      state.isFetching = false;
      state.addresses = action.payload;
      state.error = null;
    });
    builder.addCase(editAddress.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to update address';
    });

    // Delete Address
    builder.addCase(removeAddress.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(removeAddress.fulfilled, (state, action) => {
      state.isFetching = false;
      state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
      state.error = null;
    });
    builder.addCase(removeAddress.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to delete address';
    });

    // Set Default Address
    builder.addCase(makeDefaultAddress.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(makeDefaultAddress.fulfilled, (state, action) => {
      state.isFetching = false;
      state.addresses = action.payload;
      state.error = null;
    });
    builder.addCase(makeDefaultAddress.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to set default address';
    });
  },
});

export const { clearError } = addressSlice.actions;
export default addressSlice.reducer; 