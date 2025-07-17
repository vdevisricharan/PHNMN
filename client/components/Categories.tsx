'use client';

import React from "react";
import { categories } from "../utils/data";
import CategoryCard from "./CategoryCard";

const Categories = () => (
  <section className="py-16 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-white mb-4">SHOP BY CATEGORY</h2>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto">
        Discover our curated collections designed for every style and occasion
      </p>
    </div>
    
    <div className="flex flex-col md:flex-row gap-6 justify-center">
      {categories.map((item) => (
        <CategoryCard item={item} key={item.id} />
      ))}
    </div>
  </section>
);

export default Categories;