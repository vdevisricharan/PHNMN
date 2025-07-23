'use client';

import React from "react";

const Newsletter = () => (
    <div className="w-full bg-gray-50 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-black">
                    NEWSLETTER
                </h2>
                <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-700 leading-relaxed">
                    Get timely updates from your favorite products.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 sm:gap-0 w-full max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 outline-none text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all text-sm sm:text-base"
                        required
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 sm:py-2 bg-red-600 text-white font-semibold hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all text-sm sm:text-base"
                    >
                        Subscribe
                    </button>
                </form>
                <p className="text-xs sm:text-sm text-gray-500 mt-4">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </div>
    </div>
);


export default Newsletter;