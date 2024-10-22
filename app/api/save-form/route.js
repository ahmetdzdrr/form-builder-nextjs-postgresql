// api/save-form/route.js

import { NextResponse } from 'next/server';
import { pool } from "../connect-db/route"; // Adjusted path to access the pool

export async function POST(request) {
    try {
        const { jsonform } = await request.json();

        if (typeof jsonform !== 'string' || jsonform.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Invalid jsonform format' },
                { status: 400 }
            );
        }

        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO Forms (jsonform) VALUES ($1) RETURNING *',
            [jsonform]
        );
        client.release();

        return NextResponse.json(
            { success: true, survey: result.rows[0] }, // Return the newly created survey
            { status: 201 }
        );

    } catch (error) {
        console.error('Error saving survey:', error);

        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred while saving the survey.' },
            { status: 500 }
        );
    }
}
