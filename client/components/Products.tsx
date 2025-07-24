
'use client';

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

export type Product = {
  inStock?: boolean;
  _id: string;
  title?: string;
  img: string;
  desc?: string;
  categories?: string[];
  size?: string[];
  color?: string[];
  price?: number;
  createdAt?: number;
  updatedAt?: number;
};

type ProductsProps = {
  cat?: string;
  filters?: Record<string, string>;
  sort?: string;
};

const Products = ({ cat, filters = {}, sort = "newest" }: ProductsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  
  // Fixed selector with proper default values
  const { products = [], loading = false, error = null } = useSelector(
    (state: RootState) => state.products || { products: [], loading: false, error: null }
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Show loading during hydration
  if (!isHydrated || loading) {
    return (
      <div className="flex justify-center items-center py-12 sm:py-16 lg:py-20 min-h-[300px]">
        <div className="animate-spin h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-2 sm:border-3 border-b-gray-900 border-t-transparent border-l-transparent border-r-transparent "></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-md mx-auto">
          <p className="text-red-500 text-base sm:text-lg mb-4 sm:mb-6">{error}</p>
          <button 
            onClick={() => router.refresh()} 
            className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 text-sm sm:text-base font-medium"
            type="button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Filtering
  let filteredProducts = [...products]; // Create a copy to avoid mutations
  
  if (cat) {
    filteredProducts = filteredProducts.filter((item) =>
      item.categories?.includes(cat)
    );
    filteredProducts = filteredProducts.filter((item) =>
      Object.entries(filters).every(([key, value]) => {
        const field = key as keyof Product;
        const fieldValue = item[field];
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(value);
        }
        return fieldValue === value;
      })
    );
  }

  // Sorting
  if (sort === "newest") {
    filteredProducts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } else if (sort === "asc") {
    filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else {
    filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  const displayProducts = cat ? filteredProducts : products.slice(0, 8);

  return (
    <section className="py-8 sm:py-12 lg:py-16 xl:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        {!cat && (
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">
              FEATURED PRODUCTS
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-400 max-w-xs sm:max-w-md lg:max-w-2xl mx-auto leading-relaxed">
              Discover our latest collection of premium fashion items
            </p>
          </div>
        )}
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {displayProducts.map((item) => (
            <ProductCard item={item} key={item._id} />
          ))}
        </div>
        
        {/* Empty State */}
        {displayProducts.length === 0 && (
          <div className="text-center py-16 sm:py-20 lg:py-24">
            <div className="max-w-md mx-auto px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100  flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-sm sm:text-base text-gray-500">
                No products found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;