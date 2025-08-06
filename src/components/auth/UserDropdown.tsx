"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { AiOutlineUser } from "react-icons/ai";
import Link from "next/link";

export default function UserDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsOpen(false);
  };

  if (status === "loading") {
    return (
      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-1 rounded-md hover:bg-gray-100"
      >
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt="Profile"
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <AiOutlineUser className="text-xl text-gray-700 hover:text-gray-900" />
        )}
        {session?.user?.name && (
          <span className="hidden md:block text-sm text-gray-700 max-w-20 truncate">
            {session.user.name.split(' ')[0]}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          {session ? (
            // Logged in user menu
            <div className="py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {session.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">{session.user?.email}</p>
              </div>
              
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Profile Settings
              </Link>
              
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile Settings
              </Link>
              <Link
                href="/profile/orders"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                My Orders
              </Link>
              
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          ) : (
            // Guest user menu
            <div className="py-1">
              <Link
                href="/auth/signin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              
              <Link
                href="/auth/signup"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Create Account
              </Link>
              
              <div className="border-t border-gray-100 mt-1 pt-1">
                <Link
                  href="/orders/guest"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Track Order (Guest)
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
