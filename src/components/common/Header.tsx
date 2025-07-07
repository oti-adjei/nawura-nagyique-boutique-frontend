"use client";

import React, { useEffect, useState } from "react";
import {
    AiOutlineSearch,
    AiOutlineUser,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
// import LocationPopup from "./LocationPopups";
// import { IoLocationOutline } from "react-icons/io5";
import { useCartStore } from "@/store/cart/useCart";
import SearchDialog from "./SearchDialog";
import { CountryData, useLocationStore } from "@/store/location/useLocationStore";
import { ChevronDownIcon } from "lucide-react";
import LocationDialog from "./LocationDialog";

const Header = () => {
    const { country, currency, setCountryAndCurrency, setCurrency, allCountries } = useLocationStore();
    const itemCount = useCartStore((state) => state.getItemCount());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);


        // --- ADD THIS: State and handlers for the Search Dialog ---
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => setIsSearchOpen(false);

    // --- END ---

    const availableCurrencies = [...new Set(allCountries.map(c => c.currency))].sort();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };


    const handleLocationSelect = (selectedCountry: CountryData) => {
        setCountryAndCurrency(selectedCountry);
    };

    // New state to track if component has mounted on the client
    const [hasMounted, setHasMounted] = useState(false);
 
    // Set hasMounted to true after the component mounts on the client
    useEffect(() => {
        setHasMounted(true);
    }, []);


    


    return (
        <>
        <header className="bg-white sticky top-0 z-50 shadow-md">
            {/* Top Bar */}
            <div className="bg-gray-100 text-gray-600 py-2 text-sm hidden md:block">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span>+90 535 456 55 60</span>
                        <span>+90 535 456 55 60</span>
                    </div>
                    <div>
                        <span>Worldwide Discount on Shipping Over $100</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/help" className="hover:text-gray-800">
                            Help
                        </Link>
                        <Link href="/track-order" className="hover:text-gray-800">
                            Track Order
                        </Link>
                        <div className="relative">
                            <button className="hover:text-gray-800 focus:outline-none">
                                English <span className="text-xs">&#9660;</span>
                            </button>
                            {/* Add dropdown for language if needed */}
                        </div>
                        <div className="relative">
                            {/* --- CHANGE: CURRENCY SELECTOR IS NOW DYNAMIC --- */}
                                <select 
                                    value={currency} 
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="bg-transparent hover:text-gray-800 focus:outline-none appearance-none pr-4"
                                >
                                    {availableCurrencies.length > 0 ? (
                                        availableCurrencies.map(curr => (
                                            <option key={curr} value={curr}>{curr}</option>
                                        ))
                                    ) : (
                                        // Show the currently selected currency if list hasn't loaded
                                        <option value={currency}>{currency}</option>
                                    )}
                                </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto  px-12 py-4 flex items-center justify-between">
                {/* Logo */}

                  {/* LOCATION SELECTOR TRIGGER */}
                    <button
                        onClick={() => setIsLocationOpen(true)}
                        className="flex items-center space-x-1 cursor-pointer p-2 rounded-md hover:bg-gray-100"
                    >
                        <span className="text-2xl">{country.flag}</span>
                        <span className="text-sm font-medium text-gray-700">{country.name}</span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                    </button>
                {/* <Link href="/" className="text-xl font-semibold text-gray-800">
                    YourBrandName
                </Link> */}

                {/* Navigation (Desktop) */}
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="Nagyique Logo"
                        width={120}
                        height={30}
                    />
                </Link>

                {/* Icons */}
                <div className="flex items-center space-x-4">
                    
                   <button type="button" onClick={openSearch} aria-label="Open search dialog">
                            <AiOutlineSearch className="text-xl cursor-pointer text-gray-700 hover:text-gray-900" />
                        </button>
                    <Link href="/shop">
                        <AiOutlineUser className="text-xl cursor-pointer text-gray-700 hover:text-gray-900 hidden sm:block" />
                    </Link>
                    <div className="relative">
                        <Link href="/cart">
                            <AiOutlineShoppingCart className="text-xl cursor-pointer text-gray-700 hover:text-gray-900" />
                        </Link>

                        {/* FIX: Only render the span if hasMounted is true */}
                        {hasMounted && itemCount > 0 && (
                            <span className="absolute top-[-6px] right-[-6px] bg-red-500 text-white text-xs rounded-full px-1">
                                {itemCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden focus:outline-none"
                    >
                        <FiMenu className="text-2xl text-gray-700 hover:text-gray-900" />
                    </button>
                </div>
            </div>

            {/* Nav section  */}
            <div className="container mx-auto py-4 flex items-center justify-between">
                {/* Logo */}
                <div></div>

                {/* Navigation (Desktop) */}
                <nav className="hidden md:flex text-sm space-x-6">
                    <Link href="/" className="hover:text-gray-800">
                        Home
                    </Link>
                    <Link href="/shop" className="hover:text-gray-800">
                        Shop
                    </Link>
                    <Link href="/about" className="hover:text-gray-800">
                        About
                    </Link>
                    <Link href="/contact" className="hover:text-gray-800">
                        Contact
                    </Link>
                </nav>

                <div></div>

            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-100 py-4">
                    <div className="container mx-auto flex flex-col space-y-3">
                        <Link href="/" className="hover:text-gray-800 py-2 px-4">
                            Home
                        </Link>
                        <Link href="/shop" className="hover:text-gray-800 py-2 px-4">
                            Shop
                        </Link>
                        <Link href="/shop" className="hover:text-gray-800 py-2 px-4">
                            Shop
                        </Link>
                        <Link href="/shop" className="hover:text-gray-800 py-2 px-4">
                            Shop
                        </Link>
                        <Link href="/help" className="hover:text-gray-800 py-2 px-4">
                            Help
                        </Link>
                        <Link href="/track-order" className="hover:text-gray-800 py-2 px-4">
                            Track Order
                        </Link>
                        <div className="py-2 px-4">
                            <button className="hover:text-gray-800 focus:outline-none">
                                English
                            </button>
                            {/* Add language options here */}
                        </div>
                        <div className="py-2 px-4">
                            <button className="hover:text-gray-800 focus:outline-none">
                                USD
                            </button>
                            {/* Add currency options here */}
                        </div>
                    </div>
                </div>
            )}
        </header>
        {/* --- ADD THIS: Render the SearchDialog and pass it the state and close handler --- */}
            <SearchDialog isOpen={isSearchOpen} onClose={closeSearch} />
             <LocationDialog
                isOpen={isLocationOpen}
                onClose={() => setIsLocationOpen(false)}
                onSelect={handleLocationSelect}
            />
        </>
    );
};

export default Header;
