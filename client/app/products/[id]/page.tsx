//products/[id]/page.tsx
"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Products from "@/components/Products";
import Footer from "@/components/Footer";

const COLORS = ["White", "Black", "Red", "Blue", "Multi", "Mud"];
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductsPage() {
  const params = useParams();
  const cat = params.id as string;
  const [filters, setFilters] = useState({} as Record<string, string>);
  const [sort, setSort] = useState("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleFilters = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      [e.target.name]: value,
    });
  };

  const clearFilters = () => {
    setFilters({});
    // Reset select elements
    const selects = document.querySelectorAll('select[name="color"], select[name="size"]') as NodeListOf<HTMLSelectElement>;
    selects.forEach(select => select.value = "");
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center">
              <h1 className="text-4xl font-extralight tracking-wider uppercase mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {cat}
              </h1>
              <div className="h-1 w-24 bg-white mx-auto"></div>
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
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                
                {/* Filter Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.586V4z" />
                      </svg>
                      <span className="text-lg font-semibold text-gray-900">Filters</span>
                    </div>
                    
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Color Filter */}
                    <div className="relative">
                      <select
                        name="color"
                        onChange={handleFilters}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-3 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-100 transition-all duration-200"
                        defaultValue=""
                        title="Select color"
                      >
                        <option value="" disabled>Choose Color</option>
                        {COLORS.map((color) => (
                          <option key={color} value={color} className="py-2">{color}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Size Filter */}
                    <div className="relative">
                      <select
                        name="size"
                        onChange={handleFilters}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-3 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-100 transition-all duration-200"
                        defaultValue=""
                        title="Select size"
                      >
                        <option value="" disabled>Choose Size</option>
                        {SIZES.map((size) => (
                          <option key={size} value={size} className="py-2">{size}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-16 bg-gray-200"></div>
                <div className="lg:hidden h-px bg-gray-200"></div>

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
                      onChange={e => setSort(e.target.value)}
                      className="w-full appearance-none bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-4 py-3 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                      value={sort}
                      title="Sort products"
                    >
                      <option value="newest">✨ Newest First</option>
                      <option value="asc">💰 Price: Low to High</option>
                      <option value="desc">💎 Price: High to Low</option>
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

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Active filters:</span>
                {Object.entries(filters).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1"
                  >
                    <span className="capitalize">{key}:</span>
                    <span className="font-semibold">{value}</span>
                    <button
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[key];
                        setFilters(newFilters);
                        // Reset the specific select
                        const select = document.querySelector(`select[name="${key}"]`) as HTMLSelectElement;
                        if (select) select.value = "";
                      }}
                      className="hover:bg-blue-200 p-0.5 transition-colors duration-200"
                      type="button"
                      aria-label={`Remove filter for ${key}`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Products Component */}
          <div className="transition-all duration-300 ease-in-out">
            <Products cat={cat} filters={filters} sort={sort} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}