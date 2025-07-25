'use client';

import React from "react";
import Link from "next/link";
import {
  FavoriteBorderOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  FavoriteOutlined,
  Star,
} from "@mui/icons-material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import type { Product } from "@/redux/types";

interface Props {
  item: Product;
}

export default function ProductCard({ item }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isInWishlist = wishlistItems.some(wishlistItem => wishlistItem.productId._id === item._id);

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(item._id));
    } else {
      dispatch(addToWishlist(item._id));
    }
  };

  const isInStock = () => {
    if (!item.stock) return false;
    return Object.values(item.stock).some(quantity => quantity > 0);
  };

  const getFirstAvailableSize = () => {
    if (typeof item.sizes === 'string') return item.sizes; // Handle UNIVERSAL size
    if (!item.stock) return item.sizes[0];
    const availableSize = Object.entries(item.stock).find(([_, quantity]) => quantity > 0);
    return availableSize ? availableSize[0] : item.sizes[0];
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedSize = getFirstAvailableSize();
    const selectedColor = item.colors[0];
    
    dispatch(addToCart({
      productId: item._id,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    }));
  };

  const discountedPrice = item.price - (item.price * (item.discount / 100));

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
        {item.discount > 0 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
            <span className="bg-red-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 font-medium">
              {item.discount}% OFF
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
        
        {/* Desktop Quick Add to Cart */}
        <div className="hidden sm:block absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
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
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-3 sm:p-4 lg:p-5">
        <Link href={`/product/${item._id}`} className="block">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-gray-700 transition-colors leading-tight">
            {item.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Star className="text-yellow-400 text-sm" />
            <span className="text-sm text-gray-600">{Number(item.rating).toFixed(1)}</span>
            <span className="text-xs text-gray-400">({item.reviewsCount})</span>
          </div>
          {item.discount > 0 && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ₹{Number(item.price).toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
            ₹{discountedPrice.toLocaleString()}
          </span>
          {!isInStock() && (
            <div className="p-1 text-xs font-medium bg-red-100 text-red-800">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}