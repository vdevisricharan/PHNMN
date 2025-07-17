'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";

type CategoryCardProps = {
  item: {
    id: number;
    img: string;
    title: string;
    cat: string;
  };
};

const CategoryCard = ({ item }: CategoryCardProps) => (
  <div className="flex-1 relative h-[70vh] m-2 overflow-hidden shadow-xl group cursor-pointer">
    <Link href={`/products/${item.cat}`}>
      <div className="relative w-full h-full">
        <Image
          src={item.img}
          alt={item.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-6 tracking-wide transform transition-all duration-500 group-hover:scale-105">
            {item.title}
          </h1>
          
          <button className="px-8 py-3 bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white/20">
            SHOP NOW
          </button>
        </div>
        
        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 transition-all duration-500" />
      </div>
    </Link>
  </div>
);

export default CategoryCard;