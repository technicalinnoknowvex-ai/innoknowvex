import { google } from "googleapis";

export async function POST(request) {
  try {
    const { name, email, phone, program } = await request.json();
    if (!name || !email || !phone || !program) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
      /\\n/g,
      "\n"
    );
    console.log("privateKey", privateKey);
    console.log("email", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log("google sheet ID", process.env.GOOGLE_SHEET_ID);

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    console.log("1");

    await auth.authorize();
    const sheets = google.sheets({ version: "v4", auth });
    console.log("2");

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email, phone, program, new Date().toISOString()]],
      },
    });
    console.log("3");
    return new Response(
      JSON.stringify({ message: "Form submitted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    console.log("4");
    console.error("Full error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
