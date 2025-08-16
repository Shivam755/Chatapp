import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#e0e5ec] dark:bg-[#23272f]">
      <div className="neumorphic dark:neumorphic-dark p-10 flex flex-col items-center max-w-lg w-full">
        <h1 className="text-5xl font-extrabold mb-4 text-center text-gray-800 dark:text-gray-100">
          Welcome to ChatVerse
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
          Connect, chat, and share moments instantly.<br />
          Experience seamless messaging with friends and communities.
        </p>
        <div className="flex gap-6">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-full neumorphic dark:neumorphic-dark text-purple-600 dark:text-pink-400 font-semibold shadow hover:scale-105 transition-transform"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-full neumorphic dark:neumorphic-dark text-blue-600 dark:text-blue-300 font-semibold shadow hover:scale-105 transition-transform"
          >
            Login
          </Link>
        </div>
        <div className="mt-10 flex flex-col items-center">
          <span className="text-sm text-gray-400 dark:text-gray-500 mb-2">Fast • Secure • Fun</span>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#e0e5ec" />
            <path
              d="M8 12h8M8 16h5"
              stroke="#6366F1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </main>
  );
}