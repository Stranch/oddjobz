'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, MessageSquare } from 'lucide-react';

const SOUTH_AFRICAN_AREAS = [
  'Johannesburg',
  'Cape Town',
  'Durban',
  'Pretoria',
  'Port Elizabeth',
  'Bloemfontein',
  'Pietermaritzburg',
  'Polokwane',
  'Nelspruit',
  'Kimberley',
  'Rustenburg',
  'Centurion',
  'Sandton',
  'Midrand',
  'Randburg',
  'Soweto',
  'Benoni',
  'Springs',
  'Germiston',
  'Boksburg',
  'Alberton',
  'Vereeniging',
  'Vanderbijlpark',
  'Potchefstroom',
  'Klerksdorp',
  'Mahikeng',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Free State',
  'Eastern Cape',
  'Western Cape',
  'Northern Cape',
  'KwaZulu-Natal',
  'Gauteng',
];

interface Professional {
  id: number;
  name: string;
  service_type: string;
  area: string;
  bio?: string;
  hourly_rate?: number;
  profile_image_url?: string;
  rating?: number;
  total_reviews?: number;
}

export default function BrowsePage() {
  const { user } = useAuth();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [serviceType, setServiceType] = useState('');
  const [area, setArea] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setProfessionals(data || []);
      setFilteredProfessionals(data || []);
    } catch (error) {
      console.error('Failed to fetch professionals', error);
      setProfessionals([]);
      setFilteredProfessionals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = professionals;

    if (serviceType) {
      filtered = filtered.filter((p) => p.service_type === serviceType);
    }

    if (area) {
      filtered = filtered.filter((p) => p.area === area);
    }

    setFilteredProfessionals(filtered);
  }, [serviceType, area, professionals]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold text-slate-900 cursor-pointer">OddJobz</div>
          </Link>
          <div className="flex gap-4">
            {user && (
              <>
                <Link href="/messages">
                  <Button variant="outline">Messages</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Find Service Professionals</h1>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All services</option>
                <option value="Gardener">Gardener</option>
                <option value="Maid">Maid</option>
                <option value="Handyman">Handyman</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Area (South Africa)</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All areas</option>
                {SOUTH_AFRICAN_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setServiceType('');
                  setArea('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">Loading professionals...</div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No professionals found matching your criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <Card key={professional.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {professional.profile_image_url && (
                  <img
                    src={professional.profile_image_url}
                    alt={professional.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{professional.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{professional.service_type}</p>
                  <p className="text-sm text-slate-600 mb-4">{professional.area}</p>

                  {professional.bio && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{professional.bio}</p>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium text-slate-900">
                      {professional.rating ? parseFloat(professional.rating.toString()).toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-sm text-slate-600">
                      ({professional.total_reviews || 0} reviews)
                    </span>
                  </div>

                  {professional.hourly_rate && (
                    <p className="text-lg font-bold text-slate-900 mb-4">
                      R{professional.hourly_rate}/hour
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Link href={`/profile/${professional.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    {user && (
                      <Link href={`/messages?with=${professional.id}`} className="flex-1">
                        <Button className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
