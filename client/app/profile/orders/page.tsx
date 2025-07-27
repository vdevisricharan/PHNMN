"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchOrders, cancelOrder } from '@/redux/slices/orderSlice';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowBackOutlined,
  LocalShippingOutlined,
  CheckCircleOutlined,
  PendingOutlined,
  CancelOutlined,
  AssignmentReturnOutlined,
  VisibilityOutlined,
  FilterListOutlined
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Order } from '@/redux/types';

const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders = [], isFetching, error, hasMore, currentPage, hasInitialized } = useSelector((state: RootState) => state.order);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    // Only fetch orders if authenticated and not already initialized and not currently fetching
    if (isAuthenticated && !hasInitialized && !isFetching) {
      dispatch(fetchOrders({ page: 1, limit: 10 }));
    }
  }, [dispatch, isAuthenticated, hasInitialized, isFetching]);

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      dispatch(fetchOrders({ page: currentPage + 1, limit: 10 }));
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await dispatch(cancelOrder({ orderId, reason: 'Customer requested cancellation' }));
    }
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

  const canCancelOrder = (order: Order) => {
    return ['pending', 'confirmed'].includes(order.orderStatus);
  };

  const filteredOrders = statusFilter 
    ? orders.filter(order => order.orderStatus === statusFilter)
    : orders;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center">
              <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition-colors mr-4">
                <ArrowBackOutlined />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">My Orders</h1>
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
              type="button"
            >
              <FilterListOutlined className="text-gray-600" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 mb-6">
              {error}
            </div>
          )}

          {/* Filters */}
          {isFiltersOpen && (
            <div className="bg-white p-4 mb-6 border border-gray-200 shadow-sm">
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
                {statusFilter && (
                  <button
                    onClick={() => setStatusFilter('')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    type="button"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white shadow-lg overflow-hidden border border-gray-200">
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.orderStatus)}
                        <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wide ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{order.items.length} item(s)</div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={`${item.productId._id}-${item.size}-${item.color}`} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.productId.name}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>Size: {item.size}</span>
                            <span>Color: {item.color}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ₹{(item.discountedPrice * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                    
                    {order.items.length > 2 && (
                      <div className="text-sm text-gray-600 text-center pt-2 border-t border-gray-100">
                        +{order.items.length - 2} more item(s)
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/profile/orders/${order._id}`}>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors text-sm font-medium">
                          <VisibilityOutlined style={{ fontSize: 16 }} />
                          View Details
                        </button>
                      </Link>
                      
                      {order.trackingNumber && (
                        <Link href={`/profile/orders/${order._id}`}>
                          <button className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium">
                            <LocalShippingOutlined style={{ fontSize: 16 }} />
                            Track Order
                          </button>
                        </Link>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                          type="button"
                        >
                          <CancelOutlined style={{ fontSize: 16 }} />
                          Cancel Order
                        </button>
                      )}
                      
                      {order.orderStatus === 'delivered' && (
                        <Link href={`/profile/orders/${order._id}?return=true`}>
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors text-sm font-medium">
                            <AssignmentReturnOutlined style={{ fontSize: 16 }} />
                            Return
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading State */}
          {isFetching && (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}

          {/* Load More */}
          {hasMore && !isFetching && filteredOrders.length > 0 && (
            <div className="text-center py-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                type="button"
              >
                Load More Orders
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isFetching && filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <LocalShippingOutlined className="text-gray-400 text-4xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {statusFilter ? 'No orders found' : 'No orders yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {statusFilter 
                    ? `No orders found with status "${statusFilter}"`
                    : "You haven't placed any orders yet. Start shopping to see your orders here."
                  }
                </p>
                {!statusFilter && (
                  <Link href="/">
                    <button className="px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
                      Start Shopping
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrdersPage;