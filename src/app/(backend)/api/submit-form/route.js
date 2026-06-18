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

    let privateKey;
    
    // Try Base64 private key first, then fallback to regular private key
    if (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64) {
      try {
        const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64;
        const decodedKey = Buffer.from(base64Key, 'base64').toString('utf8');
        privateKey = decodedKey.replace(/\\n/g, '\n');
      } catch (decodeError) {
        console.error('Base64 decode error:', decodeError.message);
        throw new Error(`Failed to decode Base64 private key: ${decodeError.message}`);
      }
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n");
    } else {
      throw new Error('No private key found in environment variables');
    }

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is required');
    }

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    await auth.authorize();
    
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email, phone, program, new Date().toISOString()]],
      },
    });

    return new Response(
      JSON.stringify({ message: "Form submitted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    
    return new Response(
      JSON.stringify({ 
        message: "Internal server error",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}