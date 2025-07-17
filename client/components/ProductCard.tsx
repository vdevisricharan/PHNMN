'use client';

import React, { useState } from "react";
import Link from "next/link";
import {
  FavoriteBorderOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addProduct } from "@/redux/slices/cartSlice";
import type { Product } from "./Products";

interface ProductCardProps {
  item: Product;
}

const ProductCard = ({ item }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const dispatch = useDispatch();

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = () => {
    dispatch(addProduct({
      ...item,
      quantity: 1,
      selectedColor: Array.isArray(item.color) ? item.color[0] : undefined,
      selectedSize: Array.isArray(item.size) ? item.size[0] : undefined,
    }));
  };

  return (
    <div className="relative w-full max-w-sm bg-white shadow-lg group hover:shadow-2xl transition-all duration-500 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={item.img}
          alt={item.title || "Product"}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleWishlist}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
            aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            type="button"
          >
            {isWishlisted ? (
              <FavoriteOutlined className="text-red-500" style={{ fontSize: 20 }} />
            ) : (
              <FavoriteBorderOutlined className="text-gray-700" style={{ fontSize: 20 }} />
            )}
          </button>
          <Link href={`/product/${item._id}`}>
            <button className="w-12 h-12 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
              aria-label="View Product Details"
              type="button"
            >
              <SearchOutlined className="text-gray-700" style={{ fontSize: 20 }} />
            </button>
          </Link>
        </div>
        {/* Quick Add to Cart Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button className="w-full py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            aria-label="Add to Cart"
            type="button"
            onClick={handleAddToCart}
          >
            <ShoppingCartOutlined style={{ fontSize: 18 }} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {item.title || "Product Name"}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            ₹{item.price || "99.99"}
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold text-gray-400">
              {item.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;