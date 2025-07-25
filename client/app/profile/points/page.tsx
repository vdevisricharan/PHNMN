"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  StarsOutlined,
  ArrowBackOutlined,
  CardGiftcardOutlined,
  LocalOfferOutlined,
  ShoppingBagOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchPointsBalance, fetchPointsTransactions, redeemPoints } from '@/redux/slices/pointsSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PointsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    balance,
    transactions,
    rewards,
    isFetching,
    error,
    hasMore,
    currentPage
  } = useSelector((state: RootState) => state.points);

  useEffect(() => {
    dispatch(fetchPointsBalance());
    dispatch(fetchPointsTransactions({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      dispatch(fetchPointsTransactions({ page: currentPage + 1, limit: 10 }));
    }
  };

  const handleRedeemPoints = async (points: number, rewardId: string) => {
    await dispatch(redeemPoints({ points, rewardId }));
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">PHNMN Points</h1>
            <div className="w-6"></div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4  mb-6">
              {error}
            </div>
          )}

          {/* Points Balance Card */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg p-6 sm:p-8 mb-8 text-white">
            <div className="flex items-center mb-4">
              <StarsOutlined className="mr-2" />
              <span className="text-lg">Available Points</span>
            </div>
            {isFetching ? (
              <div className="h-12 w-32 bg-yellow-500 animate-pulse mb-6"></div>
            ) : (
              <div className="text-4xl sm:text-5xl font-bold mb-6">{balance} pts</div>
            )}
            <div className="text-sm opacity-90">
              Earn points on every purchase and redeem them for exclusive rewards!
            </div>
          </div>

          {/* Rewards Section */}
          <div className="bg-white shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Available Rewards</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {rewards.map((reward) => (
                <div key={reward.id} className="border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <CardGiftcardOutlined className="text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600">{reward.points} pts</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{reward.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                  <button
                    onClick={() => handleRedeemPoints(reward.points, reward.id)}
                    className={`w-full py-2 font-medium transition-colors ${
                      balance >= reward.points
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={balance < reward.points || isFetching}
                    type="button"
                  >
                    Redeem Reward
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Points History */}
          <div className="bg-white shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Points History</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {transactions.map((item) => (
                <div key={item._id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      {item.type === 'earned' ? (
                        <div className="w-8 h-8 bg-green-100 flex items-center justify-center mr-4">
                          <ShoppingBagOutlined className="text-green-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 flex items-center justify-center mr-4">
                          <LocalOfferOutlined className="text-blue-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()} at{' '}
                          {new Date(item.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${item.type === 'earned' ? 'text-green-600' : 'text-blue-600'}`}>
                      {item.type === 'earned' ? '+' : '-'}{item.points} pts
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
                    className="text-yellow-600 hover:text-yellow-800 font-medium"
                    type="button"
                  >
                    Load More
                  </button>
                </div>
              )}

              {!isFetching && transactions.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No points history found
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PointsPage;