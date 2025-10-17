'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft } from 'lucide-react';

interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at: string;
  sender_name: string;
  recipient_name: string;
}

interface Conversation {
  userId: number;
  userName: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export default function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const conversationWith = searchParams.get('with');

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(
    conversationWith ? parseInt(conversationWith) : null
  );
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [user, selectedConversation]);

  const fetchMessages = async () => {
    try {
      const url = selectedConversation
        ? `/api/messages?userId=${user?.id}&conversationWith=${selectedConversation}`
        : `/api/messages?userId=${user?.id}`;

      const res = await fetch(url);
      const data = await res.json();
      setMessages(data);

      // Extract unique conversations
      const convos = new Map<number, Conversation>();
      data.forEach((msg: Message) => {
        const otherUserId = msg.sender_id === user?.id ? msg.recipient_id : msg.sender_id;
        const otherUserName = msg.sender_id === user?.id ? msg.recipient_name : msg.sender_name;

        if (!convos.has(otherUserId)) {
          convos.set(otherUserId, {
            userId: otherUserId,
            userName: otherUserName,
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
          });
        }
      });

      setConversations(Array.from(convos.values()));
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user?.id,
          recipientId: selectedConversation,
          content: messageText,
        }),
      });

      setMessageText('');
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view messages</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations yet</div>
          ) : (
            conversations.map((convo) => (
              <button
                key={convo.userId}
                onClick={() => setSelectedConversation(convo.userId)}
                className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition ${
                  selectedConversation === convo.userId ? 'bg-blue-50' : ''
                }`}
              >
                <p className="font-medium text-gray-900">{convo.userName}</p>
                <p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Messages View */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">
                {conversations.find((c) => c.userId === selectedConversation)?.userName}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages
                .filter(
                  (msg) =>
                    (msg.sender_id === user.id && msg.recipient_id === selectedConversation) ||
                    (msg.sender_id === selectedConversation && msg.recipient_id === user.id)
                )
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender_id === user.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex gap-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
