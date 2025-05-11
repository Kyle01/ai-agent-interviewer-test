'use client'

import Image from "next/image";
import Link from "next/link";

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="w-[300px] border-r border-black/[.08] dark:border-white/[.145] p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={25}
              priority
            />
          </Link>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link
            href="/conversation/new"
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="New conversation icon"
              width={16}
              height={16}
            />
            New Conversation
          </Link>
          <Link
            href="/conversation"
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Conversations icon"
              width={16}
              height={16}
            />
            My Conversations
          </Link>
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
          <Link
            href="/"
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Home icon"
              width={16}
              height={16}
            />
            Back to Home
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 