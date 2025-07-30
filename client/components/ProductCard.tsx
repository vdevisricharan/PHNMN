'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FavoriteBorderOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  FavoriteOutlined,
  Star,
  AddOutlined,
  RemoveOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addToCart, addToCartOptimistic, updateCartItem, updateCartItemOptimistic } from "@/redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  addToWishlistOptimistic,
  removeFromWishlistOptimistic,
} from "@/redux/slices/wishlistSlice";
import { useProductStatus } from "@/hooks/useProductStatus";
import type { AppDispatch, RootState } from "@/redux/store";
import type { Product } from "@/redux/types";

interface Props {
  item: Product;
}

export default function ProductCard({ item }: Props) {
  const [isHydrated, setIsHydrated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Get authentication status and wishlist error
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const { error: wishlistError } = useSelector((state: RootState) => state.wishlist);

  // Always call the hook (Rules of Hooks compliance)
  const rawProductStatus = useProductStatus(item._id);

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Safety checks for required data
  if (!item || !item._id || !item.images || item.images.length === 0) {
    return null; // Don't render if essential data is missing
  }

  // Use hydration-safe values - show empty state during SSR/initial render
  const { isWishlisted: isInWishlist, cartItem, isInCart } = isHydrated ? rawProductStatus : {
    isWishlisted: false,
    cartItem: null,
    isInCart: false
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (isInWishlist) {
        // Optimistically remove from wishlist
        dispatch(removeFromWishlistOptimistic(item._id));
        // Call API in background
        await dispatch(removeFromWishlist(item._id)).unwrap();
      } else {
        // Optimistically add to wishlist
        dispatch(addToWishlistOptimistic(item));
        // Call API in background
        await dispatch(addToWishlist(item._id)).unwrap();
      }
    } catch (error) {
      // The optimistic change will be reverted automatically in the slice
      console.error('Wishlist operation failed:', error);
    }
  };

  const isInStock = () => {
    if (!item.stock) return false;
    return Object.values(item.stock).some(quantity => quantity > 0);
  };

  const getFirstAvailableSize = () => {
    if (!item.sizes) return 'UNIVERSAL';
    if (typeof item.sizes === 'string') return item.sizes; // Handle UNIVERSAL size
    if (!item.stock) return item.sizes[0];
    const availableSize = Object.entries(item.stock).find(([_, quantity]) => quantity > 0);
    return availableSize ? availableSize[0] : item.sizes[0];
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedSize = getFirstAvailableSize();
    const selectedColor = item.colors && item.colors.length > 0 ? item.colors[0] : 'default';

    dispatch(addToCartOptimistic({
      product: item,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    }));
    dispatch(addToCart({
      productId: item._id,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    }));
  };

  const handleUpdateQuantity = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && newQuantity > 0) {
      dispatch(updateCartItemOptimistic({
        productId: item._id,
        size: cartItem.size,
        color: cartItem.color,
        quantity: newQuantity,
        product: item
      }));
      dispatch(updateCartItem({
        productId: item._id,
        quantity: newQuantity
      }));
    }
  };

  const discountedPrice = item.price - (item.price * ((item.discount || 0) / 100));

  return (
    <div className="relative w-full bg-white shadow-sm hover:shadow-lg group transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={item.images[0]}
          alt={item.name}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 475px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />

        {/* Discount Badge */}
        {(item.discount || 0) > 0 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
            <span className="bg-red-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 font-medium">
              {item.discount || 0}% OFF
            </span>
          </div>
        )}

        {/* Stock Indicator */}
        {!isInStock() && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
            <span className="bg-gray-900 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 font-medium">
              Out of Stock
            </span>
          </div>
        )}

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex absolute top-2 sm:top-3 right-2 sm:right-3 flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleWishlist}
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-md"
            aria-label={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            type="button"
          >
            {isInWishlist ? (
              <FavoriteOutlined className="text-red-500 text-[18px] lg:text-[20px]" />
            ) : (
              <FavoriteBorderOutlined className="text-gray-700 text-[18px] lg:text-[20px]" />
            )}
          </button>
          <Link href={`/product/${item._id}`}>
            <button className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-md"
              aria-label="View Product Details"
              type="button"
            >
              <SearchOutlined className="text-gray-700 text-[18px] lg:text-[20px]" />
            </button>
          </Link>
        </div>

        {/* Desktop Quick Add to Cart / Quantity Controls */}
        <div className="hidden sm:block absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {isInCart ? (
            // Show quantity controls if item is in cart
            <div className="flex items-center justify-between bg-gray-900/95 backdrop-blur-sm text-white py-2 sm:py-2.5 lg:py-3 px-3 shadow-md">
              <button
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-700 transition-colors"
                onClick={(e) => handleUpdateQuantity(e, (cartItem?.quantity || 1) - 1)}
                disabled={(cartItem?.quantity || 1) <= 1}
                type="button"
                title="Decrease Quantity"
              >
                <RemoveOutlined className="text-[16px]" />
              </button>
              <span className="font-medium text-sm lg:text-base">
                {cartItem?.quantity || 0} in cart
              </span>
              <button
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-700 transition-colors"
                onClick={(e) => handleUpdateQuantity(e, (cartItem?.quantity || 0) + 1)}
                disabled={!isInStock()}
                type="button"
                title="Increase Quantity"
              >
                <AddOutlined className="text-[16px]" />
              </button>
            </div>
          ) : (
            // Show add to cart button if item is not in cart
            <button
              className="w-full py-2 sm:py-2.5 lg:py-3 bg-gray-900/95 backdrop-blur-sm text-white font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md text-xs sm:text-sm lg:text-base"
              aria-label="Add to Cart"
              type="button"
              onClick={handleAddToCart}
              disabled={!isInStock()}
            >
              <ShoppingCartOutlined className="text-[16px] lg:text-[18px]" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 lg:p-5">
        <Link href={`/product/${item._id}`} className="block">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-gray-700 transition-colors leading-tight">
            {item.name || 'Product Name'}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Star className="text-yellow-400 text-sm" />
            <span className="text-sm text-gray-600">{Number(item.rating || 0).toFixed(1)}</span>
            <span className="text-xs text-gray-400">({item.reviewsCount || 0})</span>
          </div>
          {(item.discount || 0) > 0 && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ₹{Number(item.price || 0).toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
            ₹{discountedPrice.toLocaleString()}
          </span>
          {!isInStock() && (
            <div className="p-1 text-xs font-medium bg-red-100 text-red-800">
              Out of Stock
            </div>
          )}
        </div>

        {/* Mobile Wishlist and Cart Controls */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            onClick={handleWishlist}
            className="flex items-center justify-center w-10 h-10 border border-gray-300 hover:border-gray-400 transition-colors"
            aria-label={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            type="button"
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {isInWishlist ? (
              <FavoriteOutlined className="text-red-500 text-[18px]" />
            ) : (
              <FavoriteBorderOutlined className="text-gray-700 text-[18px]" />
            )}
          </button>

          {isInCart ? (
            <div className="flex-1 flex items-center justify-between bg-gray-900 text-white py-2 px-3">
              <button
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-700 transition-colors"
                onClick={(e) => handleUpdateQuantity(e, (cartItem?.quantity || 1) - 1)}
                disabled={(cartItem?.quantity || 1) <= 1}
                type="button"
                title="Decrease Quantity"
              >
                <RemoveOutlined className="text-[16px]" />
              </button>
              <span className="font-medium text-sm">
                {cartItem?.quantity || 0}
              </span>
              <button
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-700 transition-colors"
                onClick={(e) => handleUpdateQuantity(e, (cartItem?.quantity || 0) + 1)}
                disabled={!isInStock()}
                type="button"
                title="Increase Quantity"
              >
                <AddOutlined className="text-[16px]" />
              </button>
            </div>
          ) : (
            <button
              className="flex-1 py-2 px-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 text-sm"
              onClick={handleAddToCart}
              disabled={!isInStock()}
              type="button"
            >
              <ShoppingCartOutlined className="text-[16px]" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}