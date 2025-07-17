"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addProduct } from "@/redux/slices/cartSlice";
import Image from "next/image";
import Navbar from "@/components/Navbar";


interface Product {
  id: string;
  img: string;
  title?: string;
  desc?: string;
  categories?: string[];
  size?: string[];
  color?: string[];
  price: number;
  createdAt?: number;
  quantity?: number;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/find/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (_err) {
        setProduct(null);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleQuantity = (type: "inc" | "dec") => {
    setQuantity((prev) => (type === "dec" ? Math.max(1, prev - 1) : prev + 1));
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addProduct({
      ...product,
      _id: product.id,
      quantity
    }));
  };

  if (!product) {
    return <main className="flex items-center justify-center min-h-[60vh]"><p className="text-lg">Loading product...</p></main>;
  }

  return (
    <>
    <Navbar />
    <main className="py-8 px-4 md:px-16 bg-black min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 max-w-6xl mx-auto">
        {/* Image Section */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-6 min-h-[350px]">
          <Image
            src={product.img}
            alt={product.title || "Product Image"}
            width={400}
            height={400}
            className="max-h-[400px] w-auto object-contain rounded-lg shadow-md"
          />
        </div>
        {/* Info Section */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-light mb-4">{product.title}</h1>
          <p className="text-base md:text-lg text-gray-700 mb-6">{product.desc}</p>
          <div className="text-2xl md:text-3xl font-thin mb-8">₹ {product.price}</div>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            {/* Color */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-light">Color</span>
              {product.color?.map((c) => (
                <button
                  key={c}
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-150 ${selectedColor === c ? 'border-black scale-110' : 'border-gray-300'} focus:outline-none`}
                  style={{ background: c }}
                  onClick={() => setSelectedColor(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
            {/* Size */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-light">Size</span>
              <select
                value={selectedSize || ''}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="ml-2 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                aria-label="Select size"
              >
                <option value="">Select size</option>
                {product.size?.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-lg font-light">Quantity</span>
              <button
                onClick={() => handleQuantity("dec")}
                type="button"
                className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-200 text-xl font-bold"
                aria-label="Decrease quantity"
              >-</button>
              <span className="w-8 text-center text-lg font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantity("inc")}
                type="button"
                className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-200 text-xl font-bold"
                aria-label="Increase quantity"
              >+</button>
            </div>
            <button
              onClick={handleAddToCart}
              type="button"
              className="mt-2 sm:mt-0 px-8 py-3 bg-black text-white font-semibold rounded shadow hover:bg-gray-900 transition-all duration-150"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
