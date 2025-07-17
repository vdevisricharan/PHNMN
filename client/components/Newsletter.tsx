'use client';

import React from "react";

const Newsletter = () => (
  <div className="w-full bg-gray-50 py-12 flex flex-col items-center">
    <h2 className="text-3xl font-bold mb-4 text-black">NEWSLETTER</h2>
    <p className="text-lg mb-6 text-gray-700">Get timely updates from your favorite products.</p>
    <form className="flex w-full max-w-md">
      <input
        type="email"
        placeholder="Your email"
        className="flex-1 px-4 py-2 border border-gray-300 outline-none text-gray-900 focus:border-gray-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-red-600 text-white font-semibold hover:bg-red-700 transition"
      >
        Subscribe
      </button>
    </form>
  </div>
);

export default Newsletter;