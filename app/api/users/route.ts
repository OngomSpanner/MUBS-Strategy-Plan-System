import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    let sql = `
      SELECT id, full_name, email, role, department, status, 
             DATE_FORMAT(created_at, '%d %b %Y') as created_date
      FROM users
      WHERE 1=1
    `;
    const values: any[] = [];

    if (role && role !== 'All Roles') {
      sql += ' AND role = ?';
      values.push(role);
    }

    if (search) {
      sql += ' AND (full_name LIKE ? OR email LIKE ?)';
      values.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT 50';

    const users = await query({ query: sql, values });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error fetching users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, password, role, department } = body;

    // Validate required fields
    if (!full_name || !email || !role || !department) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await query({
      query: 'SELECT id FROM users WHERE email = ?',
      values: [email]
    });

    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password (use default if not provided)
    const passwordToHash = password || 'Welcome@2025';
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    const result = await query({
      query: 'INSERT INTO users (full_name, email, password_hash, role, department, status) VALUES (?, ?, ?, ?, ?, ?)',
      values: [full_name, email, hashedPassword, role, department, 'Active']
    });

    return NextResponse.json({
      message: 'User created successfully',
      userId: (result as any).insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
}