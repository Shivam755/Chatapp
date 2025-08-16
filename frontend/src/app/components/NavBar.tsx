"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `px-4 py-2 rounded-full neumorphic font-semibold transition-transform ${
      pathname === href
        ? "scale-105 border-2 border-blue-500"
        : "text-gray-900"
    }`;

  return (
    <nav className="flex items-center justify-between px-6 py-4 neumorphic mb-8">
      <div className="text-xl font-bold text-gray-800">Chat App</div>
      <div className="flex items-center gap-4">
        <Link href="/login" className={linkClass("/login")}>
          Login
        </Link>
        <Link href="/signup" className={linkClass("/signup")}>
          Signup
        </Link>
      </div>
    </nav>
  );
}