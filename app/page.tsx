'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wrench, Users, MessageSquare, Star } from 'lucide-react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-slate-900">OddJobz</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Find Local Service Professionals
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Connect with trusted gardeners, maids, and handymen in your area. Get quotes, message directly, and build lasting relationships.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline">Browse Professionals</Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg border border-slate-200">
            <Users className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Browse Profiles</h3>
            <p className="text-slate-600">View detailed profiles with photos, ratings, and experience</p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-slate-200">
            <MessageSquare className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Direct Messaging</h3>
            <p className="text-slate-600">Communicate directly with service providers</p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-slate-200">
            <Wrench className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Get Quotes</h3>
            <p className="text-slate-600">Request and compare pricing for your projects</p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-slate-200">
            <Star className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Ratings & Reviews</h3>
            <p className="text-slate-600">Build trust through verified customer reviews</p>
          </div>
        </div>
      </section>
    </div>
  );
}
