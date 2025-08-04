"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AccountCircleOutlined,
  AccountBalanceWalletOutlined,
  LocationOnOutlined,
  StarsOutlined,
  EditOutlined,
  ChevronRightOutlined,
  CloseOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchOrders } from '@/redux/slices/orderSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { updateProfile } from '@/redux/slices/userSlice';

// Edit Profile Modal Component
type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
  };
  onSave: (formData: { name: string; email: string; phone: string; dateOfBirth: string }) => void;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, currentUser, onSave }) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    dateOfBirth: currentUser?.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white  max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title='Close Modal'
            type='button'
          >
            <CloseOutlined />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 text-black">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200  transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-700  transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, isFetching: userFetching, isAuthenticated } = useSelector((state: RootState) => state.user);
  const { balance: walletBalance = 0, isFetching: walletFetching } = useSelector((state: RootState) => state.wallet || {});
  const { balance: pointsBalance = 0, isFetching: pointsFetching } = useSelector((state: RootState) => state.points || {});
  const { orders = [], isFetching: ordersFetching, hasInitialized: ordersInitialized } = useSelector((state: RootState) => state.order || {});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Only fetch orders if user is authenticated and orders not already initialized and not currently fetching
    if (isAuthenticated && !ordersInitialized && !ordersFetching) {
      dispatch(fetchOrders({ page: 1, limit: 5 })); // Fetch only 5 recent orders
    }
  }, [dispatch, isAuthenticated, ordersInitialized, ordersFetching]);

  const handleSaveProfile = (updatedData: { name: string; email: string; phone: string; dateOfBirth: string }) => {
    // Here you would dispatch an action to update the user profile
    dispatch(updateProfile(updatedData));
    console.log('Updated profile data:', updatedData);
    // You can add your API call or Redux action here
  };

  if (!currentUser || userFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white shadow-lg overflow-hidden mb-6">
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 flex items-center justify-center">
                    <AccountCircleOutlined style={{ fontSize: '2.5rem' }} className="text-gray-400" />
                  </div>
                  <div className="ml-4 sm:ml-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">{currentUser.name}</h1>
                    <p className="text-gray-600">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium transition-colors"
                >
                  <EditOutlined className="w-4 h-4 mr-1" />
                  Edit Profile
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{currentUser.phone || 'Not added'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Date of Birth:</span>
                  <span className="ml-2">
                    {currentUser.dateOfBirth
                      ? new Date(currentUser.dateOfBirth).toLocaleDateString()
                      : 'Not added'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Wallet */}
            <Link href="/profile/wallet" className="bg-white shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AccountBalanceWalletOutlined className="text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">PHNMN Wallet</h3>
                    {walletFetching ? (
                      <div className="h-8 w-24 bg-gray-200 animate-pulse"></div>
                    ) : (
                      <p className="text-2xl font-semibold text-blue-600">₹{walletBalance}</p>
                    )}
                  </div>
                </div>
                <ChevronRightOutlined className="text-gray-400" />
              </div>
            </Link>

            {/* Points */}
            <Link href="/profile/points" className="bg-white shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <StarsOutlined className="text-yellow-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">PHNMN Points</h3>
                    {pointsFetching ? (
                      <div className="h-8 w-24 bg-gray-200 animate-pulse"></div>
                    ) : (
                      <p className="text-2xl font-semibold text-yellow-500">{pointsBalance} pts</p>
                    )}
                  </div>
                </div>
                <ChevronRightOutlined className="text-gray-400" />
              </div>
            </Link>

            {/* Addresses */}
            <Link href="/profile/addresses" className="bg-white shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LocationOnOutlined className="text-red-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Saved Addresses</h3>
                    <p className="text-2xl font-semibold text-red-500">
                      {currentUser.addresses?.length || 0}
                    </p>
                  </div>
                </div>
                <ChevronRightOutlined className="text-gray-400" />
              </div>
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="bg-white shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link
                href="/profile/orders"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All Orders
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {ordersFetching ? (
                <div className="p-6 text-center">
                  <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              ) : Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₹{order.total.toLocaleString()}</div>
                        <div className={`text-xs px-2 py-1 inline-block uppercase tracking-wide font-medium ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                          }`}>
                          {order.orderStatus}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {order.items.length} item(s) • {order.paymentMethod.toUpperCase()}
                    </div>
                    <Link href={`/profile/orders/${order._id}`}>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View Details →
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-600 mb-4">No recent orders found.</p>
                  <Link href="/">
                    <button className="text-blue-600 hover:text-blue-800 font-medium"
                      type='button'
                    >
                      Start Shopping
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={{
          ...currentUser,
          dateOfBirth: currentUser.dateOfBirth
            ? typeof currentUser.dateOfBirth === 'string'
              ? currentUser.dateOfBirth
              : currentUser.dateOfBirth.toISOString()
            : undefined
        }}
        onSave={handleSaveProfile}
      />
      <Footer />
    </>
  );
};

export default ProfilePage;