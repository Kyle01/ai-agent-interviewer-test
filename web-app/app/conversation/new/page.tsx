'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Conversation from '@/app/components/conversation';

const defaultConversation = [{
  role: 'assistant',
  content: 'Hello! Are you currently open to discussing this role?',
  id: '1',
  timestamp: '2021-01-01 12:00:00',
  status: 'active',
  stage: '1',
}]

export default function NewConversation() {
  const router = useRouter();
  const [conversation, setConversation] = useState(defaultConversation);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: input, stage: '1' }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setConversation(data.messages);
      setInput('');
      
      // Redirect to the conversation page with the new ID
      // router.push(`/conversation/${data.id}`);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = conversation.at(-1)?.status === 'active';

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <Conversation messages={conversation} isLoading={isLoading} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmitResponse} className="p-4 border-t dark:border-gray-700">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || !isActive}
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