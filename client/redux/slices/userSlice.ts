import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserState } from '../types';
import {
  login as loginApi,
  register as registerApi,
  getProfile as getProfileApi,
  updateProfile as updateProfileApi,
  updatePassword as updatePasswordApi,
  logout as logoutApi
} from '../apiCalls';

const initialState: UserState = {
  currentUser: null,
  isFetching: false,
  error: null,
  isAuthenticated: false,
};

// Async Thunks
export const login = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    const response = await loginApi(credentials);
    return response;
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (data: { name: string; email: string; password: string; phone?: string; dateOfBirth?: Date }) => {
    const response = await registerApi(data);
    return response;
  }
);

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async () => {
    const response = await getProfileApi();
    return response;
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: { name?: string; phone?: string; dateOfBirth?: Date }) => {
    const response = await updateProfileApi(data);
    return response;
  }
);

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async (data: { currentPassword: string; newPassword: string }) => {
    const response = await updatePasswordApi(data);
    return response;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      logoutApi();
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Login failed';
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.isFetching = false;
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Registration failed';
    });

    // Fetch Profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.isFetching = false;
      state.isAuthenticated = false;
      state.error = action.error.message || 'Failed to fetch profile';
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.error = null;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to update profile';
    });

    // Update Password
    builder.addCase(updatePassword.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(updatePassword.fulfilled, (state) => {
      state.isFetching = false;
      state.error = null;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to update password';
    });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;