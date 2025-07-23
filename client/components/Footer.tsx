'use client';

import React from "react";
import Link from "next/link";
import {
    Facebook,
    Instagram,
    MailOutline,
    Phone,
    Room,
    Twitter,
    YouTube,
} from "@mui/icons-material";
import payment from "../assets/payments.png";
import Image from "next/image";

const Footer = () => (
    <footer className="bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Brand Section */}
                <div className="space-y-4 md:space-y-6">
                    <Link href="/">
                        <span className="text-2xl lg:text-3xl font-bold cursor-pointer text-white hover:text-gray-300 transition-colors">
                            PHENOMENON
                        </span>
                    </Link>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                        Redefining Fashion. Discover the latest trends and timeless styles with our curated collections. Elevate your wardrobe and express your unique style.
                    </p>
                    <div className="flex space-x-3 sm:space-x-4">
                        <span className="w-9 h-9 sm:w-10 sm:h-10  bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                            <Facebook fontSize="small" />
                        </span>
                        <span className="w-9 h-9 sm:w-10 sm:h-10  bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 transition-colors cursor-pointer">
                            <Instagram fontSize="small" />
                        </span>
                        <span className="w-9 h-9 sm:w-10 sm:h-10  bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                            <Twitter fontSize="small" />
                        </span>
                        <span className="w-9 h-9 sm:w-10 sm:h-10  bg-red-700 text-white flex items-center justify-center hover:bg-red-800 transition-colors cursor-pointer">
                            <YouTube fontSize="small" />
                        </span>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="space-y-4 md:space-y-6">
                    <h3 className="text-lg lg:text-xl font-bold text-white">QUICK LINKS</h3>
                    <ul className="grid grid-cols-2 gap-2 sm:gap-3">
                        {["Summer","Autumn-Winter", "Top Wear", "Bottom Wear", "Accessories"].map((text) => (
                            <li key={text} className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors cursor-pointer">
                                <Link href={`/products/${text.toUpperCase().replace(/\s+/g, '-')}`}>{text}</Link>
                            </li>
                        ))}
                    </ul>
                    <ul className="grid grid-cols-2 gap-2 sm:gap-3">
                        {["About Us", "Terms-Conditions", "FAQs", "Privacy Policy", "Return Policy"].map((text) => (
                            <li key={text} className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors cursor-pointer">
                                <Link href={`/${text.toLowerCase().replace(/\s+/g, '-')}`}>{text}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="space-y-4 md:space-y-6 md:col-span-2 lg:col-span-1">
                    <h3 className="text-lg lg:text-xl font-bold text-white">CONTACT</h3>
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start text-gray-400">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 mr-3">
                                <Room fontSize="small" />
                            </div>
                            <span className="text-sm sm:text-base leading-relaxed">
                                Road no. 26, Jubilee Hills, Hyderabad, Telangana, India
                            </span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 mr-3">
                                <Phone fontSize="small" />
                            </div>
                            <a href="tel:+911234567890" className="text-sm sm:text-base hover:text-white transition-colors">
                                +91 1234567890
                            </a>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 mr-3">
                                <MailOutline fontSize="small" />
                            </div>
                            <a href="mailto:hey@phenomenonfashion.in" className="text-sm sm:text-base hover:text-white transition-colors">
                                hey@phenomenonfashion.in
                            </a>
                        </div>
                        <div className="flex items-center">
                            <Image 
                                src={payment} 
                                alt="Accepted Payment Methods" 
                                className="w-32 sm:w-40 lg:w-48 h-auto" 
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Copyright Section */}
            <div className="border-t border-gray-800 mt-8 lg:mt-12 pt-6 lg:pt-8 text-center">
                <p className="text-xs sm:text-sm text-gray-400">
                    © 2025 Phenomenon Fashion. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;