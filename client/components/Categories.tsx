
'use client';

import React from "react";
import { categories } from "../utils/data";
import CategoryCard from "./CategoryCard";

const Categories = () => (
  <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
    <div className="text-center mb-8 sm:mb-10 md:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
        SHOP BY CATEGORY
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
        Discover our curated collections designed for every style and occasion
      </p>
    </div>
    
    {/* Mobile: Single column, Tablet: 2 columns, Desktop: 3+ columns based on category count */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
      {categories.map((item) => (
        <CategoryCard item={item} key={item.id} />
      ))}
    </div>
  </section>
);

export default Categories;