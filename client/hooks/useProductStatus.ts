import { useSelector } from 'react-redux';
import { selectProductStatus } from '@/redux/selectors';
import type { RootState } from '@/redux/store';

export const useProductStatus = (productId: string) => {
  return useSelector((state: RootState) => {
    try {
      return selectProductStatus(state, productId);
    } catch (error) {
      // Fallback for SSR or incomplete state
      return {
        isWishlisted: false,
        cartItem: null,
        isInCart: false
      };
    }
  });
};

// Alternative hooks for specific use cases
export const useIsProductWishlisted = (productId: string) => {
  return useSelector((state: RootState) => 
    selectProductStatus(state, productId)
  ).isWishlisted;
};

export const useCartItemForProduct = (productId: string) => {
  return useSelector((state: RootState) => 
    selectProductStatus(state, productId)
  ).cartItem;
}; 