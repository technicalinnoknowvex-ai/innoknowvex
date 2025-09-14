// src/app/api/pricing/[course]/route.js
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    // Await the params object (Next.js 15+ requirement)
    const resolvedParams = await params;
    const { course } = resolvedParams;

    if (!course) {
      return NextResponse.json(
        { message: 'Course parameter is required', success: false },
        { status: 400 }
      );
    }

    // Debug logging (remove in production)
    console.log('Environment variables check:');
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
    console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64 exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64);
    console.log('GOOGLE_SHEET_ID exists:', !!process.env.GOOGLE_SHEET_ID);

    let privateKey;
    
    // Try Base64 private key first, then fallback to regular private key
    if (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64) {
      try {
        const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64;
        console.log('Base64 key length:', base64Key?.length);
        
        const decodedKey = Buffer.from(base64Key, 'base64').toString('utf8');
        // Replace escaped newlines with actual newlines
        privateKey = decodedKey.replace(/\\n/g, '\n');
        
        console.log('Decoded private key first 50 chars:', privateKey?.substring(0, 50));
        console.log('Successfully decoded Base64 private key');
      } catch (decodeError) {
        console.error('Base64 decode error:', decodeError.message);
        throw new Error(`Failed to decode Base64 private key: ${decodeError.message}`);
      }
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
      console.log('Using regular private key');
      console.log('Private key first 50 chars:', privateKey?.substring(0, 50));
    } else {
      throw new Error('No private key found in environment variables');
    }

    // Validate environment variables
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SHEET_ID) {
      console.error('Missing Google Sheets configuration');
      return NextResponse.json(
        { message: 'Server configuration error', success: false },
        { status: 500 }
      );
    }

    // Set up Google Sheets authentication
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    console.log('Attempting to authorize...');
    await auth.authorize();
    console.log('Authorization successful');
    
    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch pricing data from Google Sheets
    console.log('Attempting to fetch pricing data...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Pricing!A:I', // Adjust range based on your sheet structure
    });

    const rows = response.data.values;
    console.log('Successfully fetched data from sheet, rows count:', rows?.length);
        
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: 'No pricing data found', success: false },
        { status: 404 }
      );
    }

    // Assuming first row contains headers
    const headers = rows[0];
    const dataRows = rows.slice(1);

    console.log('Looking for course:', course);
    console.log('Available courses in sheet:', dataRows.map(row => row[0]).filter(Boolean));

    // Find the course data with more flexible matching
    const courseData = dataRows.find(row => {
      const courseName = row[0]?.toLowerCase().replace(/[-\s]/g, '-');
      const searchCourse = course.toLowerCase().replace(/[-\s]/g, '-');
      
      // Try exact match first
      if (courseName === searchCourse) return true;
      
      // Try partial matches for common variations
      if (courseName && searchCourse) {
        // Check if either contains the other
        if (courseName.includes(searchCourse) || searchCourse.includes(courseName)) {
          return true;
        }
        
        // Handle specific course name variations
        const normalizedCourseName = courseName.replace(/[^a-z]/g, '');
        const normalizedSearchCourse = searchCourse.replace(/[^a-z]/g, '');
        
        if (normalizedCourseName === normalizedSearchCourse) {
          return true;
        }
      }
      
      return false;
    });

    if (!courseData) {
      console.log(`No pricing data found for course: ${course}`);
      console.log('Available courses:', dataRows.map(row => row[0]).filter(Boolean));
      
      return NextResponse.json(
        { 
          message: `Pricing data not found for course: ${course}`, 
          success: false,
          availableCourses: dataRows.map(row => row[0]).filter(Boolean)
        },
        { status: 404 }
      );
    }

    // Map the data based on expected structure
    // Assuming columns: Course Name, Self Actual, Self Current, Mentor Actual, Mentor Current, Professional Actual, Professional Current, Currency, Created At
    const pricingData = {
      course_name: courseData[0] || course,
      self_actual_price: parseFloat(courseData[1]) || 0,
      self_current_price: parseFloat(courseData[2]) || 0,
      mentor_actual_price: parseFloat(courseData[3]) || 0,
      mentor_current_price: parseFloat(courseData[4]) || 0,
      professional_actual_price: parseFloat(courseData[5]) || 0,
      professional_current_price: parseFloat(courseData[6]) || 0,
      currency: courseData[7] || 'INR',
      created_at: courseData[8] || new Date().toISOString(),
    };

    console.log('Pricing data fetched successfully for:', course);

    return NextResponse.json(pricingData, { status: 200 });

  } catch (error) {
    console.error('Error fetching pricing data:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch pricing data',
        error: error.message,
        success: false,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}