// app/api/debug-steps/route.js
export async function POST(request) {
  console.log('=== DEBUG STEPS START ===');
  
  try {
    // Step 1: Test request parsing
    console.log('Step 1: Testing request parsing...');
    const body = await request.json();
    console.log('Request body parsed successfully:', body);
    
    // Step 2: Test environment variables
    console.log('Step 2: Testing environment variables...');
    const envVars = {
      GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY 
        ? `Exists (length: ${process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.length})` 
        : 'MISSING',
      GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
    };
    console.log('Environment variables:', envVars);
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 
        !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || 
        !process.env.GOOGLE_SHEET_ID) {
      throw new Error('Missing required environment variables');
    }
    
    // Step 3: Test Google Auth (without making API calls)
    console.log('Step 3: Testing Google Auth setup...');
    const { google } = require('googleapis');
    
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
    console.log('Private key processed (first 50 chars):', privateKey.substring(0, 50));
    
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    console.log('Google Auth configured successfully');
    
    // Return success with debug info
    return new Response(JSON.stringify({ 
      message: 'All debug steps passed',
      debugInfo: envVars
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Debug steps failed:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    console.log('=== DEBUG STEPS END ===');
  }
}