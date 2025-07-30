"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchOrder, cancelOrder, trackOrder, requestReturn } from '@/redux/slices/orderSlice';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowBackOutlined,
  LocalShippingOutlined,
  CheckCircleOutlined,
  PendingOutlined,
  CancelOutlined,
  AssignmentReturnOutlined,
  LocationOnOutlined,
  AccessTimeOutlined,
  ReceiptOutlined,
  PrintOutlined
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder, isFetching, error } = useSelector((state: RootState) => state.order);
  
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnItems, setReturnItems] = useState<Array<{
    productId: string;
    quantity: number;
    reason: string;
  }>>([]);
  const [returnReason, setReturnReason] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrder(id as string));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (searchParams.get('return') === 'true' && currentOrder) {
      setShowReturnModal(true);
      // Initialize return items with all order items
      setReturnItems(currentOrder.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        reason: ''
      })));
    }
  }, [searchParams, currentOrder]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await dispatch(cancelOrder({ orderId: id as string, reason: 'Customer requested cancellation' }));
    }
  };

  const handleTrackOrder = async () => {
    const result = await dispatch(trackOrder(id as string));
    if (result.payload) {
      setTrackingData(result.payload);
    }
  };

  const handleReturnRequest = async () => {
    const validItems = returnItems.filter(item => item.reason.trim() !== '');
    if (validItems.length === 0) {
      alert('Please select items and provide reasons for return');
      return;
    }

    await dispatch(requestReturn({
      orderId: id as string,
      data: {
        items: validItems,
        reason: returnReason
      }
    }));
    
    setShowReturnModal(false);
    setReturnItems([]);
    setReturnReason('');
  };

  const updateReturnItem = (productId: string, field: 'quantity' | 'reason', value: string | number) => {
    setReturnItems(items => 
      items.map(item => 
        item.productId === productId 
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <PendingOutlined className="text-yellow-500" />;
      case 'confirmed':
      case 'processing':
        return <LocalShippingOutlined className="text-blue-500" />;
      case 'shipped':
        return <LocalShippingOutlined className="text-purple-500" />;
      case 'delivered':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'cancelled':
        return <CancelOutlined className="text-red-500" />;
      case 'returned':
        return <AssignmentReturnOutlined className="text-gray-500" />;
      default:
        return <PendingOutlined className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancelOrder = () => {
    return currentOrder && ['pending', 'confirmed'].includes(currentOrder.orderStatus);
  };

  const canReturnOrder = () => {
    return currentOrder && currentOrder.orderStatus === 'delivered';
  };

  if (isFetching) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !currentOrder) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || 'The order you are looking for does not exist or you do not have access to it.'}
            </p>
            <Link href="/profile/orders">
              <button className="px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
                Back to Orders
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center">
              <Link href="/profile/orders" className="text-gray-600 hover:text-gray-900 transition-colors mr-4">
                <ArrowBackOutlined />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  Order #{currentOrder._id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(currentOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
              type="button"
            >
              <PrintOutlined style={{ fontSize: 16 }} />
              Print
            </button>
          </div>

          {/* Order Status */}
          <div className="bg-white shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(currentOrder.orderStatus)}
                <span className={`px-4 py-2 text-sm font-medium uppercase tracking-wide ${getStatusColor(currentOrder.orderStatus)}`}>
                  {currentOrder.orderStatus}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">₹{currentOrder.total.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{currentOrder.paymentStatus}</div>
              </div>
            </div>

            {currentOrder.trackingNumber && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <LocalShippingOutlined style={{ fontSize: 16 }} />
                <span>Tracking Number: <strong>{currentOrder.trackingNumber}</strong></span>
              </div>
            )}

            {currentOrder.estimatedDelivery && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AccessTimeOutlined style={{ fontSize: 16 }} />
                <span>Estimated Delivery: {new Date(currentOrder.estimatedDelivery).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Order Actions */}
          <div className="bg-white shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Actions</h2>
            <div className="flex flex-wrap gap-3">
              {currentOrder.trackingNumber && (
                <button
                  onClick={handleTrackOrder}
                  className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                  type="button"
                >
                  <LocalShippingOutlined style={{ fontSize: 16 }} />
                  Track Package
                </button>
              )}
              
              {canCancelOrder() && (
                <button
                  onClick={handleCancelOrder}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                  type="button"
                >
                  <CancelOutlined style={{ fontSize: 16 }} />
                  Cancel Order
                </button>
              )}
              
              {canReturnOrder() && (
                <button
                  onClick={() => setShowReturnModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-orange-300 text-orange-600 hover:bg-orange-50 transition-colors text-sm font-medium"
                  type="button"
                >
                  <AssignmentReturnOutlined style={{ fontSize: 16 }} />
                  Request Return
                </button>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {currentOrder.items.map((item) => (
                <div key={`${item.productId._id}-${item.size}-${item.color}`} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.productId.images[0]}
                        alt={item.productId.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {item.productId.name}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Size:</span> {item.size}
                        </div>
                        <div>
                          <span className="font-medium">Color:</span> {item.color}
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span> {item.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Price:</span> ₹{item.discountedPrice.toLocaleString()} each
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ₹{(item.discountedPrice * item.quantity).toLocaleString()}
                      </div>
                      {item.price !== item.discountedPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{currentOrder.subtotal.toLocaleString()}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{currentOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{currentOrder.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{currentOrder.tax.toLocaleString()}</span>
              </div>
              {currentOrder.pointsUsed > 0 && (
                <div className="flex justify-between text-yellow-600">
                  <span>Points Used</span>
                  <span>-₹{currentOrder.pointsUsed.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{currentOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="flex items-start gap-3">
              <LocationOnOutlined className="text-gray-400 mt-1" />
              <div className="text-gray-600">
                <div className="font-medium text-gray-900">{currentOrder.shippingAddress.fullName}</div>
                <div>{currentOrder.shippingAddress.street}</div>
                <div>{currentOrder.shippingAddress.locality}</div>
                <div>
                  {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postalCode}
                </div>
                <div>{currentOrder.shippingAddress.country}</div>
                <div className="mt-2 text-sm">Phone: {currentOrder.shippingAddress.phone}</div>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          {trackingData && (
            <div className="bg-white shadow-lg p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h2>
              <div className="space-y-4">
                {trackingData.tracking.map((event: any, index: number) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="w-3 h-3 bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{event.status}</div>
                      <div className="text-sm text-gray-600">{event.description}</div>
                      {event.location && (
                        <div className="text-sm text-gray-500">Location: {event.location}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Request Return</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {currentOrder.items.map((item) => {
                  const returnItem = returnItems.find(ri => ri.productId === item.productId._id);
                  return (
                    <div key={`${item.productId._id}-${item.size}-${item.color}`} className="border border-gray-200 p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.productId.name}</h4>
                          <div className="text-sm text-gray-600">
                            Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity to Return
                          </label>
                          <select
                            value={returnItem?.quantity || 0}                  
                            onChange={(e) => updateReturnItem(item.productId._id, 'quantity', Number(e.target.value))}
                            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title='Select quantity to return'
                          >
                            <option value={0}>Don&apos;t return</option>
                            {Array.from({ length: item.quantity }, (_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Return Reason
                          </label>
                          <select
                            value={returnItem?.reason || ''}
                            onChange={(e) => updateReturnItem(item.productId._id, 'reason', e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!returnItem?.quantity}
                            title='Select reason for return'
                          >
                            <option value="">Select reason</option>
                            <option value="defective">Defective/Damaged</option>
                            <option value="wrong-item">Wrong Item</option>
                            <option value="size-issue">Size Issue</option>
                            <option value="not-as-described">Not as Described</option>
                            <option value="changed-mind">Changed Mind</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Please provide additional details about your return request..."
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnRequest}
                className="px-4 py-2 bg-orange-600 text-white font-medium hover:bg-orange-700 disabled:bg-orange-300"
                type="button"
                disabled={!returnItems.some(item => item.reason.trim() !== '')}
              >
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default OrderDetailsPage;