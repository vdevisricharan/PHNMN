"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "@/redux/slices/cartSlice";
import type { RootState } from "@/redux/store";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useSelector((state: RootState) => state.products);
  const product = products.find((p) => p._id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      setSelectedColor(product.color?.[0]);
      setSelectedSize(product.size?.[0]);
    }
  }, [product]);

  const handleQuantity = (type: "inc" | "dec") => {
    setQuantity((prev) => (type === "dec" ? Math.max(1, prev - 1) : prev + 1));
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addProduct({
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    }));
    
    // Show success feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-xl font-light text-gray-600">Loading product...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-xl font-light text-gray-600">Product not found.</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              
              {/* Image Section */}
              <div className="relative group">
                <div className="aspect-square bg-white shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500 group-hover:shadow-3xl group-hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white pointer-events-none"></div>
                  <div className="relative h-full flex items-center justify-center p-8">
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-pulse bg-gray-200 w-full h-full"></div>
                      </div>
                    )}
                    <Image
                      src={product.img}
                      alt={product.title || "Product Image"}
                      width={500}
                      height={500}
                      className={`max-h-full w-auto object-contain transition-opacity duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      priority
                    />
                  </div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-black text-white px-4 py-2 text-sm font-medium shadow-lg">
                  New Arrival
                </div>
              </div>

              {/* Product Info Section */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-light text-gray-900 leading-tight">
                    {product.title}
                  </h1>
                  <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                    {product.desc}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl lg:text-4xl font-light text-gray-900">
                    {typeof product.price === 'number'
                      ? `₹${product.price.toLocaleString()}`
                      : 'Price not available'}
                  </span>
                </div>

                {/* Color Selection */}
                {product.color && product.color.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Color: <span className="font-light capitalize">{selectedColor}</span>
                    </h3>
                    <div className="flex gap-3">
                      {product.color.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 border-2 transition-all duration-200 ${
                            selectedColor === color
                              ? 'border-black scale-110 shadow-lg'
                              : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Select color ${color}`}
                          type="button"
                        >
                          {selectedColor === color && (
                            <div className="w-full h-full border-2 border-white flex items-center justify-center">
                              <div className="w-2 h-2 bg-white"></div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {product.size && product.size.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Size: <span className="font-light">{selectedSize}</span>
                    </h3>
                    <div className="flex gap-3 flex-wrap">
                      {product.size.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border-2 transition-all duration-200 font-medium ${
                            selectedSize === size
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 text-black hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Add to Cart */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-medium text-gray-900">Quantity:</span>
                    <div className="flex items-center bg-white border border-gray-300 overflow-hidden">
                      <button
                        onClick={() => handleQuantity("dec")}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200 text-gray-600 font-medium"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 text-black text-lg font-medium bg-gray-50 border-x border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantity("inc")}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200 text-gray-600 font-medium"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-full px-8 py-4 text-lg font-semibold transition-all duration-300 transform ${
                      addedToCart
                        ? 'bg-green-500 text-white scale-95'
                        : 'bg-black text-white hover:bg-gray-900 hover:scale-[1.02] active:scale-95'
                    } shadow-lg hover:shadow-xl`}
                  >
                    {addedToCart ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart!
                      </span>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free shipping over ₹2000
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    30-day return policy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}