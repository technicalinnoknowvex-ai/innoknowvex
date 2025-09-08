import sql from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { course } = params;
    
    // Query the database for the specific course using PostgreSQL syntax
    const results = await sql`
      SELECT * FROM pricing WHERE course_name = ${course}
    `;
    
    if (results.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Course not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(results[0]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}