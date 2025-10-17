import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role'); // 'provider' or 'customer'

    if (!userId) {
      return NextResponse.json(
        { error: 'userId required' },
        { status: 400 }
      );
    }

    let sql = `
      SELECT q.*, 
             provider.name as provider_name,
             customer.name as customer_name
      FROM quotes q
      JOIN users provider ON q.provider_id = provider.id
      JOIN users customer ON q.customer_id = customer.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (role === 'provider') {
      sql += ` AND q.provider_id = $${params.length + 1}`;
      params.push(userId);
    } else if (role === 'customer') {
      sql += ` AND q.customer_id = $${params.length + 1}`;
      params.push(userId);
    }

    sql += ` ORDER BY q.created_at DESC`;

    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { providerId, customerId, title, description, amount } = await request.json();

    if (!providerId || !customerId || !title || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO quotes (provider_id, customer_id, title, description, amount) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [providerId, customerId, title, description, amount]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}
