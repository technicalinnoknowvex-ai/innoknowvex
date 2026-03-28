export async function POST(req) {
  try {
    const body = await req.json();
    
    const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const result = await response.text();

    return Response.json({ success: true, result });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
