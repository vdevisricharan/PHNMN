import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  _id: string;
  img: string;
  title?: string;
  desc?: string;
  categories?: string[];
  size?: string[];
  color?: string[];
  price?: number;
  createdAt?: number;
  quantity?: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartState {
  products: Product[];
  quantity: number;
  total: number;
}

const initialState: CartState = {
  products: [],
  quantity: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.quantity += 1;
      state.products.push(action.payload);
      state.total += (action.payload.price || 0) * (action.payload.quantity || 1);
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const product = state.products.find(p => p._id === action.payload);
      if (product) {
        product.quantity = (product.quantity || 1) + 1;
        state.total += product.price || 0;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const index = state.products.findIndex(p => p._id === action.payload);
      if (index !== -1) {
        const product = state.products[index];
        if ((product.quantity || 1) > 1) {
          product.quantity = (product.quantity || 1) - 1;
          state.total -= product.price || 0;
        } else {
          // Remove product from cart
          state.total -= (product.price || 0) * (product.quantity || 1);
          state.products.splice(index, 1);
          state.quantity -= 1;
        }
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      const index = state.products.findIndex(p => p._id === action.payload);
      if (index !== -1) {
        const product = state.products[index];
        state.total -= (product.price || 0) * (product.quantity || 1);
        state.products.splice(index, 1);
        state.quantity -= 1;
      }
    },
  },
});

export const { addProduct, increaseQuantity, decreaseQuantity, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;