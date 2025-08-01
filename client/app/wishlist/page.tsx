"use client";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

export default function WishlistPage() {
  const { items, isFetching } = useSelector((state: RootState) => state.wishlist);

  if (isFetching && items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="bg-gradient-to-br from-gray-50 to-white min-h-screen py-8 px-2 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-light mb-8 uppercase text-center text-black">Wishlist</h1>
            <div className="flex justify-center py-20">
              <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-gray-50 to-white min-h-screen py-8 px-2 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-light mb-8 uppercase text-center text-black">Wishlist</h1>
          {items.length === 0 ? (
            <div className="text-center text-gray-500 text-lg py-20">Your wishlist is empty.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {items.map((item, index) => (
                item.productId ? (
                  <ProductCard 
                    key={`wishlist-${item.productId._id || index}`} 
                    item={item.productId} 
                  />
                ) : null
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
