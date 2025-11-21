// app/api/simple-test/route.js
export async function POST(request) {
  try {
    console.log('Simple test API called');
    return new Response(JSON.stringify({ message: 'Simple test successful' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Simple test error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}