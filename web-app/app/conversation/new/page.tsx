'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Conversation from '@/app/components/conversation';
import { Message, CandidateProfileStatus } from '@/app/types';
import { cannedRejectionMessage, cannedAcceptanceMessage } from '@/app/constants';

const defaultConversation: Message[] = [{
  role: 'assistant',
  content: 'Hello! Are you currently open to discussing this role?',
  timestamp: new Date().toISOString(),
}]

export default function NewConversation() {
  const router = useRouter();
  const [conversation, setConversation] = useState<Array<Message>>(defaultConversation);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setConversation(conversation => [...conversation, ({ content: input, role: 'user' })]);
    setIsLoading(true);
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      if (data.status === CandidateProfileStatus.REJECTED) {
        setConversation(prev => [...prev, ({ content: cannedRejectionMessage, role: 'assistant' })]);
      } else if (data.status === CandidateProfileStatus.COMPLETED) {
        setConversation(prev => [...prev, ({ content: cannedAcceptanceMessage, role: 'assistant' })]);
      } else {
        setConversation(data.messages || []);
      }
      setConversation(data.messages || []);
      setInput('');
      
      // Pass the initial data through URL search params
      const searchParams = new URLSearchParams();
      searchParams.set('initialData', JSON.stringify({
        messages: data.messages,
        status: data.status,
        candidateProfile: data.candidate_profile
      }));
      
      router.push(`/conversation/${data.id}?${searchParams.toString()}`);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <Conversation messages={conversation} isLoading={isLoading} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmitResponse} className="p-4 border-t dark:border-gray-700">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 