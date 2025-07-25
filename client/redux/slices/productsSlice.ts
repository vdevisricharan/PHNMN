import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductsState, Product, ProductFilters, ProductSort } from '../types';
import { getProducts as getProductsApi } from '../apiCalls';

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  filters: {},
  sort: null,
  isFetching: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMore: true,
};

// Helper function to apply filters and sorting
const applyFiltersAndSort = (products: Product[], filters: ProductFilters, sort: ProductSort | null) => {
  let filtered = [...products];

  // Apply filters
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(product => 
      filters.category!.some(cat => product.category.includes(cat))
    );
  }

  if (filters.priceRange) {
    filtered = filtered.filter(product => {
      const price = product.price * (1 - product.discount / 100);
      return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
    });
  }

  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter(product =>
      filters.colors!.some(color => product.colors.includes(color))
    );
  }

  if (filters.sizes && filters.sizes.length > 0) {
    filtered = filtered.filter(product => {
      const productSizes = Array.isArray(product.sizes) ? product.sizes : [product.sizes];
      return filters.sizes!.some(size => productSizes.includes(size));
    });
  }

  if (filters.rating !== undefined) {
    filtered = filtered.filter(product => product.rating >= filters.rating!);
  }

  if (filters.inStock) {
    filtered = filtered.filter(product => {
      const stockValues = Object.values(product.stock);
      return stockValues.some(stock => stock > 0);
    });
  }

  // Apply sorting
  if (sort) {
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sort.field) {
        case 'price':
          aValue = a.price * (1 - a.discount / 100);
          bValue = b.price * (1 - b.discount / 100);
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
        default:
          return 0;
      }

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

  return filtered;
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async ({ category, sort, page = 1, limit = 12 }: { category?: string; sort?: string; page?: number; limit?: number } = {}) => {
    const response = await getProductsApi({ category, sort, page, limit });
    // Handle both array response and paginated response
    if (Array.isArray(response)) {
      return {
        products: response,
        currentPage: 1,
        totalPages: 1,
        hasMore: false
      };
    }
    return {
      products: response.products || response,
      currentPage: response.currentPage || page,
      totalPages: response.totalPages || 1,
      hasMore: response.hasMore || false
    };
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetProducts: (state) => {
      state.products = [];
      state.filteredProducts = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
      state.filteredProducts = applyFiltersAndSort(state.products, action.payload, state.sort);
    },
    updateFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sort);
    },
    clearFilters: (state) => {
      state.filters = {};
      state.filteredProducts = applyFiltersAndSort(state.products, {}, state.sort);
    },
    setSort: (state, action: PayloadAction<ProductSort | null>) => {
      state.sort = action.payload;
      state.filteredProducts = applyFiltersAndSort(state.products, state.filters, action.payload);
    },
    // Client-side search
    searchProducts: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      if (!searchTerm) {
        state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sort);
      } else {
        const searchResults = state.products.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        state.filteredProducts = applyFiltersAndSort(searchResults, state.filters, state.sort);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.isFetching = false;
      if (action.meta.arg?.page === 1 || !action.meta.arg?.page) {
        state.products = action.payload.products;
      } else {
        state.products = [...state.products, ...action.payload.products];
      }
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.hasMore = action.payload.hasMore;
      state.filteredProducts = applyFiltersAndSort(state.products, state.filters, state.sort);
      state.error = null;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.error.message || 'Failed to fetch products';
    });
  },
});

export const { 
  clearError, 
  resetProducts, 
  setFilters, 
  updateFilters, 
  clearFilters, 
  setSort, 
  searchProducts 
} = productsSlice.actions;

export default productsSlice.reducer;
