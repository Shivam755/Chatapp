"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const linkClass = (href: string) =>
    `px-4 py-2 rounded-full neumorphic dark:neumorphic-dark font-semibold transition-transform ${
      pathname === href
        ? "scale-105 border-2 border-blue-500 dark:border-pink-400"
        : "text-gray-900 dark:text-gray-100"
    }`;

  return (
    <nav className="flex items-center justify-between px-6 py-4 neumorphic dark:neumorphic-dark mb-8">
      <div className="text-xl font-bold text-gray-800 dark:text-gray-100">Chat App</div>
      <div className="flex items-center gap-4">
        <Link href="/login" className={linkClass("/login")}>
          Login
        </Link>
        <Link href="/signup" className={linkClass("/signup")}>
          Signup
        </Link>
        <button
          onClick={() => setDark((d) => !d)}
          className="px-4 py-2 rounded-full neumorphic dark:neumorphic-dark font-semibold"
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
}