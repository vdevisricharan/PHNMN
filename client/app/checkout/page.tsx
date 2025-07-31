"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/redux/store';
import { checkout } from '@/redux/slices/orderSlice';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowBackOutlined,
  LocationOnOutlined,
  PaymentOutlined,
  AccountBalanceWalletOutlined,
  CreditCardOutlined,
  LocalAtmOutlined,
  StarsOutlined,
  AddOutlined,
  CheckCircleOutlined
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { CheckoutData } from '@/redux/types';
import { clearCart, clearCartAPI } from '@/redux/slices/cartSlice';

const CheckoutPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { items: cartItems, quantity: cartQuantity, total: cartTotal } = useSelector((state: RootState) => state.cart);
  const { addresses } = useSelector((state: RootState) => state.address);
  const { balance: pointsBalance } = useSelector((state: RootState) => state.points);
  const { balance: walletBalance } = useSelector((state: RootState) => state.wallet);
  const { checkoutLoading, error } = useSelector((state: RootState) => state.order);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'cod'>('cod');
  const [pointsToUse, setPointsToUse] = useState<number>(0);
  const [cardToken, setCardToken] = useState<string>('');
  const [cardLast4, setCardLast4] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }
  }, [dispatch, currentUser, cartItems.length, router]);

  useEffect(() => {
    // Set default address
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress._id);
    } else if (addresses.length > 0) {
      setSelectedAddress(addresses[0]._id);
    }
  }, [addresses]);

  const shippingCost = cartTotal > 1000 ? 0 : 99;
  const taxRate = 0.18; // 18% tax
  const tax = Math.round(cartTotal * taxRate);
  const pointsDiscount = pointsToUse;
  const finalTotal = cartTotal + shippingCost + tax - pointsDiscount;

  const handlePointsChange = (points: number) => {
    const maxPoints = Math.min(pointsBalance, Math.floor(cartTotal * 0.3)); // Max 30% of cart value
    setPointsToUse(Math.min(points, maxPoints));
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert('Please select a shipping address');
      return;
    }

    if (paymentMethod === 'wallet' && walletBalance < finalTotal) {
      alert('Insufficient wallet balance');
      return;
    }

    setIsProcessing(true);

    try {
      // Find the selected address object
      const shippingAddressObj = addresses.find(addr => addr._id === selectedAddress);

      if (!shippingAddressObj) {
        alert('Invalid shipping address');
        setIsProcessing(false);
        return;
      }

      // If you want to support separate billing address, add logic here.
      // For now, billingAddress = shippingAddress
      const billingAddressObj = shippingAddressObj;

      const checkoutData: CheckoutData = {
        items: cartItems.map(item => ({
          productId: item.productId._id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.productId.price,
          discountedPrice: item.productId.price * (1 - item.productId.discount / 100),
        })),
        shippingAddress: shippingAddressObj,
        billingAddress: billingAddressObj,
        subtotal: cartTotal,
        discount: 0,
        shipping: shippingCost,
        tax,
        total: finalTotal,
        paymentMethod,
        pointsToUse: pointsToUse || undefined,
        cardDetails: paymentMethod === 'card' && cardToken ? {
          token: cardToken,
          last4: cardLast4
        } : undefined
      };

      const result = await dispatch(checkout(checkoutData));

      if (result.type === 'order/checkout/fulfilled') {
        router.push(`/success`);
        dispatch(clearCart());
        dispatch(clearCartAPI());
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateCardPayment = () => {
    // Simulate card tokenization (in real app, this would be Stripe/Razorpay)
    setCardToken('tok_' + Math.random().toString(36).substr(2, 9));
    setCardLast4('1234');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center mb-6 sm:mb-8">
            <Link href="/cart" className="text-gray-600 hover:text-gray-900 transition-colors mr-4">
              <ArrowBackOutlined />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Checkout</h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <LocationOnOutlined className="mr-2" />
                    Shipping Address
                  </h2>
                  <Link href="/profile/addresses">
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      type='button'
                    >
                      <AddOutlined style={{ fontSize: 16 }} />
                      Add New
                    </button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`border-2 p-4 cursor-pointer transition-all ${selectedAddress === address._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => setSelectedAddress(address._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">{address.fullName}</span>
                            {address.isDefault && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium uppercase">
                                Default
                              </span>
                            )}
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium capitalize">
                              {address.type}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>{address.street}</div>
                            <div>{address.locality}</div>
                            <div>
                              {address.city}, {address.state} {address.postalCode}
                            </div>
                            <div>Phone: {address.phone}</div>
                          </div>
                        </div>
                        {selectedAddress === address._id && (
                          <CheckCircleOutlined className="text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                  <PaymentOutlined className="mr-2" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Credit/Debit Card */}
                  <div
                    className={`text-black border-2 p-4 cursor-pointer transition-all bg-gray-200 opacity-50 pointer-events-none ${paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCardOutlined className="text-gray-600" />
                        <div>
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm">Pay securely with your card</div>
                        </div>
                      </div>
                      {paymentMethod === 'card' && (
                        <CheckCircleOutlined className="text-blue-500" />
                      )}
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={simulateCardPayment}
                          className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-sm font-medium"
                          type="button"
                        >
                          {cardToken ? `Card ending in ${cardLast4}` : 'Add Card Details'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Wallet */}
                  <div
                    className={`border-2 p-4 cursor-pointer transition-all bg-gray-200 opacity-50 pointer-events-none ${paymentMethod === 'wallet'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      } ${walletBalance < finalTotal ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => walletBalance >= finalTotal && setPaymentMethod('wallet')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AccountBalanceWalletOutlined className="text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">PHNMN Wallet</div>
                          <div className="text-sm text-gray-600">
                            Balance: ₹{walletBalance.toLocaleString()}
                            {walletBalance < finalTotal && (
                              <span className="text-red-500 ml-2">(Insufficient)</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {paymentMethod === 'wallet' && walletBalance >= finalTotal && (
                        <CheckCircleOutlined className="text-blue-500" />
                      )}
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    className={`border-2 p-4 cursor-pointer transition-all ${paymentMethod === 'cod'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LocalAtmOutlined className="text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">Pay when you receive your order</div>
                        </div>
                      </div>
                      {paymentMethod === 'cod' && (
                        <CheckCircleOutlined className="text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Points Redemption */}
              {pointsBalance > 0 && (
                <div className="bg-white shadow-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                    <StarsOutlined className="mr-2 text-yellow-500" />
                    Use PHNMN Points
                  </h2>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points to use (Available: {pointsBalance})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={Math.min(pointsBalance, Math.floor(cartTotal * 0.3))}
                        value={pointsToUse}
                        onChange={(e) => handlePointsChange(Number(e.target.value))}
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter points"
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      Save ₹{pointsToUse}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-lg sticky top-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={`${item.productId._id}-${item.size}-${item.color}`} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.productId.name}
                          </h4>
                          <div className="text-xs text-gray-600">
                            {item.size} | {item.color} | Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ₹{((item.productId.price * (1 - item.productId.discount / 100)) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal ({cartQuantity} items)</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span className={shippingCost === 0 ? "text-green-600" : ""}>
                        {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax (18%)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>

                    {pointsToUse > 0 && (
                      <div className="flex justify-between text-sm text-yellow-600">
                        <span>Points Discount</span>
                        <span>-₹{pointsToUse}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || isProcessing || !selectedAddress || (paymentMethod === 'card' && !cardToken)}
                    className={`w-full mt-6 py-3 font-medium transition-all duration-300 ${checkoutLoading || isProcessing || !selectedAddress || (paymentMethod === 'card' && !cardToken)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-105'
                      }`}
                    type="button"
                  >
                    {checkoutLoading || isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </button>

                  {/* Security Note */}
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Your payment information is secure and encrypted
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
};

export default CheckoutPage;