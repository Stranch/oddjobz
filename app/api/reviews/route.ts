import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');

    if (!providerId) {
      return NextResponse.json(
        { error: 'providerId required' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT r.*, customer.name as customer_name
       FROM reviews r
       JOIN users customer ON r.customer_id = customer.id
       WHERE r.provider_id = $1
       ORDER BY r.created_at DESC`,
      [providerId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { providerId, customerId, rating, comment } = await request.json();

    if (!providerId || !customerId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create review
    const reviewResult = await query(
      `INSERT INTO reviews (provider_id, customer_id, rating, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [providerId, customerId, rating, comment]
    );

    // Update provider rating
    const avgResult = await query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
       FROM reviews WHERE provider_id = $1`,
      [providerId]
    );

    const avgRating = parseFloat(avgResult.rows[0].avg_rating) || 0;
    const totalReviews = parseInt(avgResult.rows[0].total_reviews) || 0;

    await query(
      `UPDATE users SET rating = $1, total_reviews = $2 WHERE id = $3`,
      [avgRating.toFixed(2), totalReviews, providerId]
    );

    return NextResponse.json(reviewResult.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
