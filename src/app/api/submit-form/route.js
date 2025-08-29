// app/api/submit-form/route.js
import { google } from 'googleapis';

export async function POST(request) {
  console.log('Submit form API called');
  
  try {
    // Parse the request body
    const { name, email, phone, program } = await request.json();
    console.log('Parsed data:', { name, email, phone, program });
    
    // Validate the data
    if (!name || !email || !phone || !program) {
      console.log('Validation failed: Missing fields');
      return new Response(JSON.stringify({ message: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check environment variables
    console.log('Checking environment variables...');
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
    console.log('GOOGLE_SHEET_ID exists:', !!process.env.GOOGLE_SHEET_ID);
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 
        !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || 
        !process.env.GOOGLE_SHEET_ID) {
      console.error('Missing environment variables');
      return new Response(JSON.stringify({ message: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Configure Google Sheets API
    console.log('Configuring Google auth...');
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
    console.log('Private key length:', privateKey.length);
    console.log('Private key starts with:', privateKey.substring(0, 30));
    
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Authenticate
    console.log('Authenticating...');
    await auth.authorize();
    console.log('Authentication successful');

    // Append data to Google Sheet
    console.log('Appending to sheet...');
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[name, email, phone, program, new Date().toISOString()]],
      },
    });

    console.log('Google Sheets response:', response.status, response.statusText);
    console.log('Data saved successfully');

    return new Response(JSON.stringify({ message: 'Form submitted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in submit-form API:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}