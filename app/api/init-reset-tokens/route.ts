import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    // Add reset token columns to users table (one at a time)
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN reset_token TEXT`);
    } catch (e: any) {
      if (!e.message.includes('already exists')) {
        throw e;
      }
    }
    
    try {
      await pool.query(`ALTER TABLE users ADD COLUMN reset_token_expiry TIMESTAMP`);
    } catch (e: any) {
      if (!e.message.includes('already exists')) {
        throw e;
      }
    }

    return NextResponse.json({ message: 'Reset token columns added successfully' });
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json({ error: 'Failed to update database', details: String(error) }, { status: 500 });
  }
}
