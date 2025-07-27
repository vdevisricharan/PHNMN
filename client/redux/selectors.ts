import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';

// Memoized selector to get wishlist product IDs as a Set for O(1) lookup
export const selectWishlistProductIds = createSelector(
  [(state: RootState) => state.wishlist?.items || []],
  (wishlistItems) => {
    if (!Array.isArray(wishlistItems)) return new Set();
    return new Set(
      wishlistItems
        .filter(item => item?.productId?._id)
        .map(item => item.productId._id)
    );
  }
);

// Memoized selector to get cart items as a Map for O(1) lookup
export const selectCartItemsMap = createSelector(
  [(state: RootState) => state.cart?.items || []],
  (cartItems) => {
    if (!Array.isArray(cartItems)) return new Map();
    return new Map(
      cartItems
        .filter(item => item?.productId?._id)
        .map(item => [item.productId._id, item])
    );
  }
);

// Selector to check if a product is wishlisted
export const selectIsProductWishlisted = createSelector(
  [selectWishlistProductIds, (_, productId: string) => productId],
  (wishlistIds, productId) => wishlistIds.has(productId)
);

// Selector to get cart item for a product
export const selectCartItemForProduct = createSelector(
  [selectCartItemsMap, (_, productId: string) => productId],
  (cartMap, productId) => cartMap.get(productId) || null
);

// Combined selector for product status
export const selectProductStatus = createSelector(
  [
    selectWishlistProductIds,
    selectCartItemsMap,
    (_, productId: string) => productId
  ],
  (wishlistIds, cartMap, productId) => {
    if (!productId || typeof productId !== 'string') {
      return {
        isWishlisted: false,
        cartItem: null,
        isInCart: false
      };
    }
    
    return {
      isWishlisted: wishlistIds?.has(productId) || false,
      cartItem: cartMap?.get(productId) || null,
      isInCart: cartMap?.has(productId) || false
    };
  }
); 