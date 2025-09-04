"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";
import NeumorphicButton from "@/components/NeumorphicButton";
import NeumorphicLink from "@/components/NeumorphicLink";
import { logoutUser } from "@/services/user.api";
import { useToast } from "@/components/Toast";
import ProfileButton from "@/components/ProfileButton";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, data } = useAuthStore();
  const signOut = useAuthStore((state) => state.signOut);
  const { showToast } = useToast();
  const router = useRouter();

  const linkClass = (href: string) =>
    `${
      pathname === href ? "scale-105 border-2 border-blue-500" : "text-gray-900"
    }`;

  const ToProfile = (e:React.MouseEvent) =>{
    router.replace("/profile");
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    let response = await logoutUser();
    if (!response.success) {
      showToast(response.error ?? "", "error");
      return;
    }
    // clear store
    signOut();
    showToast("Logout successful!", "success");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 neumorphic mb-8 mx-4 mt-4">
      <div className="text-xl font-bold text-gray-800">
        <Link href="/">ChatVerse</Link>
      </div>
      {isSignedIn ? (
        <div className="flex items-center gap-4">
          <NeumorphicLink href="/listChat" className={linkClass("/listChat")}>
            Chat
          </NeumorphicLink>
          <ProfileButton onClickSync={ToProfile} photoUrl={data?.profileImage ?? ""} className={linkClass("/profile")}/>
          <NeumorphicButton onClick={handleLogout}>Logout</NeumorphicButton>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <NeumorphicLink href="/login" className={linkClass("/login")}>
            Login
          </NeumorphicLink>
          <NeumorphicLink href="/signup" className={linkClass("/signup")}>
            Signup
          </NeumorphicLink>
        </div>
      )}
    </nav>
  );
}
