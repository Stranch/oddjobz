import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType');
    const area = searchParams.get('area');

    let sql = 'SELECT id, name, service_type, area, bio, phone, hourly_rate, profile_image_url, rating, total_reviews FROM users WHERE 1=1';
    const params: any[] = [];

    if (serviceType) {
      sql += ' AND service_type = $' + (params.length + 1);
      params.push(serviceType);
    }

    if (area) {
      sql += ' AND area ILIKE $' + (params.length + 1);
      params.push('%' + area + '%');
    }

    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
