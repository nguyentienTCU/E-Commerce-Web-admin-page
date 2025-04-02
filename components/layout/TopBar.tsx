"use client";
import { navLinks } from "@/lib/constant";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("mobile-menu");
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setDropdownMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-20 w-full bg-gradient-to-r from-blue-2 to-blue-1/5 shadow-lg lg:hidden">
      <div className="flex justify-between items-center px-6 py-4">
        <Image
          src="/logo.png"
          alt="logo"
          width={150}
          height={70}
          className="hover:opacity-90 transition-opacity"
        />

        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              href={link.url}
              key={link.label}
              className={`px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                pathname === link.url
                  ? "text-blue-1 bg-blue-1/10"
                  : "text-gray-700 hover:text-blue-1 hover:bg-blue-1/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                  userButtonPopulator: "text-sm font-medium",
                },
              }}
            />
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-1 transition-colors"
            >
              <CircleUserRound className="w-9 h-9" />
            </Link>
          )}

          <button
            onClick={() => setDropdownMenu(!dropdownMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-1/10 transition-colors"
          >
            {dropdownMenu ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {dropdownMenu && (
        <div
          id="mobile-menu"
          className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 md:hidden"
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                href={link.url}
                key={link.label}
                onClick={() => setDropdownMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === link.url
                    ? "text-blue-1 bg-blue-1/10 font-medium"
                    : "text-gray-700 hover:text-blue-1 hover:bg-blue-1/10"
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
