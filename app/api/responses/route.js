// /api/responses/route.js
import { pool } from "../connect-db/route"; // Adjusted path to access connect-db

// Define the GET method handler
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title');

  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
  }

  try {
    console.log('Fetching responses for title:', title);
    const query = 'SELECT * FROM Responses WHERE title = $1';
    const values = [title];
    const response = await pool.query(query, values);
    
    return new Response(JSON.stringify(response.rows), { status: 200 });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch responses' }), { status: 500 });
  }
}

// Add additional method handlers (e.g., POST, PUT) if needed
