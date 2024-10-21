import { db } from "@/configs/index";
import { JsonForms } from "@/configs/schema";
import { NextResponse } from 'next/server';
import { eq } from "drizzle-orm";

export async function DELETE(request) {
    const { id } = await request.json();

    if (!id) {
        return NextResponse.json({ message: 'Id eksik.' }, { status: 400 });
    }

    try {
        const result = await db.delete(JsonForms).where(eq(JsonForms.id, id)).execute();

        if (result.rowCount > 0) { 
            return NextResponse.json({ message: 'Form başarıyla silindi.' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Form bulunamadı.' }, { status: 404 });
        }
    } catch (error) {
        console.error('Silme Hatası:', error); 
        return NextResponse.json({ message: 'Silme işlemi sırasında bir hata oluştu: ' + error.message }, { status: 500 });
    }
}
