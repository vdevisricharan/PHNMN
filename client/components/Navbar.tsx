'use client';

import React, { useState, useEffect } from "react";
import { 
  Search, 
  ShoppingCartOutlined, 
  PersonOutlined, 
  MenuOutlined, 
  CloseOutlined,
  FavoriteBorderOutlined,
  LogoutOutlined,
  AccountCircleOutlined,
  ListAltOutlined,
  LocationOnOutlined
} from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { RootState } from '../redux/store';
import { logout } from "../redux/apiCalls";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  
  const quantity = useSelector((state: RootState) => state.cart.quantity);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    logout(dispatch);
    router.push("/");
    setIsMenuOpen(false);
    setIsProfileModalOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  // Get first letter of username for profile avatar
  const getInitial = () => {
    return currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U';
  };

  // Close menu on resize to desktop
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen || isProfileModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isProfileModalOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isProfileModalOpen && !target.closest('.profile-modal') && !target.closest('.profile-button')) {
        closeProfileModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileModalOpen]);

  return (
    <>
      <nav className="h-16 md:h-20 flex items-center px-4 lg:px-8 justify-between bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            aria-label="Toggle menu"
            type="button"
          >
            <MenuOutlined style={{ fontSize: 24 }} />
          </button>
        </div>

        {/* Left Section - Search (Desktop) */}
        <div className="hidden md:flex flex-1 items-center space-x-6">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 px-4 py-2 border border-gray-200 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-200">
              <Search className="text-gray-400 mr-2" style={{ fontSize: 20 }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none border-none text-sm placeholder-gray-500 w-32 sm:w-48 lg:w-64"
                placeholder="Search for items..."
                type="text"
              />
            </div>
          </form>
        </div>

        {/* Center Section - Logo */}
        <div className="flex-1 md:flex-initial flex justify-center md:justify-center">
          <Link href="/" onClick={closeMenu}>
            <span className="font-bold text-xl md:text-2xl lg:text-3xl tracking-[0.1em] md:tracking-[0.2em] cursor-pointer text-gray-900 hover:text-gray-700 transition-colors duration-200">
              PHENOMENON
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-6 flex-1 justify-end">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            aria-label="Search"
          >
            <Search style={{ fontSize: 22 }} />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {hasMounted && currentUser ? (
              <>
                {/* Wishlist Icon */}
                <Link href='/wishlist'>
                  <div className="p-2 text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
                    <FavoriteBorderOutlined style={{ fontSize: 22 }} />
                  </div>
                </Link>
                
                {/* Profile Avatar */}
                <div className="relative">
                  <button
                    onClick={toggleProfileModal}
                    className="profile-button w-8 h-8 bg-gray-700 hover:bg-gray-900 text-white flex items-center justify-center font-medium text-sm transition-colors duration-200"
                    aria-label="Profile menu"
                    type="button"
                  >
                    {getInitial()}
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <span className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200 tracking-wide">
                  LOGIN
                </span>
              </Link>
            )}
          </div>

          {/* Cart Icon */}
          <Link href="/cart" onClick={closeMenu}>
            <div className="relative cursor-pointer group p-1">
              <Badge
                badgeContent={quantity}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#1f2937',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    height: '18px',
                    minWidth: '18px',
                  }
                }}
              >
                <ShoppingCartOutlined 
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200" 
                  style={{ fontSize: 22 }} 
                />
              </Badge>
            </div>
          </Link>
        </div>
      </nav>

      {/* Profile Modal */}
      {hasMounted && isProfileModalOpen && currentUser && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 z-40" />
          
          {/* Modal */}
          <div className="profile-modal fixed top-20 right-4 lg:right-8 w-64 bg-white shadow-2xl border border-gray-200 z-50 py-2">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 text-white flex items-center justify-center font-medium">
                  {getInitial()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link href="/profile" onClick={closeProfileModal}>
                <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <AccountCircleOutlined className="text-gray-600" style={{ fontSize: 18 }} />
                  <span className="text-sm text-gray-700">My Profile</span>
                </div>
              </Link>

              <Link href="/orders" onClick={closeProfileModal}>
                <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <ListAltOutlined className="text-gray-600" style={{ fontSize: 18 }} />
                  <span className="text-sm text-gray-700">My Orders</span>
                </div>
              </Link>

              <Link href="/wishlist" onClick={closeProfileModal}>
                <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <FavoriteBorderOutlined className="text-gray-600" style={{ fontSize: 18 }} />
                  <span className="text-sm text-gray-700">My Wishlist</span>
                </div>
              </Link>

              <Link href="/profile/addresses" onClick={closeProfileModal}>
                <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <LocationOnOutlined className="text-gray-600" style={{ fontSize: 18 }} />
                  <span className="text-sm text-gray-700">My Addresses</span>
                </div>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-100 my-1" />

              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogoutOutlined className="text-red-600" style={{ fontSize: 18 }} />
                <span className="text-sm text-red-600">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 p-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-gray-50 px-4 py-3 border border-gray-200 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-200">
              <Search className="text-gray-400 mr-3" style={{ fontSize: 20 }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none border-none text-base placeholder-gray-500 flex-1"
                placeholder="Search for items..."
                type="text"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="ml-2 text-gray-400 hover:text-gray-600"
                title="Close search"
              >
                <CloseOutlined style={{ fontSize: 20 }} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className="md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-bold text-xl tracking-[0.1em] text-gray-900">
                PHENOMENON
              </span>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close menu"
              >
                <CloseOutlined style={{ fontSize: 24 }} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex flex-col p-4 space-y-1">
              {hasMounted && currentUser ? (
                <>
                  <div className="py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 text-white flex items-center justify-center font-medium">
                        {getInitial()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {currentUser.username || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {currentUser.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Link href="/profile" onClick={closeMenu}>
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors">
                      <AccountCircleOutlined className="text-gray-600" />
                      <span className="text-base text-gray-700">Profile</span>
                    </div>
                  </Link>
                </>
              ) : (
                <Link href="/login" onClick={closeMenu}>
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors">
                    <PersonOutlined className="text-gray-600" />
                    <span className="text-base text-gray-700">LOGIN</span>
                  </div>
                </Link>
              )}

              <Link href="/wishlist" onClick={closeMenu}>
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors">
                  <FavoriteBorderOutlined className="text-gray-600" />
                  <span className="text-base text-gray-700">Wishlist</span>
                </div>
              </Link>

              <Link href="/cart" onClick={closeMenu}>
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors">
                  <div className="relative">
                    <ShoppingCartOutlined className="text-gray-600" />
                    {quantity > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 flex items-center justify-center">
                        {quantity}
                      </span>
                    )}
                  </div>
                  <span className="text-base text-gray-700">Cart</span>
                </div>
              </Link>

              {hasMounted && currentUser && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogoutOutlined className="text-red-600" />
                    <span className="text-base text-red-600">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;