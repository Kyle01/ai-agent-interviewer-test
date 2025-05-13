'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const calculateProgress = (conversation: any) => {
  const totalFields = 12;
  const filledFields = Object.values(conversation).filter(value => value !== null && value !== undefined && value !== '').length;
  return filledFields / totalFields;
}

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<any[]>([]);
  const pathname = usePathname();

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
  }, [pathname]);
  
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
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/conversation/${conversation.id}`}
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              >
                <div className="m-2 text-sm">
                  <p>Name: {conversation?.candidateName || 'Name missing'}</p>
                  <p className={`capitalize ${conversation?.status === 'completed' ? 'text-green-500' : conversation?.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>Status: {conversation?.status?.replace('_', ' ')}</p>
                  <p>Information collected: {calculateProgress(conversation).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:0, maximumFractionDigits:0})}</p>
                </div>
              </Link>
            ))}
          </div>
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