export async function POST(req) {
  try {
    // Validate environment variable
    const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL_SCHEDULE || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!googleScriptUrl) {
      console.error("Missing Google Script URL environment variable");
      return Response.json(
        { success: false, error: "Server misconfigured: Missing Google Script URL" },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Add request type to identify this as a schedule meeting request
    const payload = {
      ...body,
      requestType: "schedule",
      timestamp: new Date().toISOString()
    };

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
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
    console.log("Schedule meeting saved successfully");

    return Response.json({ success: true, result });

  } catch (error) {
    console.error("Schedule meeting error:", error);
    return Response.json(
      { success: false, error: error.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
