'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, MessageSquare, ArrowLeft } from 'lucide-react';

interface Professional {
  id: number;
  name: string;
  service_type: string;
  area: string;
  bio?: string;
  phone?: string;
  hourly_rate?: number;
  profile_image_url?: string;
  rating?: number;
  total_reviews?: number;
  created_at?: string;
}

interface Review {
  id: number;
  rating: number;
  comment?: string;
  customer_name: string;
  created_at: string;
}

export default function ProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProfile();
    }
  }, [params.id]);

  const fetchProfile = async () => {
    try {
      const [profileRes, reviewsRes] = await Promise.all([
        fetch(`/api/users/${params.id}`).catch(() => ({ json: async () => null })),
        fetch(`/api/reviews?providerId=${params.id}`).catch(() => ({ json: async () => [] })),
      ]);

      const profileData = await profileRes.json().catch(() => null);
      const reviewsData = await reviewsRes.json().catch(() => []);

      setProfessional(profileData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-600 mb-4">Professional not found</p>
        <Link href="/browse">
          <Button>Back to Browse</Button>
        </Link>
      </div>
    );
  }

  const rating = professional.rating ? parseFloat(professional.rating.toString()).toFixed(1) : 'N/A';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/browse">
            <div className="flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-2xl font-bold text-slate-900">OddJobz</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-4">
              {professional.profile_image_url && (
                <img
                  src={professional.profile_image_url}
                  alt={professional.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{professional.name}</h1>
              <p className="text-slate-600 mb-4">{professional.service_type}</p>
              <p className="text-slate-600 mb-6">{professional.area}</p>

              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                <span className="text-lg font-bold text-slate-900">{rating}</span>
                <span className="text-slate-600">
                  ({professional.total_reviews || 0} reviews)
                </span>
              </div>

              {professional.hourly_rate && (
                <p className="text-2xl font-bold text-slate-900 mb-6">
                  R{professional.hourly_rate}/hour
                </p>
              )}

              {professional.phone && (
                <p className="text-slate-600 mb-6">
                  <span className="font-medium">Phone:</span> {professional.phone}
                </p>
              )}

              {user && user.id !== professional.id && (
                <Link href={`/messages?with=${professional.id}`} className="w-full">
                  <Button className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </Link>
              )}
            </Card>
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            {professional.bio && (
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
                <p className="text-slate-600">{professional.bio}</p>
              </Card>
            )}

            {/* Reviews */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Reviews ({reviews.length})</h2>

              {reviews.length === 0 ? (
                <p className="text-slate-600">No reviews yet</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-slate-900">{review.customer_name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-slate-600">{review.comment}</p>
                      )}
                      <p className="text-sm text-slate-500 mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
