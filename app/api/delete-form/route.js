// pages/api/delete-form/route.js

import { pool } from "../connect-db/route"; // Adjusted path to access connect-db
import { NextResponse } from 'next/server';

export async function DELETE(request) {
    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ message: 'Id eksik.' }, { status: 400 });
    }

    try {
        const client = await pool.connect();
        
        // 1. Forms tablosundan formu sil
        const formResult = await client.query('SELECT jsonform FROM Forms WHERE id = $1', [id]);
        if (formResult.rowCount === 0) {
            client.release();
            return NextResponse.json({ message: 'Form bulunamadı.' }, { status: 404 });
        }

        const jsonform = formResult.rows[0].jsonform;
        const formTitle = JSON.parse(jsonform).title; // title değerini al

        // 2. Responses tablosunda title ile eşleşen kayıtları sil
        await client.query('DELETE FROM Responses WHERE title = $1', [formTitle]);

        // 3. Forms tablosundan formu sil
        await client.query('DELETE FROM Forms WHERE id = $1', [id]);

        client.release();
        return NextResponse.json({ message: 'Form ve ilgili cevaplar başarıyla silindi.' }, { status: 200 });
    } catch (error) {
        console.error('Silme Hatası:', error);
        return NextResponse.json({ message: 'Silme işlemi sırasında bir hata oluştu: ' + error.message }, { status: 500 });
    }
}
