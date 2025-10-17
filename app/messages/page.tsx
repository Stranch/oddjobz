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

export default function MessagesPage() {
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

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-2xl font-bold text-slate-900">Messages</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="p-4 overflow-y-auto">
            <h2 className="font-bold text-slate-900 mb-4">Conversations</h2>
            {conversations.length === 0 ? (
              <p className="text-slate-600 text-sm">No conversations yet</p>
            ) : (
              <div className="space-y-2">
                {conversations.map((convo) => (
                  <button
                    key={convo.userId}
                    onClick={() => setSelectedConversation(convo.userId)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConversation === convo.userId
                        ? 'bg-blue-100 border border-blue-300'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-medium text-slate-900">{convo.userName}</p>
                    <p className="text-sm text-slate-600 truncate">{convo.lastMessage}</p>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Messages */}
          <div className="md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <Card className="flex-1 p-4 overflow-y-auto mb-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.sender_id === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-900'
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
                </Card>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <Button type="submit">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full">
                <p className="text-slate-600">Select a conversation to start messaging</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
