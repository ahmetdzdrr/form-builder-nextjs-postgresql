// api/submit-response/route.js
import { pool } from '../connect-db/route'; // Adjust the import as necessary based on your directory structure

export async function POST(req) {
  const { title, formValues } = await req.json();

  // Insert into the Responses table
  const query = 'INSERT INTO Responses (title, formValues) VALUES ($1, $2) RETURNING *';
  const values = [title, formValues];

  try {
    const client = await pool.connect();
    const result = await client.query(query, values);
    client.release();

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error inserting response:', error);
    return new Response('Veri kaydedilirken bir hata oluştu.', { status: 500 });
  }
}
