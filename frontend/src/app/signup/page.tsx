'use client';
import React, { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const inputClass =
    "border-none neumorphic px-3 py-2 rounded text-gray-900 focus:outline-none";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#e0e5ec]">
      <div className="neumorphic p-8 w-80 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Sign Up</h1>
        <form className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Name"
            className={inputClass}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className={inputClass}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={inputClass}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 rounded-full neumorphic text-purple-600 font-semibold shadow hover:scale-105 transition-transform"
          >
            Sign Up
          </button>
        </form>
      </div>
    </main>
  );
}