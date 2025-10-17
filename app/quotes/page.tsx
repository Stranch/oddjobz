'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus } from 'lucide-react';

interface Quote {
  id: number;
  provider_id: number;
  customer_id: number;
  title: string;
  description?: string;
  amount: number;
  status: string;
  created_at: string;
  provider_name: string;
  customer_name: string;
}

export default function QuotesPage() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    customerId: '',
  });

  useEffect(() => {
    if (user) {
      fetchQuotes();
    }
  }, [user]);

  const fetchQuotes = async () => {
    try {
      const res = await fetch(`/api/quotes?userId=${user?.id}&role=provider`);
      const data = await res.json();
      setQuotes(data);
    } catch (error) {
      console.error('Failed to fetch quotes', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: user?.id,
          customerId: parseInt(formData.customerId),
          title: formData.title,
          description: formData.description,
          amount: parseFloat(formData.amount),
        }),
      });

      setFormData({ title: '', description: '', amount: '', customerId: '' });
      setIsOpen(false);
      fetchQuotes();
    } catch (error) {
      console.error('Failed to create quote', error);
    }
  };

  const handleStatusChange = async (quoteId: number, newStatus: string) => {
    try {
      await fetch(`/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      fetchQuotes();
    } catch (error) {
      console.error('Failed to update quote', error);
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
              <span className="text-2xl font-bold text-slate-900">Quotes</span>
            </div>
          </Link>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Quote
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Quote</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Garden Maintenance"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the work..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Amount (R)</label>
                  <Input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="500"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Customer ID</label>
                  <Input
                    type="number"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                    placeholder="Customer ID"
                    required
                  />
                  <p className="text-xs text-slate-600 mt-1">Placeholder: Enter the customer's user ID</p>
                </div>

                <Button type="submit" className="w-full">
                  Create Quote
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {quotes.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600 mb-4">No quotes yet</p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>Create Your First Quote</Button>
              </DialogTrigger>
            </Dialog>
          </Card>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <Card key={quote.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{quote.title}</h3>
                    <p className="text-slate-600">To: {quote.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">R{quote.amount}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                </div>

                {quote.description && (
                  <p className="text-slate-600 mb-4">{quote.description}</p>
                )}

                <p className="text-sm text-slate-500 mb-4">
                  Created: {new Date(quote.created_at).toLocaleDateString()}
                </p>

                {quote.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(quote.id, 'accepted')}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(quote.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
