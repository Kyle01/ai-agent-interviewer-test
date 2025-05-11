'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewConversation() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartConversation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }
      
      const data = await response.json();
      router.push(`/conversation/${data.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Start New Conversation</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start a new conversation with our AI assistant. Click the button below to begin.
            </p>
            <button
              onClick={handleStartConversation}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Start New Conversation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 