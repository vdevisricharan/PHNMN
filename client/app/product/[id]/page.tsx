"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star } from "@mui/icons-material";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products, isFetching } = useSelector((state: RootState) => state.products);
  const product = products.find((p) => p._id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      if (product.colors.length > 0) setSelectedColor(product.colors[0]);
      if (typeof product.sizes === 'string') {
        setSelectedSize(product.sizes);
      } else if (Array.isArray(product.sizes) && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.images.length > 0) setSelectedImage(product.images[0]);
    }
  }, [product]);

  const handleQuantity = (type: "inc" | "dec") => {
    setQuantity((prev) => {
      const newQuantity = type === "dec" ? prev - 1 : prev + 1;
      if (!product || !selectedSize) return prev;
      const maxStock = product.stock[selectedSize] || 0;
      return Math.min(Math.max(1, newQuantity), maxStock);
    });
  };

  const getAvailableStock = (size: string) => {
    if (!product?.stock) return 0;
    return product.stock[size] || 0;
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    
    const stockForSize = getAvailableStock(selectedSize);
    if (stockForSize < quantity) {
      alert(`Sorry, only ${stockForSize} items available in size ${selectedSize}`);
      return;
    }

    dispatch(addToCart({
      productId: product._id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    }));
    
    // Show success feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isFetching) {
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

  const discountedPrice = product.price - (product.price * (product.discount / 100));

  // Helper function to handle size rendering
  const renderSizes = () => {
    const sizes = typeof product.sizes === 'string' ? [product.sizes] : product.sizes;
    return sizes.map((size: string) => {
      const stock = getAvailableStock(size);
      const isOutOfStock = stock === 0;
      
      return (
        <button
          key={size}
          type="button"
          onClick={() => {
            if (!isOutOfStock) {
              setSelectedSize(size);
              // Reset quantity if current quantity exceeds new size's stock
              if (quantity > stock) {
                setQuantity(1);
              }
            }
          }}
          disabled={isOutOfStock}
          className={`
            px-4 py-2 border-2 transition-all duration-200 font-medium
            ${isOutOfStock 
              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              : selectedSize === size
                ? 'border-black bg-black text-white'
                : 'border-gray-300 text-black hover:border-gray-400 hover:bg-gray-50'
            }
          `}
        >
          {size}
          {isOutOfStock && <span className="block text-xs">Out of stock</span>}
        </button>
      );
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              
              {/* Image Section */}
              <div className="space-y-6">
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
                        src={selectedImage || product.images[0]}
                        alt={product.name}
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
                  
                  {/* Discount badge */}
                  {product.discount > 0 && (
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 text-sm font-medium shadow-lg">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`aspect-square bg-white border-2 transition-all duration-200 ${
                          selectedImage === img
                            ? 'border-black shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        type="button"
                        title="Select this image"
                      >
                        <Image
                          src={img}
                          alt={`${product.name} view ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-light text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                    {product.description}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={index < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviewsCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl lg:text-4xl font-light text-gray-900">
                    ₹{discountedPrice.toLocaleString()}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Color Selection */}
                {product.colors.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Color: <span className="font-light capitalize">{selectedColor}</span>
                    </h3>
                    <div className="flex gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 border-2 transition-all duration-200 ${
                            selectedColor === color
                              ? 'border-black scale-110 shadow-lg'
                              : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.toLowerCase() }}
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
                {(typeof product.sizes === 'string' || product.sizes.length > 0) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Size: <span className="font-light">{selectedSize}</span>
                    </h3>
                    <div className="flex gap-3 flex-wrap">
                      {renderSizes()}
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
                        className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 text-black text-lg font-medium bg-gray-50 border-x border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantity("inc")}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedSize ? quantity >= getAvailableStock(selectedSize) : true}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    {selectedSize && (
                      <span className="text-sm text-gray-600">
                        ({getAvailableStock(selectedSize)} available)
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart || !selectedSize || !selectedColor || getAvailableStock(selectedSize!) === 0}
                    className={`w-full px-8 py-4 text-lg font-semibold transition-all duration-300 transform ${
                      addedToCart
                        ? 'bg-green-500 text-white scale-95'
                        : !selectedSize || !selectedColor || getAvailableStock(selectedSize!) === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                    ) : !selectedSize || !selectedColor ? (
                      'Select size and color'
                    ) : getAvailableStock(selectedSize) === 0 ? (
                      'Out of Stock'
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
                    Free shipping over ₹1000
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
      <Footer />
    </>
  );
}