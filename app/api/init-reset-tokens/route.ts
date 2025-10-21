import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    // Add reset token columns to users table
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token TEXT,
      ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP
    `);

    return NextResponse.json({ message: 'Reset token columns added successfully' });
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
  }
}
