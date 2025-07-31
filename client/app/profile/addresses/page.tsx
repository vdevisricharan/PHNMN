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
  LocalShippingOutlined
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

  if (isFetching && addresses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin  h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
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
            <div className="bg-red-50 text-red-600 p-4  mb-6">
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white shadow-xl w-full max-w-lg">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'home' | 'office' | 'other' })}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title='Select address type'
                      >
                        <option value="home">Home</option>
                        <option value="office">Office</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title='Full Name'
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title='Phone Number'
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title='Street Address'
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Locality/Area
                      </label>
                      <input
                        type="text"
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title='Locality/Area'
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                          title="City"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                          title="State"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                          title='Postal Code'
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                          title="Country"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                        Set as default address
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingAddress(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:text-gray-400"
                      type="button"
                      disabled={isFetching}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:bg-gray-400"
                      type="submit"
                      disabled={isFetching}
                    >
                      {isFetching ? (
                        <span className="flex items-center">
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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AddressesPage;