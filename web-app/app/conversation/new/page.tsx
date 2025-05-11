'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Conversation from '@/app/components/conversation';

const defaultConversation = [{
  role: 'assistant',
  content: 'Hello, how can I help you today?',
  id: '1',
  timestamp: '2021-01-01 12:00:00'
}]

export default function NewConversation() {
  const router = useRouter();
  const [conversation, setConversation] = useState(defaultConversation);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setConversation([...conversation, {
      role: 'user',
      content: input,
      id: String(conversation.length + 1),
      timestamp: new Date().toISOString()
    }]);

    setInput('');
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <Conversation messages={conversation} />
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
              placeholder="Type your first message..."
              className="flex-1 p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Starting...' : 'Start with Message'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 