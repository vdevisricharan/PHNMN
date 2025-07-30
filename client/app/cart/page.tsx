"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState, AppDispatch } from "@/redux/store";
import type { CartItemPopulated } from "@/redux/types";
import { updateCartItem, removeFromCart, updateCartItemOptimistic, removeFromCartOptimistic } from "@/redux/slices/cartSlice";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import {
  DeleteOutlined,
  AddOutlined,
  RemoveOutlined,
  ShoppingBagOutlined,
  LocalShippingOutlined,
  SecurityOutlined,
  ArrowBackOutlined
} from "@mui/icons-material";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function CartPage() {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const shippingCost = cart.total > 1000 ? 0 : 99;
  const finalTotal = cart.total + shippingCost;

  // Show loading state when cart is being fetched initially
  if (cart.isFetching && cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide text-center mb-8">
              CART
            </h1>
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
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header - Fully responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="order-2 sm:order-1">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowBackOutlined className="mr-2 text-lg sm:text-xl" />
              </Link>
            </div>
            <h1 className="order-1 sm:order-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide text-center sm:text-center flex-1">
              CART ({cart.quantity})
            </h1>
          </div>

          {cart.items.length === 0 ? (
            /* Empty Cart State - Enhanced responsiveness */
            <div className="bg-white shadow-lg p-6 sm:p-8 lg:p-12 text-center max-w-sm sm:max-w-lg mx-auto">
              <ShoppingBagOutlined className="mx-auto mb-4 sm:mb-6 text-gray-400 text-[60px] sm:text-[80px]" />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">YOUR CART IS EMPTY</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Looks like you have not added any items to your cart yet.</p>
              <Link href="/">
                <button
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  type="button"
                  aria-label="Start Shopping"
                >
                  START SHOPPING
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items - Enhanced mobile layout */}
              <div className="xl:col-span-2">
                <div className="bg-white shadow-lg overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">ITEMS IN YOUR CART</h2>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {cart.items.map((item: CartItemPopulated) => (
                      <div key={`${item.productId._id}-${item.color}-${item.size}`} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                          {/* Product Image - Responsive sizing */}
                          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gray-100 overflow-hidden mx-auto sm:mx-0">
                            {item.productId.images?.[0] ? (
                              <Image
                                src={item.productId.images[0]}
                                alt={item.productId.name}
                                width={112}
                                height={112}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                <ShoppingBagOutlined />
                              </div>
                            )}
                          </div>

                          {/* Product Details - Mobile-first layout */}
                          <div className="flex-1 min-w-0 w-full">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 text-center sm:text-left">
                              {item.productId.name}
                            </h3>

                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
                              {item.size && (
                                <span className="bg-gray-100 px-2 sm:px-3 py-1">
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="bg-gray-100 px-2 sm:px-3 py-1">
                                  Color: {item.color}
                                </span>
                              )}
                            </div>

                            {/* Mobile: Stack vertically, Desktop: Side by side */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between space-y-4 sm:space-y-0">
                              <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4 w-full sm:w-auto">
                                {/* Quantity Controls - Touch-friendly on mobile */}
                                <div className="flex items-center border border-gray-700">
                                  <button
                                    className="p-2 sm:p-2 text-black hover:bg-gray-100 transition-colors touch-manipulation"
                                    onClick={
                                      () => 
                                        {
                                          dispatch(updateCartItemOptimistic({ productId: item.productId._id, quantity: item.quantity - 1 }));
                                          dispatch(updateCartItem({ productId: item.productId._id, quantity: item.quantity - 1 }))
                                        }}
                                    aria-label="Decrease quantity"
                                    type="button"
                                  >
                                    <RemoveOutlined style={{ fontSize: 16 }} />
                                  </button>
                                  <span className="px-3 sm:px-4 py-2 text-black text-center min-w-[3rem] font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="p-2 sm:p-2 text-black hover:bg-gray-100 transition-colors touch-manipulation"
                                    onClick={() => {
                                      dispatch(updateCartItemOptimistic({ productId: item.productId._id, quantity: item.quantity + 1 }));
                                      dispatch(updateCartItem({ productId: item.productId._id, quantity: item.quantity + 1 }));
                                    }}
                                    aria-label="Increase quantity"
                                    type="button"
                                  >
                                    <AddOutlined style={{ fontSize: 16 }} />
                                  </button>
                                </div>

                                {/* Remove Button - Larger touch target on mobile */}
                                <button
                                  className="p-2 sm:p-2 text-black hover:text-red-500 transition-colors touch-manipulation"
                                  onClick={() => {
                                    dispatch(removeFromCartOptimistic({ productId: item.productId._id }));
                                    dispatch(removeFromCart(item.productId._id));
                                  }}
                                  aria-label="Remove product"
                                  type="button"
                                >
                                  <DeleteOutlined style={{ fontSize: 20 }} />
                                </button>
                              </div>

                              {/* Price - Centered on mobile */}
                              <div className="text-center sm:text-right">
                                <div className="text-lg sm:text-lg lg:text-xl font-semibold text-gray-900">
                                  ₹{((item.productId.price - (item.productId.price * (item.productId.discount / 100))) * item.quantity).toLocaleString()}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">
                                  ₹{(item.productId.price - (item.productId.price * (item.productId.discount / 100))).toLocaleString()} each
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary - Responsive positioning */}
              <div className="xl:col-span-1 order-first xl:order-last">
                <div className="bg-white shadow-lg xl:sticky xl:top-8">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">ORDER SUMMARY</h2>
                  </div>

                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex justify-between text-sm sm:text-base text-gray-700">
                      <span>SUBTOTAL ({cart.quantity} items)</span>
                      <span className="font-medium">₹{cart.total.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm sm:text-base text-gray-700">
                      <span className="flex items-center">
                        <LocalShippingOutlined className="mr-2" style={{ fontSize: 16 }} />
                        SHIPPING
                      </span>
                      <span className={`font-medium ${shippingCost === 0 ? "text-green-600" : ""}`}>
                        {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                      </span>
                    </div>

                    {cart.total < 1000 && (
                      <div className="bg-blue-50 border border-blue-200 p-3">
                        <p className="text-xs sm:text-sm text-blue-700">
                          Add ₹{(1000 - cart.total).toLocaleString()} more for free shipping!
                        </p>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                      <div className="flex justify-between text-lg sm:text-xl font-semibold text-gray-900">
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 border-t border-gray-200">
                    <button
                      className="w-full py-3 sm:py-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 mb-4 text-sm sm:text-base touch-manipulation"
                      onClick={handleCheckout}
                      type="button"
                    >
                      Proceed to Checkout
                    </button>

                    {/* Security Features - Responsive text and spacing */}
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center">
                        <SecurityOutlined className="mr-1" style={{ fontSize: 16 }} />
                        <span>Secure Checkout</span>
                      </div>
                      <div className="flex items-center">
                        <LocalShippingOutlined className="mr-1" style={{ fontSize: 16 }} />
                        <span>Free Returns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}