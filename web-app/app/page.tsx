'use client'

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
          Your AI Interview Assistant
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
          Practice interviews with our advanced AI assistant. Get instant feedback, improve your responses, and boost your confidence for your next interview.
        </p>
        <Link
          href="/conversation/new"
          className="inline-block px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Start Practicing Now
        </Link>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Image
                src="/file.svg"
                alt="Practice icon"
                width={24}
                height={24}
                className="dark:invert"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Practice
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Practice with our AI assistant anytime, anywhere. Get instant feedback on your responses.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Image
                src="/window.svg"
                alt="Feedback icon"
                width={24}
                height={24}
                className="dark:invert"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Smart Feedback
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Receive detailed feedback on your answers, including suggestions for improvement.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Image
                src="/globe.svg"
                alt="Progress icon"
                width={24}
                height={24}
                className="dark:invert"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your improvement over time with detailed analytics and progress tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
