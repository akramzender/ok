
"use client"; // Required for components with state or events

import { Menu } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const LandingPageNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // Toggle menu state
  };

  return (
    <nav className="relative flex w-full justify-between items-center py-4 px-6 bg-[#121212] shadow-md">
      {/* Left Section: Logo and Mobile Menu */}
      <div className="flex items-center gap-x-4">
        <div className="relative lg:hidden">
          <Menu
            className="w-7 h-7 cursor-pointer text-[#f5f8f7] hover:text-[#00a87e] transition-transform duration-300 transform hover:scale-110"
            onClick={toggleMenu}
          />
          {menuOpen && (
            <div className="absolute top-12 left-0 w-56 bg-[#1e1e1e] rounded-lg shadow-lg z-50">
              <ul className="flex flex-col text-sm text-gray-300">
                <li className="hover:bg-[#00a87e] hover:text-white transition">
                  <Link href="/" className="block px-5 py-3">
                    Home
                  </Link>
                </li>
                <li className="hover:bg-[#00a87e] hover:text-white transition">
                  <Link href="#pricing" className="block px-5 py-3">
                    Pricing
                  </Link>
                </li>
                <li className="hover:bg-[#00a87e] hover:text-white transition">
                  <Link href="#contact" className="block px-5 py-3">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <Image
            src="/odix.svg" // Replace with the actual path to your logo
            alt="Logo"
            width={32} // Width in pixels
            height={32} // Height in pixels
            className="mr-2"
          />
          <span className="text-2xl font-bold text-[#ffffff]">Odix</span>
        </div>
      </div>

      {/* Middle Section: Links for Large Screens */}
      <div className="hidden lg:flex gap-x-8">
        <Link href="/" className="text-gray-200 hover:text-[#00a87e] transition">
          Home
        </Link>
        <Link
          href="#pricing"
          className="text-gray-200 hover:text-[#00a87e] transition"
        >
          Pricing
        </Link>
        <Link
          href="#contact"
          className="text-gray-200 hover:text-[#00a87e] transition"
        >
          Contact
        </Link>
      </div>

      {/* Right Section: Login and Sign-Up Buttons */}
      <div className="flex gap-x-4">
        <Link href="/auth/sign-in">
          <Button className="bg-[#008068] text-white hover:bg-[#00a87e] transition px-4 py-2">
            Login
          </Button>
        </Link>

        <Link href="/auth/sign-up">
          <Button className="bg-[#008068] text-white hover:bg-[#00a87e] transition px-4 py-2">
            Sign Up
          </Button>
        </Link>
        
      </div>
    </nav>
  );
};

export default LandingPageNavbar;