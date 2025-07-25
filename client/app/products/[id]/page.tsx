//products/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { 
  fetchProducts, 
  setFilters, 
  setSort, 
  clearFilters, 
  searchProducts, 
  updateFilters 
} from "@/redux/slices/productsSlice";
import Navbar from "@/components/Navbar";
import Products from "@/components/Products";
import Footer from "@/components/Footer";
import type { ProductFilters, ProductSort } from "@/redux/types";

// Updated colors from the products dump
const COLORS = [
  "BLACK", "WHITE", "BLUE", "RED", "GREEN", "YELLOW", "BROWN", "GRAY", "IVORY",
  "DEEP-BLUE", "OLIVE-GREEN", "SAGE-GREEN", "CORAL", "PEARL", "DEEP-COCOA",
  "COASTAL-NAVY", "OLIVE-FOG", "IVORY-DUNE", "DUSTY-PLUM", "STORM-BLUE",
  "SLATE-SHADOW", "RUST-EMBER", "CLASSIC-BLUE", "SAND-DUNE", "MIDNIGHT",
  "TWILIGHT", "SUNFADED-BLACK", "DENIM-BLUE", "FOREST-GREEN", "BRICKRED",
  "LIME-GREEN", "LAVENDER", "GRAPE-PURPLE"
];

// Updated sizes from the products dump
const SIZES = [
  "XS", "S", "M", "L", "XL", "XXL",  // For clothes
  "28", "30", "32", "34", "36", "38", // For pants
  "UNIVERSAL" // For accessories
];

const PRICE_RANGES = [
  { min: 0, max: 1000, label: "Under ₹1,000" },
  { min: 1000, max: 2500, label: "₹1,000 - ₹2,500" },
  { min: 2500, max: 5000, label: "₹2,500 - ₹5,000" },
  { min: 5000, max: 10000, label: "₹5,000 - ₹10,000" },
  { min: 10000, max: undefined, label: "Above ₹10,000" }
];

// Main categories from the products dump
const CATEGORIES = [
  "TOP-WEAR",
  "BOTTOM-WEAR",
  "ACCESSORIES",
  "SUMMER",
  "AUTUMN-WINTER"
];

export default function ProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  
  const category = params.id as string;
  const searchQuery = searchParams.get('search') || '';
  
  const { filters, sort, filteredProducts, isFetching } = useSelector((state: RootState) => state.products);
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Initialize search on mount
  useEffect(() => {
    if (searchQuery) {
      dispatch(searchProducts(searchQuery));
    }
  }, [dispatch, searchQuery]);

  const handleFilterChange = (key: keyof ProductFilters, value: string | string[] | { min: number; max: number }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      const newFilters = { ...filters };
      delete newFilters[key];
      dispatch(setFilters(newFilters));
    } else {
      dispatch(updateFilters({ [key]: value }));
    }
  };

  const handleColorFilter = (color: string) => {
    const currentColors = filters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    
    handleFilterChange('colors', newColors.length > 0 ? newColors : []);
  };

  const handleSizeFilter = (size: string) => {
    const currentSizes = filters.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    
    handleFilterChange('sizes', newSizes.length > 0 ? newSizes : []);
  };

  const handlePriceRange = (range: string) => {
    if (range === "") {
      const newFilters = { ...filters };
      delete newFilters.priceRange;
      dispatch(setFilters(newFilters));
    } else {
      const [min, max] = range.split("-").map(Number);
      handleFilterChange('priceRange', {
        min: min,
        max: max || 999999
      });
    }
  };

  const handleSortChange = (sortValue: string) => {
    let sortConfig: ProductSort;
    
    switch (sortValue) {
      case 'price-asc':
        sortConfig = { field: 'price', direction: 'asc' };
        break;
      case 'price-desc':
        sortConfig = { field: 'price', direction: 'desc' };
        break;
      case 'rating-desc':
        sortConfig = { field: 'rating', direction: 'desc' };
        break;
      case 'name-asc':
        sortConfig = { field: 'name', direction: 'asc' };
        break;
      case 'newest':
      default:
        sortConfig = { field: 'createdAt', direction: 'desc' };
        break;
    }

    dispatch(setSort(sortConfig));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  // Get available sizes based on category
  const getAvailableSizes = () => {
    if (category.includes("BOTTOM")) {
      return SIZES.filter(size => !isNaN(Number(size)));
    } else if (category.includes("ACCESSORIES")) {
      return ["UNIVERSAL"];
    } else {
      return SIZES.filter(size => isNaN(Number(size)) && size !== "UNIVERSAL");
    }
  };

  const getSortValueFromRedux = () => {
    if (!sort) return 'newest';
    
    if (sort.field === 'price') {
      return sort.direction === 'asc' ? 'price-asc' : 'price-desc';
    } else if (sort.field === 'rating') {
      return 'rating-desc';
    } else if (sort.field === 'name') {
      return 'name-asc';
    }
    
    return 'newest';
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center">
              <h1 className="text-4xl font-extralight tracking-wider uppercase mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {searchQuery ? `Search: "${searchQuery}"` : category}
              </h1>
              <div className="h-1 w-24 bg-white mx-auto"></div>
              {searchQuery && (
                <p className="text-gray-300 mt-4">
                  Found {filteredProducts.length} result(s) for "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              type="button"
              aria-label="Toggle filters and sort"
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 px-4 shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.586V4z" />
              </svg>
              Filters & Sort
              <svg className={`w-4 h-4 transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Filter and Sort Controls */}
          <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block mb-8`}>
            <div className="bg-white shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                
                {/* Filter Section */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.586V4z" />
                      </svg>
                      <span className="text-lg font-semibold text-gray-900">Filters</span>
                    </div>
                    
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        aria-label="Clear all filters"
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Color Filters */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.slice(0, 10).map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorFilter(color)}
                          className={`px-3 py-1 text-xs font-medium border transition-all duration-200 ${
                            filters.colors?.includes(color)
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                          }`}
                          type="button"
                        >
                          {color.replace(/-/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Filters */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {getAvailableSizes().map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeFilter(size)}
                          className={`px-3 py-1 text-xs font-medium border transition-all duration-200 ${
                            filters.sizes?.includes(size)
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                          }`}
                          type="button"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRICE_RANGES.map((range, index) => (
                        <button
                          key={index}
                          onClick={() => handlePriceRange(`${range.min}-${range.max || ''}`)}
                          className={`px-3 py-2 text-sm font-medium border transition-all duration-200 text-left ${
                            filters.priceRange && 
                            filters.priceRange.min === range.min && 
                            filters.priceRange.max === (range.max || 999999)
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                          }`}
                          type="button"
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-40 bg-gray-200 mx-8"></div>

                {/* Sort Section */}
                <div className="lg:w-80">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0H8v0z" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">Sort by</span>
                  </div>
                  
                  <div className="relative">
                    <select
                      onChange={e => handleSortChange(e.target.value)}
                      className="w-full appearance-none bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-4 py-3 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                      value={getSortValueFromRedux()}
                      title="Sort products"
                    >
                      <option value="newest">✨ Newest First</option>
                      <option value="price-asc">💰 Price: Low to High</option>
                      <option value="price-desc">💎 Price: High to Low</option>
                      <option value="rating-desc">⭐ Best Rated</option>
                      <option value="name-asc">🔤 Name: A to Z</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Component */}
          <div className="transition-all duration-300 ease-in-out">
            <Products 
              category={searchQuery ? undefined : category} 
              filters={{}} 
              sort={getSortValueFromRedux() as any}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}