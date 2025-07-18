'use client';

import React, { useState, useEffect } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@mui/icons-material";
import { sliderItems } from "../utils/data";
import Image from "next/image";
import Link from "next/link";

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handleClick = (direction: "left" | "right") => {
    if (direction === "left") {
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : sliderItems.length - 1);
    } else {
      setSlideIndex(slideIndex < sliderItems.length - 1 ? slideIndex + 1 : 0);
    }
  };

  const goToSlide = (index: number) => {
    setSlideIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setSlideIndex((prev) => (prev < sliderItems.length - 1 ? prev + 1 : 0));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, sliderItems.length]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div 
      className="w-full h-screen relative overflow-hidden hidden md:flex group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navigation Arrows */}
      <button
        className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center absolute left-6 top-1/2 -translate-y-1/2 z-20 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
        onClick={() => handleClick("left")}
        aria-label="Previous Slide"
        type="button"
      >
        <ArrowLeftOutlined className="text-gray-800" style={{ fontSize: 20 }} />
      </button>

      {/* Slider Container */}
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${slideIndex * 100}%)` }}
      >
        {sliderItems.map((item, index) => (
          <div
            key={item.id}
            className={`w-full h-screen flex items-center justify-center relative bg-gradient-to-br ${item.bg} flex-shrink-0`}
          >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            
            {/* Image Section */}
            <div className="flex-1 h-full relative overflow-hidden">
              <Image 
                src={item.image_url} 
                alt={item.title} 
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority={index === 0}
              />
            </div>
            
            {/* Content Section */}
            <div className="flex-1 p-16 flex flex-col justify-center relative z-20 bg-white/95 backdrop-blur-sm">
              <div className="max-w-lg">
                <h1 className="text-6xl font-bold mb-6 text-gray-900 leading-tight">
                  {item.title}
                </h1>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed font-light">
                  {item.description}
                </p>
                <Link href={`/products/${encodeURIComponent(item.cat)}`}>
                  <button
                    className="group/btn inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    aria-label="Shop Now"
                    type="button"
                  >
                    {item.button}
                    <ArrowRightOutlined className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center absolute right-6 top-1/2 -translate-y-1/2 z-20 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
        onClick={() => handleClick("right")}
        aria-label="Next Slide"
        type="button"
      >
        <ArrowRightOutlined className="text-gray-800" style={{ fontSize: 20 }} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {sliderItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === slideIndex 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full z-20">
        <div 
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${((slideIndex + 1) / sliderItems.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Slider;