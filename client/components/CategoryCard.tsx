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
  <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden shadow-lg hover:shadow-2xl group cursor-pointer transition-all duration-300">
    <Link href={`/products/${item.cat}`}>
      <div className="relative w-full h-full">
        <Image
          src={item.img}
          alt={item.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-all duration-500" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8">
          <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-wide transform transition-all duration-500 group-hover:scale-105 leading-tight">
            {item.title}
          </h1>
          
          <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-white text-gray-900 text-xs sm:text-sm md:text-base font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
            SHOP NOW
          </button>
        </div>
        
        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/40 transition-all duration-500" />
      </div>
    </Link>
  </div>
);

export default CategoryCard;