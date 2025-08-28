"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { ReactElement, useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth.store";
import NeumorphicButton from "@/components/NeumorphicButton";
import { logoutUser } from "@/services/user.api";
import { useToast } from "@/components/Toast";

export default function Navbar() {
  const pathname = usePathname();
  const { loginId, isSignedIn } = useAuthStore();
  const signOut = useAuthStore((state) => state.signOut);
  const { showToast } = useToast();
  const router = useRouter();
  const [navItems, setNavItems] = useState<ReactElement>();

  const linkClass = (href: string) =>
    `px-4 py-2 rounded-full neumorphic font-semibold transition-transform ${
      pathname === href ? "scale-105 border-2 border-blue-500" : "text-gray-900"
    }`;

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    let response = await logoutUser();
    if (!response.success) {
      showToast(response.error ?? "", "error");
      return;
    }
    // clear store
    signOut();
    showToast("Logout successful!", "success");
    // Redirect to home page after successful login
    setTimeout(() => router.push("/login"), 1200);
  };

  const NavElements = () => {
    console.log('NavElement called');
    console.log(isSignedIn);

    if (isSignedIn) {
      setNavItems (
        <div className="flex items-center gap-4">
          <NeumorphicButton onClick={handleSubmit}>Logout</NeumorphicButton>
        </div>
      );
    } else {
      setNavItems (
        <div className="flex items-center gap-4">
          <Link href="/login" className={linkClass("/login")}>
            Login
          </Link>
          <Link href="/signup" className={linkClass("/signup")}>
            Signup
          </Link>
        </div>
      );
    }
  };

  useEffect(NavElements, [isSignedIn])


  return (
    <nav className="flex items-center justify-between px-6 py-4 neumorphic mb-8 mx-4 mt-4">
      <div className="text-xl font-bold text-gray-800">
        <Link href="/">Chat App</Link>
      </div>
      {navItems}
    </nav>
  );
}
