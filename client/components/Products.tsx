
'use client';

import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setFilters, setSort, clearFilters } from "@/redux/slices/productsSlice";
import { useRouter } from "next/navigation";
import type { ProductFilters, ProductSort } from "@/redux/types";

type ProductsProps = {
  category?: string;
  filters?: {
    sizes?: string[];
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
  };
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating-desc';
};

const Products = ({ category, filters: propFilters = {}, sort: propSort = "newest" }: ProductsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { 
    products, 
    filteredProducts, 
    filters: reduxFilters,
    sort: reduxSort,
    isFetching, 
    error 
  } = useSelector((state: RootState) => state.products);

  // Memoize the filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => {
    return propFilters;
  }, [
    JSON.stringify(propFilters.colors || []),
    JSON.stringify(propFilters.sizes || []),
    propFilters.minPrice,
    propFilters.maxPrice
  ]);

  // Memoize the sort value
  const memoizedSort = useMemo(() => {
    return propSort;
  }, [propSort]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Apply filters from props when they change
  useEffect(() => {
    if (!isHydrated) return;

    const newFilters: ProductFilters = {};
    
    if (category) {
      newFilters.category = [category];
    }
    
    if (memoizedFilters.colors && memoizedFilters.colors.length > 0) {
      newFilters.colors = memoizedFilters.colors;
    }
    
    if (memoizedFilters.sizes && memoizedFilters.sizes.length > 0) {
      newFilters.sizes = memoizedFilters.sizes;
    }
    
    if (memoizedFilters.minPrice !== undefined || memoizedFilters.maxPrice !== undefined) {
      newFilters.priceRange = {
        min: memoizedFilters.minPrice || 0,
        max: memoizedFilters.maxPrice || 999999
      };
    }

    // Only dispatch if filters have actually changed
    const filtersChanged = JSON.stringify(newFilters) !== JSON.stringify(reduxFilters);
    if (filtersChanged) {
      dispatch(setFilters(newFilters));
    }
  }, [dispatch, category, memoizedFilters, reduxFilters, isHydrated]);

  // Apply sort from props when it changes
  useEffect(() => {
    if (!isHydrated) return;

    let sortConfig: ProductSort;
    
    switch (memoizedSort) {
      case 'price-asc':
        sortConfig = { field: 'price', direction: 'asc' };
        break;
      case 'price-desc':
        sortConfig = { field: 'price', direction: 'desc' };
        break;
      case 'rating-desc':
        sortConfig = { field: 'rating', direction: 'desc' };
        break;
      case 'newest':
      default:
        sortConfig = { field: 'createdAt', direction: 'desc' };
        break;
    }

    // Only dispatch if sort has actually changed
    const sortChanged = JSON.stringify(sortConfig) !== JSON.stringify(reduxSort);
    if (sortChanged) {
      dispatch(setSort(sortConfig));
    }
  }, [dispatch, memoizedSort, reduxSort, isHydrated]);

  // Show loading during hydration or when products are not yet loaded
  if (!isHydrated || (products.length === 0 && isFetching)) {
    return (
      <div className="flex justify-center items-center py-12 sm:py-16 lg:py-20 min-h-[300px]">
        <div className="animate-spin h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-2 sm:border-3 border-b-gray-900 border-t-transparent border-l-transparent border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
        <div className="max-w-md mx-auto">
          <p className="text-red-500 text-base sm:text-lg mb-4 sm:mb-6">{error}</p>
          <p className="text-sm text-gray-600">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  // Use filtered products from Redux store, or fallback to featured products for homepage
  const displayProducts = category 
    ? filteredProducts 
    : filteredProducts.filter(p => p.isFeatured).slice(0, 8);

  return (
    <section className="py-8 sm:py-12 lg:py-16 xl:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        {!category && (
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">
              FEATURED PRODUCTS
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-400 max-w-xs sm:max-w-md lg:max-w-2xl mx-auto leading-relaxed">
              Discover our latest collection of premium fashion items
            </p>
          </div>
        )}

        {/* Filter Summary */}
        {category && Object.keys(reduxFilters).length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Active filters:</span>
            {reduxFilters.colors?.map(color => (
              <span
                key={`color-${color}`}
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1"
              >
                <span>Color:</span>
                <span className="font-semibold">{color.replace(/-/g, ' ')}</span>
              </span>
            ))}
            {reduxFilters.sizes?.map(size => (
              <span
                key={`size-${size}`}
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1"
              >
                <span>Size:</span>
                <span className="font-semibold">{size}</span>
              </span>
            ))}
            {reduxFilters.priceRange && (
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1">
                <span>Price:</span>
                <span className="font-semibold">
                  ₹{reduxFilters.priceRange.min.toLocaleString()} - ₹{reduxFilters.priceRange.max.toLocaleString()}
                </span>
              </span>
            )}
            <button
              onClick={() => dispatch(clearFilters())}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              type="button"
            >
              Clear all filters
            </button>
          </div>
        )}
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {displayProducts.map((item) => (
            <ProductCard item={item} key={item._id} />
          ))}
        </div>
        
        {/* Empty State */}
        {displayProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-16 sm:py-20 lg:py-24">
            <div className="max-w-md mx-auto px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">
                No products found matching your criteria. Try adjusting your filters.
              </p>
              {Object.keys(reduxFilters).length > 0 && (
                <button
                  onClick={() => dispatch(clearFilters())}
                  className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium"
                  type="button"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        {category && displayProducts.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Showing {displayProducts.length} of {filteredProducts.length} products
            {Object.keys(reduxFilters).length > 0 && (
              <span> (filtered from {products.length} total)</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;