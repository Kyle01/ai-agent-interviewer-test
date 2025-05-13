'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Conversation from '@/app/components/conversation';
import { Message, CandidateProfile, CandidateProfileStatus } from '@/app/types';

export const cannedRejectionMessage = "Thank you for your interest in our company. This isn't a good fit at this time."
export const cannedAcceptanceMessage = "Thank you for completing the application. We'll be in touch soon."

export default function ConversationDetail() {
  const params = useParams();
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [status, setStatus] = useState<CandidateProfileStatus>(CandidateProfileStatus.IN_PROGRESS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await fetch(`/api/conversations/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch conversation');
        }
        const data = await response.json();
        setStatus(data.status || CandidateProfileStatus.IN_PROGRESS);
        if (data.status === CandidateProfileStatus.REJECTED) {
          setMessages([...data.messages, ({ content: cannedRejectionMessage, role: 'assistant' })]);
        } else if (data.status === CandidateProfileStatus.COMPLETED) {
          setMessages([...data.messages, ({ content: cannedAcceptanceMessage, role: 'assistant' })]);
        } else {
          setMessages(data.messages || []);
        }
        setCandidateProfile(data.candidateProfile || null);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };

    fetchConversation();
  }, [params.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages(prev => [...prev, ({ content: newMessage, role: 'user' })]);
    setIsLoading(true);
    setNewMessage('');
    try {
      const response = await fetch(`/api/conversations/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage, id: params.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const data = await response.json();
      if (data.status === CandidateProfileStatus.REJECTED) {
        setMessages(prev => [...prev, ({ content: cannedRejectionMessage, role: 'assistant' })]);
      } else if (data.status === CandidateProfileStatus.COMPLETED) {
        setMessages(prev => [...prev, ({ content: cannedAcceptanceMessage, role: 'assistant' })]);
      } else {
        setMessages(data.messages || []);
      }
      setStatus(data.status || CandidateProfileStatus.IN_PROGRESS);
      setCandidateProfile(data.candidate_profile || null);
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
            disabled={isLoading || !newMessage.trim() || status === CandidateProfileStatus.COMPLETED || status === CandidateProfileStatus.REJECTED}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Show Data
          </button>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Candidate Profile</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {candidateProfile ? (
                Object.entries(candidateProfile).map(([key, value]) => (
                  <div key={key} className="border-b dark:border-gray-700 pb-2">
                    <p className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value || 'Not provided'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No profile data available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 