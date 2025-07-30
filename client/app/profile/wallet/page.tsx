"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AccountBalanceWalletOutlined,
  ArrowBackOutlined,
  AddOutlined,
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  ReceiptOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchWalletTransactions, addWalletMoney } from '@/redux/slices/walletSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const WalletPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { balance, transactions, isFetching, error, hasMore, currentPage, hasInitialized } = useSelector((state: RootState) => state.wallet);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
  if (!hasInitialized && !isFetching) {
    dispatch(fetchWalletTransactions({ page: 1, limit: 10 }));
  }
}, [dispatch, hasInitialized, isFetching]);

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      dispatch(fetchWalletTransactions({ page: currentPage + 1, limit: 10 }));
    }
  };

  const handleAddMoney = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return;
    }
    await dispatch(addWalletMoney(Number(amount)));
    setAmount('');
    setShowAddMoneyModal(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowBackOutlined />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">PHNMN Wallet</h1>
            <div className="w-6"></div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4  mb-6">
              {error}
            </div>
          )}

          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg p-6 sm:p-8 mb-8 text-white">
            <div className="flex items-center mb-4">
              <AccountBalanceWalletOutlined className="mr-2" />
              <span className="text-lg">Available Balance</span>
            </div>
            <div className="text-4xl sm:text-5xl font-bold mb-6">₹{balance}</div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddMoneyModal(true)}
                className="flex-1 bg-white text-blue-600 py-2 px-4 font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                type="button"
              >
                <AddOutlined className="mr-1" />
                Add Money
              </button>
              <button
                className="flex-1 bg-white text-blue-600 py-2 px-4 font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                type="button"
              >
                <ReceiptOutlined className="mr-1" />
                Pay Bill
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      {transaction.type === 'credit' ? (
                        <div className="w-8 h-8 bg-green-100 flex items-center justify-center mr-4">
                          <ArrowDownwardOutlined className="text-green-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-red-100 flex items-center justify-center mr-4">
                          <ArrowUpwardOutlined className="text-red-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </div>
                  </div>
                </div>
              ))}

              {isFetching && (
                <div className="p-4 flex justify-center">
                  <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              )}

              {hasMore && !isFetching && (
                <div className="p-4 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    type="button"
                  >
                    Load More
                  </button>
                </div>
              )}

              {!isFetching && transactions.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No transactions found
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white shadow-xl w-full max-w-md ">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Money to Wallet</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  min="1"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddMoneyModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoney}
                className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-300"
                type="button"
                disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0}
              >
                Add Money
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default WalletPage;