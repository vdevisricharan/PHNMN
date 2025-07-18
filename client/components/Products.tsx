'use client';

import React from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

// {
//     "inStock": true,
//     "_id": "68779180bfa0b20577932f77",
//     "title": "BLACK DENIM CARGO 01",
//     "desc": "",
//     "img": "https://assets.therowdy.club/1733981773276BlackCargo.jpg",
//     "categories": [
//         "JEANS",
//         "BOTTOM-WEAR"
//     ],
//     "size": [
//         "28",
//         "30",
//         "32",
//         "34",
//         "36",
//         "38"
//     ],
//     "color": [
//         "BLACK"
//     ],
//     "price": 2490
// }

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
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  console.log(cat);
  // Filtering
  let filteredProducts = products;
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
    filteredProducts = [...filteredProducts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } else if (sort === "asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => (a.price || 0) - (b.price || 0));
  } else {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          type="button"
        >
          Try Again
        </button>
      </div>
    );
  }

  const displayProducts = cat ? filteredProducts : products.slice(0, 8);

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {!cat && (
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{cat || "FEATURED PRODUCTS"}</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover our latest collection of premium fashion items
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayProducts.map((item) => (
          <ProductCard item={item} key={item._id} />
        ))}
      </div>
      
      {displayProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </section>
  );
};

export default Products;