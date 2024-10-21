import { JsonForms } from '@/configs/schema';
import { db } from '@/configs/index';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { jsonform } = await request.json();

        if (typeof jsonform !== 'string' || jsonform.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Invalid jsonform format' },
                { status: 400 }
            );
        }

        const survey = await db.insert(JsonForms).values({ jsonform }).returning();

        return NextResponse.json(
            { success: true, survey },
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
