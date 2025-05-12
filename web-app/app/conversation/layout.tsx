'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Conversation {
  id: string;
  messages: Array<{
    id: string;
    content: string;
    role: string;
    timestamp: string;
  }>;
  status: string;
}

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/conversations');
        const data = await response.json();
          setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);
  
  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="w-[300px] border-r border-black/[.08] dark:border-white/[.145] p-6 flex flex-col gap-6">
        
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
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/conversation/${conversation.id}`}
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            >
              {conversation?.id.slice(0, 20)}...
            </Link>
          ))}
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