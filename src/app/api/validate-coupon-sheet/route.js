// src/app/api/validate-coupon-sheet/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Helper function to validate date format and check if coupon is still valid
const isValidCouponDate = (validFrom, validUntil) => {
  try {
    const now = new Date();
    const startDate = validFrom ? new Date(validFrom) : null;
    const endDate = validUntil ? new Date(validUntil) : null;

    // If no dates provided, consider it always valid
    if (!startDate && !endDate) return true;

    // Check start date
    if (startDate && now < startDate) return false;

    // Check end date
    if (endDate && now > endDate) return false;

    return true;
  } catch (error) {
    console.error('Error validating coupon dates:', error);
    return false;
  }
};

// Helper function to check if coupon is applicable to the specific course
const isCouponApplicableToCourse = (applicableCourses, courseId, courseName) => {
  // If applicableCourses is empty, null, or undefined, coupon applies to all courses
  if (!applicableCourses || applicableCourses.trim() === '' || applicableCourses.toLowerCase() === 'all') {
    return true;
  }

  // Convert to lowercase for case-insensitive comparison
  const coursesLower = applicableCourses.toLowerCase().trim();
  const courseIdLower = courseId ? courseId.toLowerCase().trim() : '';
  const courseNameLower = courseName ? courseName.toLowerCase().trim() : '';

  // Split by comma and clean up whitespace
  const coursesList = coursesLower.split(',').map(course => course.trim());
  
  // Check if courseId or courseName matches any in the list
  return coursesList.includes(courseIdLower) || 
         coursesList.includes(courseNameLower) ||
         coursesList.includes('all');
};

// FIXED: Enhanced function to parse coupon data from concatenated string format
const parseCouponFromConcatenatedString = (couponString) => {
  try {
    console.log('Parsing concatenated coupon string:', couponString);
    
    // Remove any extra whitespace
    const cleanString = couponString.trim();
    
    // For the format: FREECOURSE percentage990500002024-01-012025-12-31all
    // We need to parse it step by step
    
    // Extract coupon code (everything before the first lowercase letter or number pattern)
    const codeMatch = cleanString.match(/^([A-Z]+)/);
    const code = codeMatch ? codeMatch[1] : '';
    
    let remaining = cleanString.substring(code.length);
    console.log('Code extracted:', code);
    console.log('Remaining after code:', remaining);
    
    // Extract discount type (percentage/fixed)
    const typeMatch = remaining.match(/^(percentage|fixed|flat)/i);
    const discountType = typeMatch ? typeMatch[1].toLowerCase() : 'percentage';
    
    remaining = remaining.substring(typeMatch ? typeMatch[1].length : 0);
    console.log('Discount type:', discountType);
    console.log('Remaining after type:', remaining);
    
    // Extract discount value (numbers at the beginning)
    const valueMatch = remaining.match(/^(\d+)/);
    const discountValue = valueMatch ? parseFloat(valueMatch[1]) : 0;
    
    remaining = remaining.substring(valueMatch ? valueMatch[1].length : 0);
    console.log('Discount value:', discountValue);
    console.log('Remaining after value:', remaining);
    
    // Extract min order amount (next set of numbers)
    const minAmountMatch = remaining.match(/^(\d+)/);
    const minOrderAmount = minAmountMatch ? parseFloat(minAmountMatch[1]) : 0;
    
    remaining = remaining.substring(minAmountMatch ? minAmountMatch[1].length : 0);
    console.log('Min order amount:', minOrderAmount);
    console.log('Remaining after min amount:', remaining);
    
    // Extract max discount (next set of numbers, could be 0)
    const maxDiscountMatch = remaining.match(/^(\d+)/);
    const maxDiscount = maxDiscountMatch ? parseFloat(maxDiscountMatch[1]) : Infinity;
    
    remaining = remaining.substring(maxDiscountMatch ? maxDiscountMatch[1].length : 0);
    console.log('Max discount:', maxDiscount);
    console.log('Remaining after max discount:', remaining);
    
    // Extract dates (YYYY-MM-DD format)
    const datePattern = /(\d{4}-\d{2}-\d{2})/g;
    const dates = remaining.match(datePattern) || [];
    
    const validFrom = dates[0] || '';
    const validUntil = dates[1] || '';
    
    // Remove dates from remaining string
    dates.forEach(date => {
      remaining = remaining.replace(date, '');
    });
    
    console.log('Valid from:', validFrom);
    console.log('Valid until:', validUntil);
    console.log('Final remaining:', remaining);
    
    // What's left should be applicable courses
    const applicableCourses = remaining.trim() || 'all';
    
    const result = {
      code: code.toUpperCase(),
      discountType: discountType || 'percentage',
      discountValue: discountValue,
      minOrderAmount: minOrderAmount,
      maxDiscount: maxDiscount === 0 ? Infinity : maxDiscount,
      validFrom: validFrom,
      validUntil: validUntil,
      applicableCourses: applicableCourses
    };
    
    console.log('Parsed coupon result:', result);
    return result;
    
  } catch (error) {
    console.error('Error parsing concatenated coupon string:', error);
    return null;
  }
};

// FIXED: Helper function to parse coupon data from sheet row
const parseCouponData = (row, headerRow) => {
  try {
    console.log('Parsing coupon data from row:', row);
    console.log('Using headers:', headerRow);
    
    // If there's only one column or the data appears to be concatenated
    if (row.length === 1 || (row.length <= 2 && row[0].length > 10)) {
      console.log('Detected concatenated format, parsing...');
      return parseCouponFromConcatenatedString(row[0]);
    }
    
    // FIXED: Handle the case where we have individual columns (your current case)
    // Based on your log, the data structure is:
    // ['FREECOURSE ', 'percentage', '99', '0', '50000', '2024-01-01', '2025-12-31', 'all']
    
    if (row.length >= 8) {
      // Direct mapping for 8-column format
      const result = {
        code: (row[0] || '').toString().trim().toUpperCase(), // FIXED: Added trim() here
        discountType: (row[1] || 'percentage').toString().trim().toLowerCase(),
        discountValue: parseFloat(row[2] || '0') || 0,
        minOrderAmount: parseFloat(row[3] || '0') || 0,
        maxDiscount: parseFloat(row[4] || '0') || Infinity,
        validFrom: (row[5] || '').toString().trim(),
        validUntil: (row[6] || '').toString().trim(),
        applicableCourses: (row[7] || 'all').toString().trim(),
      };
      
      console.log('Parsed coupon (8-column format):', result);
      return result;
    }
    
    // Create a mapping based on headers for flexible column arrangement
    const headers = headerRow.map(h => h.toLowerCase().trim());
    const data = {};
    
    // Map common header variations to standard names
    const headerMappings = {
      'couponcode': 'code',
      'code': 'code',
      'discount_percentage': 'discountPercentage',
      'discountpercentage': 'discountPercentage',
      'discount': 'discountPercentage',
      'percentage': 'discountPercentage',
      'discount_type': 'discountType',
      'discounttype': 'discountType',
      'type': 'discountType',
      'discount_value': 'discountValue',
      'discountvalue': 'discountValue',
      'value': 'discountValue',
      'min_order_amount': 'minOrderAmount',
      'minorderamount': 'minOrderAmount',
      'min_amount': 'minOrderAmount',
      'minamount': 'minOrderAmount',
      'max_discount': 'maxDiscount',
      'maxdiscount': 'maxDiscount',
      'max_discount_amount': 'maxDiscount',
      'valid_from': 'validFrom',
      'validfrom': 'validFrom',
      'start_date': 'validFrom',
      'startdate': 'validFrom',
      'valid_until': 'validUntil',
      'validuntil': 'validUntil',
      'end_date': 'validUntil',
      'enddate': 'validUntil',
      'expiry': 'validUntil',
      'applicable_courses': 'applicableCourses',
      'applicablecourses': 'applicableCourses',
      'courses': 'applicableCourses',
      'course_ids': 'applicableCourses',
      'courseids': 'applicableCourses'
    };
    
    // Map row data to standard structure
    headers.forEach((header, index) => {
      const standardKey = headerMappings[header] || header;
      const value = row[index] ? row[index].toString().trim() : ''; // FIXED: Added trim() here too
      data[standardKey] = value;
    });

    // Return standardized coupon data with fallbacks for different column arrangements
    const result = {
      code: (data.code || data.couponcode || '').toUpperCase().trim(), // FIXED: Added trim()
      discountType: (data.discounttype || data.type || 'percentage').toLowerCase(),
      discountValue: parseFloat(data.discountvalue || data.discountpercentage || data.discount || data.percentage || '0') || 0,
      minOrderAmount: parseFloat(data.minorderamount || data.minamount || '0') || 0,
      maxDiscount: parseFloat(data.maxdiscount || '0') || Infinity,
      validFrom: (data.validfrom || data.startdate || '').trim(),
      validUntil: (data.validuntil || data.enddate || data.expiry || '').trim(),
      applicableCourses: (data.applicablecourses || data.courses || data.courseids || 'all').trim(),
    };
    
    console.log('Parsed coupon (header-based format):', result);
    return result;
    
  } catch (error) {
    console.error('Error parsing coupon data:', error);
    return null;
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { couponCode, course, originalPrice, courseId, plan } = body;

    console.log('Enhanced coupon validation request:', { 
      couponCode, 
      course, 
      originalPrice, 
      courseId, 
      plan 
    });

    // Validate required fields
    if (!couponCode || !originalPrice) {
      return NextResponse.json(
        { message: 'Missing required fields: couponCode and originalPrice are required', success: false },
        { status: 400 }
      );
    }

    if (originalPrice <= 0) {
      return NextResponse.json(
        { message: 'Invalid original price', success: false },
        { status: 400 }
      );
    }

    // Validate environment variables for Google Sheets
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      console.error('Missing Google Sheets configuration');
      return NextResponse.json(
        { message: 'Server configuration error', success: false },
        { status: 500 }
      );
    }

    // Set up Google Sheets authentication
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    await auth.authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch coupons from Google Sheets - try multiple possible sheet names
    const possibleSheetNames = ['Coupons', 'coupons', 'COUPONS', 'Coupon', 'coupon'];
    let response = null;
    let usedSheetName = '';

    for (const sheetName of possibleSheetNames) {
      try {
        response = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: `${sheetName}!A:Z`, // Extended range to accommodate different column arrangements
        });
        usedSheetName = sheetName;
        break;
      } catch (error) {
        console.log(`Sheet '${sheetName}' not found, trying next...`);
        continue;
      }
    }

    if (!response) {
      console.error('No coupon sheet found with standard names');
      return NextResponse.json(
        { message: 'Coupon database not found', success: false },
        { status: 404 }
      );
    }

    const rows = response.data.values;
    console.log(`Found ${rows?.length || 0} rows in sheet '${usedSheetName}'`);
    console.log('Raw sheet data:', rows);
    
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: 'No coupons found in database', success: false },
        { status: 404 }
      );
    }

    // FIXED: Handle the case where there are no headers (just data rows)
    let headerRow = [];
    let dataRows = [];
    
    if (rows.length === 1) {
      // Only one row - treat it as data
      headerRow = ['code', 'discountType', 'discountValue', 'minOrderAmount', 'maxDiscount', 'validFrom', 'validUntil', 'applicableCourses'];
      dataRows = rows;
    } else if (rows[0] && rows[0].some(cell => cell && cell.toString().toLowerCase().includes('coupon'))) {
      // First row contains headers
      headerRow = rows[0];
      dataRows = rows.slice(1);
    } else {
      // No headers, treat all as data
      headerRow = ['code', 'discountType', 'discountValue', 'minOrderAmount', 'maxDiscount', 'validFrom', 'validUntil', 'applicableCourses'];
      dataRows = rows;
    }
    
    console.log('Coupon sheet headers:', headerRow);
    console.log('Data rows:', dataRows);

    // Find matching coupon
    const couponCodeUpper = couponCode.toString().toUpperCase().trim(); // FIXED: Added trim()
    let matchingCouponRow = null;
    
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      console.log(`Processing row ${i + 1}:`, row);
      
      if (row && row.length > 0) {
        const parsedCoupon = parseCouponData(row, headerRow);
        console.log(`Parsed coupon from row ${i + 1}:`, parsedCoupon);
        
        if (parsedCoupon && parsedCoupon.code === couponCodeUpper) {
          console.log('Found matching coupon!');
          matchingCouponRow = parsedCoupon;
          break;
        }
      }
    }

    if (!matchingCouponRow) {
      console.log('Coupon not found:', couponCodeUpper);
      return NextResponse.json(
        { message: 'Invalid coupon code', success: false },
        { status: 404 }
      );
    }

    console.log('Found matching coupon:', matchingCouponRow);

    // Validate coupon dates
    if (!isValidCouponDate(matchingCouponRow.validFrom, matchingCouponRow.validUntil)) {
      const validUntilDate = matchingCouponRow.validUntil ? new Date(matchingCouponRow.validUntil).toLocaleDateString() : '';
      const validFromDate = matchingCouponRow.validFrom ? new Date(matchingCouponRow.validFrom).toLocaleDateString() : '';
      
      let dateMessage = 'Coupon is not valid';
      if (validUntilDate && new Date() > new Date(matchingCouponRow.validUntil)) {
        dateMessage = `Coupon expired on ${validUntilDate}`;
      } else if (validFromDate && new Date() < new Date(matchingCouponRow.validFrom)) {
        dateMessage = `Coupon will be valid from ${validFromDate}`;
      }

      return NextResponse.json(
        { message: dateMessage, success: false },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (originalPrice < matchingCouponRow.minOrderAmount) {
      return NextResponse.json(
        { 
          message: `Minimum order amount of ₹${matchingCouponRow.minOrderAmount} required for this coupon`, 
          success: false 
        },
        { status: 400 }
      );
    }

    // Check if coupon is applicable for the course
    if (!isCouponApplicableToCourse(matchingCouponRow.applicableCourses, courseId, course)) {
      return NextResponse.json(
        { 
          message: 'This coupon is not applicable for the selected course', 
          success: false 
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    const discountType = matchingCouponRow.discountType.toLowerCase();
    
    if (discountType === 'percentage' || !discountType || discountType === '') {
      // Percentage discount
      discountAmount = Math.round((originalPrice * matchingCouponRow.discountValue) / 100);
      
      // Apply maximum discount limit if set
      if (matchingCouponRow.maxDiscount !== Infinity && discountAmount > matchingCouponRow.maxDiscount) {
        discountAmount = matchingCouponRow.maxDiscount;
      }
    } else if (discountType === 'fixed' || discountType === 'flat') {
      // Fixed amount discount
      discountAmount = Math.min(matchingCouponRow.discountValue, originalPrice);
    }

    // Ensure discount doesn't exceed the order amount
    discountAmount = Math.min(discountAmount, originalPrice);
    const finalAmount = Math.max(originalPrice - discountAmount, 0);

    console.log('Coupon validation successful:', {
      code: couponCodeUpper,
      discountType: discountType,
      discountValue: matchingCouponRow.discountValue,
      discountAmount,
      finalAmount,
      originalPrice
    });

    // Return enhanced response with all necessary data
    const result = {
      success: true,
      message: 'Coupon applied successfully',
      coupon: {
        code: matchingCouponRow.code,
        discountType: discountType,
        discountValue: matchingCouponRow.discountValue,
        discountPercentage: discountType === 'percentage' ? matchingCouponRow.discountValue : Math.round((discountAmount / originalPrice) * 100),
        applicableCourses: matchingCouponRow.applicableCourses,
        validFrom: matchingCouponRow.validFrom,
        validUntil: matchingCouponRow.validUntil,
        minOrderAmount: matchingCouponRow.minOrderAmount,
        maxDiscount: matchingCouponRow.maxDiscount === Infinity ? null : matchingCouponRow.maxDiscount,
      },
      pricing: {
        originalAmount: originalPrice,
        discountAmount: Math.round(discountAmount),
        finalAmount: Math.round(finalAmount),
        savingsPercentage: Math.round((discountAmount / originalPrice) * 100)
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      {
        message: 'Failed to validate coupon due to server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        success: false,
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Helper function for debugging coupon sheet structure
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'Not available in production' }, { status: 403 });
  }

  try {
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    await auth.authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    // Get sheet information
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    const availableSheets = sheetInfo.data.sheets.map(sheet => sheet.properties.title);

    // Try to read sample data from Coupons sheet
    let sampleData = null;
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Coupons!A1:Z10',
      });
      sampleData = response.data.values;
    } catch (error) {
      console.log('Could not read Coupons sheet:', error.message);
    }

    return NextResponse.json({
      availableSheets,
      sampleData,
      message: 'Debug information for coupon sheet structure'
    });

  } catch (error) {
    return NextResponse.json({
      error: error.message,
      message: 'Failed to get debug information'
    }, { status: 500 });
  }
}