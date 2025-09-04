"use client";
import React, { useState } from "react";
import Link from "next/link";

type NeumorphicLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function NeumorphicLink({
  children,
  href,
  className = "",
}: NeumorphicLinkProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = async () => {

    setPressed(true);
    setPressed(false);
    
  };

  return (
    <Link
      type="button"
      className={`px-4 py-2 rounded-full font-semibold transition-transform duration-150
        ${
          pressed
            ? "neumorphic-pressed scale-95"
            : "neumorphic hover:scale-105"
        }
        ${className}
      `}
      onClick={handleClick}
      href={href}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      <span
        className={`flex items-center justify-center gap-2 transition-transform duration-150 ${
          pressed ? "translate-y-px" : ""
        }`}
      >
        {children}
      </span>
    </Link>
  );
}
