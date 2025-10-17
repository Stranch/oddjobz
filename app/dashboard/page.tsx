'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, MessageSquare, FileText, Star, Edit } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ messages: 0, quotes: 0, reviews: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const [messagesRes, quotesRes, reviewsRes] = await Promise.all([
        fetch(`/api/messages?userId=${user?.id}`).catch(() => ({ json: async () => [] })),
        fetch(`/api/quotes?userId=${user?.id}&role=provider`).catch(() => ({ json: async () => [] })),
        fetch(`/api/reviews?providerId=${user?.id}`).catch(() => ({ json: async () => [] })),
      ]);

      const messages = await messagesRes.json().catch(() => []);
      const quotes = await quotesRes.json().catch(() => []);
      const reviews = await reviewsRes.json().catch(() => []);

      setStats({
        messages: Array.isArray(messages) ? messages.length : 0,
        quotes: Array.isArray(quotes) ? quotes.length : 0,
        reviews: Array.isArray(reviews) ? reviews.length : 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const rating = user.rating ? parseFloat(user.rating.toString()).toFixed(1) : 'N/A';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-slate-900">OddJobz</div>
          <div className="flex gap-4 items-center">
            <span className="text-slate-600">{user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome, {user.name}!</h1>
          <p className="text-slate-600">{user.service_type} • {user.area}</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Messages</p>
                <p className="text-3xl font-bold text-slate-900">{stats.messages}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Quotes</p>
                <p className="text-3xl font-bold text-slate-900">{stats.quotes}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Reviews</p>
                <p className="text-3xl font-bold text-slate-900">{stats.reviews}</p>
              </div>
              <Star className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Rating</p>
                <p className="text-3xl font-bold text-slate-900">{rating}</p>
              </div>
              <Star className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <Edit className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Edit Profile</h3>
            <p className="text-slate-600 mb-4">Update your profile information and rates</p>
            <Link href="/profile">
              <Button className="w-full">Edit Profile</Button>
            </Link>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Messages</h3>
            <p className="text-slate-600 mb-4">View and respond to customer messages</p>
            <Link href="/messages">
              <Button className="w-full">View Messages</Button>
            </Link>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Quotes</h3>
            <p className="text-slate-600 mb-4">Manage your quotes and proposals</p>
            <Link href="/quotes">
              <Button className="w-full">View Quotes</Button>
            </Link>
          </Card>
        </div>

        {/* Browse Section */}
        <div className="mt-12 bg-white p-8 rounded-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Looking for work?</h2>
          <p className="text-slate-600 mb-6">Browse other professionals in your area or find customers</p>
          <Link href="/browse">
            <Button size="lg">Browse Professionals</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
