'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Conversation from '@/app/components/conversation';
import { Message, CandidateProfile, CandidateProfileStatus } from '@/app/types';

export default function ConversationDetail() {
  const params = useParams();
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [status, setStatus] = useState<CandidateProfileStatus>(CandidateProfileStatus.IN_PROGRESS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await fetch(`/api/conversations/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch conversation');
        }
        const data = await response.json();
        setMessages(data.messages || []);
        setStatus(data.status || CandidateProfileStatus.IN_PROGRESS);
        setCandidateProfile(data.candidateProfile || null);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };

    fetchConversation();
  }, [params.id]);

  console.log('Candidate Profile:', candidateProfile);
  console.log('Status:', status);
  console.log('Messages:', messages);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages(prev => [...prev, ({ content: newMessage, role: 'user' })]);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/conversations/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(data.messages || []);
      setStatus(data.status || CandidateProfileStatus.IN_PROGRESS);
      setCandidateProfile(data.candidateProfile || null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Conversation messages={messages} isLoading={isLoading} />
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
        <div className="flex gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
} 