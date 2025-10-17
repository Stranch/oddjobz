import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      'SELECT id, name, service_type, area, bio, phone, hourly_rate, profile_image_url, rating, total_reviews, created_at FROM users WHERE id = $1',
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { bio, phone, hourly_rate, profile_image_url } = await request.json();

    const result = await query(
      `UPDATE users SET bio = $1, phone = $2, hourly_rate = $3, profile_image_url = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 
       RETURNING id, name, service_type, area, bio, phone, hourly_rate, profile_image_url, rating, total_reviews`,
      [bio, phone, hourly_rate, profile_image_url, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
