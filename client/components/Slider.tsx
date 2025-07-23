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
  }, [isAutoPlaying]);

  // Pause auto-play on hover (desktop only)
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Handle touch events for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleClick("right");
    }
    if (isRightSwipe) {
      handleClick("left");
    }
  };

  return (
    <div
      className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen relative overflow-hidden flex group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Navigation Arrows - Hidden on mobile, shown on tablet+ */}
      <button
        className="hidden sm:flex w-10 h-10 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm items-center justify-center absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 opacity-60 sm:opacity-0 group-hover:opacity-100"
        onClick={() => handleClick("left")}
        aria-label="Previous Slide"
        type="button"
      >
        <ArrowLeftOutlined className="text-gray-800" style={{ fontSize: 16 }} />
      </button>

      {/* Slider Container */}
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${slideIndex * 100}%)` }}
      >
        {sliderItems.map((item, index) => (
          <div
            key={item.id}
            className={`w-full h-full flex flex-col lg:flex-row items-center justify-center relative bg-gradient-to-br ${item.bg} flex-shrink-0`}
          >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/20 z-10 lg:hidden"></div>

            {/* Image Section */}
            <div className="w-full lg:flex-1 h-1/2 lg:h-full relative overflow-hidden order-1 lg:order-none">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Content Section */}
            <div className="w-full lg:flex-1 h-1/2 lg:h-full p-4 sm:p-6 md:p-8 lg:p-16 flex flex-col justify-center relative z-20 bg-white/95 lg:bg-white/95 backdrop-blur-sm order-2 lg:order-none">
              <div className="max-w-lg mx-auto lg:mx-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-6 text-gray-900 leading-tight text-center lg:text-left">
                  {item.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-4 md:mb-8 leading-relaxed font-light text-center lg:text-left">
                  {item.description}
                </p>
                <div className="flex justify-center lg:justify-start">
                  <Link href={`/products/${encodeURIComponent(item.cat)}`}>
                    <button
                      className="group/btn inline-flex items-center px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      aria-label="Shop Now"
                      type="button"
                    >
                      {item.button}
                      <ArrowRightOutlined
                        className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-1 text-[16px] sm:text-[20px]"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="hidden sm:flex w-10 h-10 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm items-center justify-center absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 opacity-60 sm:opacity-0 group-hover:opacity-100"
        onClick={() => handleClick("right")}
        aria-label="Next Slide"
        type="button"
      >
        <ArrowRightOutlined className="text-gray-800" style={{ fontSize: 16 }} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 md:space-x-3 z-20">
        {sliderItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 transition-all duration-300 ${index === slideIndex
                ? 'bg-white scale-125 shadow-lg'
                : 'bg-white/50 hover:bg-white/80'
              }`}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-0.5 md:h-1 bg-white/30 w-full z-20">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${((slideIndex + 1) / sliderItems.length) * 100}%` }}
        />
      </div>

      {/* Mobile Swipe Indicator */}
      <div className="absolute top-4 right-4 z-20 sm:hidden">
        <div className="flex items-center space-x-1 text-white/80 text-xs">
          <span>Swipe</span>
          <ArrowLeftOutlined style={{ fontSize: 12 }} />
          <ArrowRightOutlined style={{ fontSize: 12 }} />
        </div>
      </div>
    </div>
  );
};

export default Slider;