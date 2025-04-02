"use client";
import { navLinks } from "@/lib/constant";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { CircleUserRound } from "lucide-react";

const LeftSideBar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="h-screen left-0 top-0 sticky p-8 flex flex-col gap-12 bg-blue-2 shadow-xl max-lg:hidden">
      <div className="flex items-center justify-center">
        <Image src="/logo.png" alt="logo" width={150} height={70} />
      </div>

      <nav className="flex flex-col gap-8">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg ${
              pathname === link.url
                ? "text-blue-1 bg-white"
                : "text-gray-700 hover:bg-white"
            }`}
          >
            <span>{link.icon}</span>
            <span className="text-sm">{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-200 pt-6">
        <div className="flex items-center gap-4 px-4">
          {user ? (
            <>
              <UserButton />
              <span className="text-sm text-gray-700">Edit Profile</span>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center gap-4 text-gray-700"
            >
              <CircleUserRound />
              <span className="text-sm">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
