"use client";
import React, { useState } from "react";

type NeumorphicButtonProps = {
  onClick?: undefined | ((e: React.MouseEvent) => void | Promise<void>);
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function NeumorphicButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: NeumorphicButtonProps) {
  const [loading, setLoading] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick === undefined || disabled) {
      return;
    }
    setPressed(true);
    setLoading(true);
    const result = onClick(e);

    try {
      if (result instanceof Promise) {
        await result;
      }
      //   await onClick(e);
    } finally {
      setLoading(false);
      setPressed(false);
    }
  };

  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-full font-semibold transition-transform duration-150
        ${
          pressed || loading
            ? "neumorphic-pressed rounded-[12px] scale-95"
            : "neumorphic rounded-[12px] hover:scale-105"
        }
        ${className}
        ${loading || disabled ? "cursor-not-allowed opacity-70" : ""}
      `}
      onClick={handleClick}
      disabled={loading || disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      <span
        className={`flex items-center justify-center gap-2 transition-transform duration-150 ${
          pressed || loading ? "translate-y-px" : ""
        }`}
      >
        {loading && (
          <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
        )}
        {children}
      </span>
    </button>
  );
}
