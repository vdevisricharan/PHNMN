'use client';

import React from "react";
import { Search, ShoppingCartOutlined, PersonOutlined } from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { RootState } from '../redux/store';
import { logout } from "../redux/apiCalls";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const quantity = useSelector((state: RootState) => state.cart.quantity);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    logout(dispatch);
    router.push("/");
  };

  return (
    <nav className="h-20 flex items-center px-4 lg:px-8 justify-between bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex-1 flex items-center space-x-6">
        <div className="relative">
          <div className="flex items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 px-4 py-2 border border-gray-200 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-200">
            <Search className="text-gray-400 mr-2" style={{ fontSize: 20 }} />
            <input
              className="bg-transparent outline-none border-none text-sm placeholder-gray-500 w-32 sm:w-48 lg:w-64"
              placeholder="Search for items..."
            />
          </div>
        </div>
      </div>

      {/* Center Section - Logo */}
      <div className="flex-1 flex justify-center">
        <Link href="/">
          <span className="font-bold text-2xl lg:text-3xl tracking-[0.2em] cursor-pointer text-gray-900 hover:text-gray-700 transition-colors duration-200">
            PHENOMENON
          </span>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-end space-x-6">
        <div className="hidden sm:flex items-center space-x-6">
          {currentUser ? (
            <>
              <span className="text-sm font-medium text-gray-700 cursor-default tracking-wide">
                Hello, {currentUser.username || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="ml-4 text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200 tracking-wide"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <span className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200 tracking-wide">
                  SIGN IN
                </span>
              </Link>
            </>
          )}
          <Link href='/wishlist'>
            <span className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200 tracking-wide">
              WISHLIST
            </span>
          </Link>
        </div>

        {/* Mobile menu for auth */}
        <div className="sm:hidden">
          <PersonOutlined className="cursor-pointer text-gray-700 hover:text-gray-900 transition-colors duration-200" />
        </div>

        <Link href="/cart">
          <div className="relative cursor-pointer group">
            <Badge
              badgeContent={quantity}
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#1f2937',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  height: '20px',
                  minWidth: '20px',
                }
              }}
            >
              <ShoppingCartOutlined className="text-gray-700 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: 24 }} />
            </Badge>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;