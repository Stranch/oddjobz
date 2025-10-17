'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function ProfileEditPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    bio: '',
    phone: '',
    hourly_rate: '',
    profile_image_url: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      setFormData({
        bio: user.bio || '',
        phone: user.phone || '',
        hourly_rate: user.hourly_rate?.toString() || '',
        profile_image_url: user.profile_image_url || '',
      });
    }
  }, [user, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: formData.bio,
          phone: formData.phone,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          profile_image_url: formData.profile_image_url,
        }),
      });

      if (res.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
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
              <span className="text-2xl font-bold text-slate-900">Edit Profile</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Name</label>
              <Input type="text" value={user.name} disabled className="bg-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Service Type</label>
              <Input type="text" value={user.service_type} disabled className="bg-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Area</label>
              <Input type="text" value={user.area} disabled className="bg-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Bio</label>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell customers about yourself and your experience..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Phone</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+27 123 456 7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Hourly Rate (R)</label>
              <Input
                type="number"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                placeholder="150"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Profile Image URL</label>
              <Input
                type="url"
                name="profile_image_url"
                value={formData.profile_image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-slate-600 mt-1">Placeholder: Use a valid image URL</p>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
