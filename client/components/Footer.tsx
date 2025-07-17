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
    <footer className="flex flex-col md:flex-row bg-black py-10 px-6">
        <div className="flex-1 flex flex-col mb-8 md:mb-0">
            <Link href="/">
                <span className="text-2xl font-bold mb-4 cursor-pointer text-white">PHENOMENON</span>
            </Link>
            <p className="mb-6 text-gray-400">
                Redefining Fashion. Discover the latest trends and timeless styles with our curated collections. Elevate your wardrobe and express your unique style with PHENOMENON.
            </p>
            <div className="flex space-x-4">
                <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"><Facebook /></span>
                <span className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center"><Instagram /></span>
                <span className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center"><Twitter /></span>
                <span className="w-10 h-10 rounded-full bg-red-700 text-white flex items-center justify-center"><YouTube /></span>
            </div>
        </div>
        <div className="flex-1 px-4 mb-8 md:mb-0">
            <h3 className="font-bold mb-6">Quick Links</h3>
            <ul className="flex flex-wrap gap-y-2">
                {["Home", "Cart", "Men Fashion", "Women Fashion", "Accessories", "My Account", "Order Tracking", "Wishlist", "Terms", "FAQs", "Privacy Policy", "Return Policy"].map((text) => (
                    <li key={text} className="w-1/2 text-gray-400">{text}</li>
                ))}
            </ul>
        </div>
        <div className="flex-1 px-4">
            <h3 className="font-bold mb-6">Contact</h3>
            <div className="mb-4 flex items-center text-gray-400">
                <Room className="mr-2" />
                Phenomenon Fashion Private Limited, Plot No. 26, Road no. 26, Jubilee Hills, Hyderabad - 506001, Telangana, India
            </div>
            <div className="mb-4 flex items-center text-gray-400">
                <Phone className="mr-2" />
                +91 1234567890
            </div>
            <div className="mb-4 flex items-center text-gray-400">
                <MailOutline className="mr-2" />
                hey@phenomenonfashion.in
                <Image src={payment} alt="Payments" className="w-1/2 mt-4" />
            </div>
        </div>
    </footer>
);

export default Footer;