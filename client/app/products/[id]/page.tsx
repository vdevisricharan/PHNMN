"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Products from "@/components/Products";

const COLORS = ["White", "Black", "Red", "Blue", "Multi", "Mud"];
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductsPage() {
  const params = useParams();
  console.log(params);
  const cat = params.id as string;
  const [filters, setFilters] = useState({} as Record<string, string>);
  const [sort, setSort] = useState("newest");

  const handleFilters = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      [e.target.name]: value,
    });
  };

  return (
    <>
      <Navbar />
      <main className="bg- min-h-screen py-8 px-2 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-light mb-8 uppercase text-center">{cat}</h1>
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-8">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <span className="text-lg font-semibold mr-2">Filter Products:</span>
              <select
                name="color"
                onChange={handleFilters}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                defaultValue=""
                title="Select color"
              >
                <option value="" disabled>Color</option>
                {COLORS.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              <select
                name="size"
                onChange={handleFilters}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                defaultValue=""
                title="Select size"
              >
                <option value="" disabled>Size</option>
                {SIZES.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold mr-2">Sort Products:</span>
              <select
                onChange={e => setSort(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                value={sort}
                title="Sort products"
              >
                <option value="newest">Newest</option>
                <option value="asc">Price (asc)</option>
                <option value="desc">Price (desc)</option>
              </select>
            </div>
          </div>
          <Products cat={cat} filters={filters} sort={sort} />
        </div>
      </main>
    </>
  );
} 