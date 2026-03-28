export async function POST(req) {
  try {
    // Validate environment variable
    if (!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL) {
      console.error("Missing NEXT_PUBLIC_GOOGLE_SCRIPT_URL environment variable");
      return Response.json(
        { success: false, error: "Server misconfigured: Missing Google Script URL" },
        { status: 500 }
      );
    }

    const body = await req.json();
    
    const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    // Check if the response is successful
    if (!response.ok) {
      const responseText = await response.text();
      console.error("Google Script error:", response.status, responseText);
      return Response.json(
        { success: false, error: `Google Script returned ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.text();

    return Response.json({ success: true, result });

  } catch (error) {
    console.error("Send enquiry error:", error);
    return Response.json(
      { success: false, error: error.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
