import { pool } from '../../connect-db/route'; // Adjust the import path as necessary

export async function GET(req, { params }) {
  const { title } = params; // Access the dynamic title parameter

  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
  }

  try {
    const query = 'SELECT * FROM Responses WHERE title = $1';
    const values = [title];
    const response = await pool.query(query, values);
    
    if (response.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'No responses found' }), { status: 404 });
    }

    return new Response(JSON.stringify(response.rows), { status: 200 });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch responses' }), { status: 500 });
  }
}
