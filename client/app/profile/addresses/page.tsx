"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowBackOutlined,
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  BusinessOutlined,
  LocalShippingOutlined,
  CloseOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { Address } from '@/redux/types';
import {
  createAddress,
  editAddress,
  removeAddress,
  makeDefaultAddress,
  clearError
} from '@/redux/slices/addressSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AddressFormData {
  type: 'home' | 'office' | 'other';
  fullName: string;
  phone: string;
  street: string;
  locality: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const initialFormData: AddressFormData = {
  type: 'home',
  fullName: '',
  phone: '',
  street: '',
  locality: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  isDefault: false,
};

const AddressesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, isFetching, error } = useSelector((state: RootState) => state.address);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        type: editingAddress.type,
        fullName: editingAddress.fullName,
        phone: editingAddress.phone,
        street: editingAddress.street,
        locality: editingAddress.locality,
        city: editingAddress.city,
        state: editingAddress.state,
        postalCode: editingAddress.postalCode,
        country: editingAddress.country,
        isDefault: editingAddress.isDefault,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await dispatch(editAddress({ addressId: editingAddress._id, data: formData })).unwrap();
      } else {
        await dispatch(createAddress(formData)).unwrap();
      }
      setShowAddForm(false);
      setEditingAddress(null);
      setFormData(initialFormData);
    } catch (err) {
      console.error('Failed to save address:', err);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(removeAddress(addressId)).unwrap();
      } catch (err) {
        console.error('Failed to delete address:', err);
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await dispatch(makeDefaultAddress(addressId)).unwrap();
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  const closeModal = () => {
    setShowAddForm(false);
    setEditingAddress(null);
  };

  if (isFetching && addresses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12 text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowBackOutlined />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Saved Addresses</h1>
            <div className="w-6"></div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 mb-6">
              {error}
              <button
                onClick={() => dispatch(clearError())}
                className="ml-2 text-sm underline"
                type="button"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Add New Address Button */}
          <button
            onClick={() => {
              setEditingAddress(null);
              setShowAddForm(true);
            }}
            className="w-full mb-6 bg-gray-900 text-white py-3 font-medium hover:bg-gray-800 transition-colors flex items-center justify-center disabled:bg-gray-400"
            type="button"
            disabled={isFetching}
          >
            <AddOutlined className="mr-2" />
            Add New Address
          </button>

          {/* Addresses List */}
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address._id} className="bg-white shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {address.type === 'home' ? (
                        <HomeOutlined className="text-gray-600 mr-2" />
                      ) : (
                        <BusinessOutlined className="text-gray-600 mr-2" />
                      )}
                      <span className="font-medium text-gray-900 capitalize">{address.type}</span>
                      {address.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingAddress(address);
                          setShowAddForm(true);
                        }}
                        className="p-1 text-gray-600 hover:text-blue-600 transition-colors disabled:text-gray-400"
                        type="button"
                        aria-label="Edit address"
                        disabled={isFetching}
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => handleDelete(address._id)}
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors disabled:text-gray-400"
                        type="button"
                        aria-label="Delete address"
                        disabled={isFetching}
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{address.fullName}</p>
                    <p className="text-gray-600">{address.phone}</p>
                    <p className="text-gray-600">
                      {address.street}, {address.locality}
                      <br />
                      {address.city}, {address.state} - {address.postalCode}
                    </p>
                  </div>

                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center disabled:text-gray-400"
                      type="button"
                      disabled={isFetching}
                    >
                      <LocalShippingOutlined className="w-4 h-4 mr-1" />
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}

            {addresses.length === 0 && !isFetching && (
              <div className="bg-white shadow-lg overflow-hidden p-6 text-center text-gray-500">
                No addresses saved yet
              </div>
            )}
          </div>

          {/* Add/Edit Address Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white shadow-xl w-full max-w-md sm:max-w-lg mx-auto my-4 sm:my-8 min-h-0 max-h-[calc(100vh-2rem)] flex flex-col">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100  transition-colors"
                    type="button"
                    aria-label="Close modal"
                  >
                    <CloseOutlined className="text-gray-500" />
                  </button>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'home' | 'office' | 'other' })}
                          className="w-full px-3 py-2.5 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          title='Select address type'
                        >
                          <option value="home">Home</option>
                          <option value="office">Office</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          title='Full Name'
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          title='Phone Number'
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          title='Street Address'
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Locality/Area
                        </label>
                        <input
                          type="text"
                          value={formData.locality}
                          onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          title='Locality/Area'
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            title="City"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            title="State"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            title='Postal Code'
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            title="Country"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={formData.isDefault}
                          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300  mt-0.5"
                        />
                        <label htmlFor="isDefault" className="ml-3 block text-sm text-gray-900 leading-5">
                          Set as default address
                        </label>
                      </div>
                    </div>

                    {/* Form Actions - Fixed at bottom */}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={closeModal}
                        className="w-full sm:w-auto px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium disabled:text-gray-400 border border-gray-300  hover:bg-gray-50 transition-colors"
                        type="button"
                        disabled={isFetching}
                      >
                        Cancel
                      </button>
                      <button
                        className="w-full sm:w-auto px-4 py-2.5 bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:bg-gray-400  transition-colors"
                        type="submit"
                        disabled={isFetching}
                      >
                        {isFetching ? (
                          <span className="flex items-center justify-center">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent  animate-spin mr-2"></span>
                            Saving...
                          </span>
                        ) : (
                          editingAddress ? 'Update Address' : 'Save Address'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AddressesPage;