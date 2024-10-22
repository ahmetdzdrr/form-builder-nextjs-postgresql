// api/connect-db/route.js

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'formdb',
    password: 'ksk1947xq',
    port: 5432,
});

// Export the pool so it can be used in other files
export { pool };

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const formId = searchParams.get('formId');

    try {
        const query = formId ? 'SELECT * FROM Forms WHERE id = $1' : 'SELECT * FROM Forms';
        const values = formId ? [formId] : [];
        const res = await pool.query(query, values);
        return NextResponse.json(res.rows);
    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}

