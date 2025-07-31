'use client';

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { clearFilters } from "@/redux/slices/productsSlice";

type ProductsProps = {
  category?: string;
};

const Products = ({ category }: ProductsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  const { 
    products, 
    filteredProducts, 
    filters: reduxFilters,
    sort: reduxSort,
    isFetching, 
    error 
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  // FIXED: Use filtered products from Redux store
  // For homepage (no category), show featured products
  // For category pages, show all filtered products
  const displayProducts = !category 
    ? filteredProducts.filter(p => p.isFeatured).slice(0, 8)
    : filteredProducts;

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
            
            {/* Category Filter (usually automatic, but show if present) */}
            {reduxFilters.category?.map(cat => (
              <span
                key={`category-${cat}`}
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1"
              >
                <span>Category:</span>
                <span className="font-semibold">{cat}</span>
              </span>
            ))}
            
            {/* Color Filters */}
            {reduxFilters.colors?.map(color => (
              <span
                key={`color-${color}`}
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1"
              >
                <span>Color:</span>
                <span className="font-semibold">{color.replace(/-/g, ' ')}</span>
              </span>
            ))}
            
            {/* Size Filters */}
            {reduxFilters.sizes?.map(size => (
              <span
                key={`size-${size}`}
                className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-medium px-3 py-1"
              >
                <span>Size:</span>
                <span className="font-semibold">{size}</span>
              </span>
            ))}
            
            {/* Price Range Filter */}
            {reduxFilters.priceRange && (
              <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1">
                <span>Price:</span>
                <span className="font-semibold">
                  ₹{reduxFilters.priceRange.min.toLocaleString()} - ₹{reduxFilters.priceRange.max.toLocaleString()}
                </span>
              </span>
            )}
            
            {/* Rating Filter */}
            {reduxFilters.rating && (
              <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1">
                <span>Rating:</span>
                <span className="font-semibold">{reduxFilters.rating}+ ⭐</span>
              </span>
            )}
            
            {/* In Stock Filter */}
            {reduxFilters.inStock && (
              <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1">
                <span className="font-semibold">In Stock Only</span>
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

        {/* Sort Summary */}
        {category && reduxSort && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <span>Sorted by:</span>
            <span className="font-medium">
              {reduxSort.field === 'price' && `Price (${reduxSort.direction === 'asc' ? 'Low to High' : 'High to Low'})`}
              {reduxSort.field === 'rating' && 'Best Rated'}
              {reduxSort.field === 'name' && `Name (${reduxSort.direction === 'asc' ? 'A to Z' : 'Z to A'})`}
              {reduxSort.field === 'createdAt' && 'Newest First'}
            </span>
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