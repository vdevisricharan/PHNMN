"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/redux/store";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { increaseQuantity, decreaseQuantity, removeProduct } from "@/redux/slices/cartSlice";
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

interface Product {
  _id: string;
  img?: string;
  price?: number;
  quantity?: number;
  title?: string;
  size?: string[];   // <-- should be string[] | undefined
  color?: string[];  // <-- should be string[] | undefined
  selectedSize?: string;
  selectedColor?: string;
}

export default function CartPage() {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/success");
  };

  const shippingCost = cart.total > 1000 ? 0 : 99;
  const finalTotal = cart.total + shippingCost;

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowBackOutlined className="mr-2" />
                <span className="font-medium">CONTINUE SHOPPING</span>
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide">
              SHOPPING CART ({cart.quantity})
            </h1>
            <div className="w-32"></div> {/* Spacer for center alignment */}
          </div>

          {cart.products.length === 0 ? (
            /* Empty Cart State */
            <div className="bg-white  shadow-lg p-12 text-center max-w-lg mx-auto">
              <ShoppingBagOutlined className="mx-auto mb-6 text-gray-400" style={{ fontSize: 80 }} />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">YOUR CART IS EMPTY</h2>
              <p className="text-gray-600 mb-8">Looks like you have not added any items to your cart yet.</p>
              <Link href="/">
                <button className="px-8 py-3 bg-gray-900 text-white  font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                  START SHOPPING
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white  shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">ITEMS IN YOUR CART</h2>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {cart.products.map((product: Product) => (
                      <div key={product._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-24 h-24 bg-gray-100  overflow-hidden">
                            {product.img ? (
                              <Image
                                src={product.img}
                                alt={product.title || "Product Image"}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                <ShoppingBagOutlined />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {product.title || "Product Name"}
                            </h3>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                              {product.selectedSize && (
                                <span className="bg-gray-100 px-3 py-1 ">
                                  Size: {product.selectedSize}
                                </span>
                              )}
                              {product.selectedColor && (
                                <span className="bg-gray-100 px-3 py-1 ">
                                  Color: {product.selectedColor}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {/* Quantity Controls */}
                                <div className="flex items-center border border-gray-700 ">
                                  <button
                                    className="p-2 text-black hover:bg-gray-100 transition-colors"
                                    onClick={() => dispatch(decreaseQuantity(product._id))}
                                    aria-label="Decrease quantity"
                                    type="button"
                                  >
                                    <RemoveOutlined style={{ fontSize: 16 }} />
                                  </button>
                                  <span className="px-4 py-2 text-black text-center min-w-[3rem] font-medium">
                                    {product.quantity ?? 0}
                                  </span>
                                  <button
                                    className="p-2 text-black hover:bg-gray-100 transition-colors"
                                    onClick={() => dispatch(increaseQuantity(product._id))}
                                    aria-label="Increase quantity"
                                    type="button"
                                  >
                                    <AddOutlined style={{ fontSize: 16 }} />
                                  </button>
                                </div>

                                {/* Remove Button */}
                                <button
                                  className="p-2 text-black hover:text-red-500 transition-colors"
                                  onClick={() => dispatch(removeProduct(product._id))}
                                  aria-label="Remove product"
                                  type="button"
                                >
                                  <DeleteOutlined style={{ fontSize: 20 }} />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <div className="text-lg font-semibold text-gray-900">
                                  ₹{((product.price ?? 0) * (product.quantity ?? 0)).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ₹{(product.price ?? 0).toLocaleString()} each
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

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white  shadow-lg sticky top-8">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">ORDER SUMMARY</h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between text-gray-700">
                      <span>SUBTOTAL ({cart.quantity} items)</span>
                      <span>₹{cart.total.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-700">
                      <span className="flex items-center">
                        <LocalShippingOutlined className="mr-2" style={{ fontSize: 16 }} />
                        SHIPPING
                      </span>
                      <span className={shippingCost === 0 ? "text-green-600" : ""}>
                        {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                      </span>
                    </div>
                    
                    {cart.total < 1000 && (
                      <div className="bg-blue-50 border border-blue-200  p-3">
                        <p className="text-sm text-blue-700">
                          Add ₹{(1000 - cart.total).toLocaleString()} more for free shipping!
                        </p>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-gray-200">
                    <button
                      className="w-full py-4 bg-gray-900 text-white font-medium  hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 mb-4"
                      onClick={handleCheckout}
                      type="button"
                    >
                      Proceed to Checkout
                    </button>
                    
                    {/* Security Features */}
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
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
                
                {/* Recommended Products */}
                {/* <div className="bg-white  shadow-lg mt-6 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">You might also like</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 "></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Similar Product</h4>
                        <p className="text-sm text-gray-600">₹1,299</p>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}