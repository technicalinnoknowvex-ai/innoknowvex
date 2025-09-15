
// import Razorpay from 'razorpay';
// import { NextResponse } from 'next/server';
// import { google } from 'googleapis';

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { 
//       amount, 
//       currency = 'INR', 
//       course, 
//       plan, 
//       studentData, 
//       couponCode, 
//       originalAmount, 
//       discountAmount,
//       courseId
//     } = body;
             
//     console.log('Create order request:', { 
//       amount, 
//       currency, 
//       course, 
//       plan, 
//       studentData, 
//       couponCode, 
//       originalAmount, 
//       discountAmount,
//       courseId
//     });

//     // Validate required fields
//     if (!amount || !course || !plan || !studentData) {
//       return NextResponse.json(
//         { message: 'Missing required fields', success: false },
//         { status: 400 }
//       );
//     }

//     // Validate environment variables
//     if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
//       console.error('Missing Razorpay credentials');
//       return NextResponse.json(
//         { message: 'Server configuration error', success: false },
//         { status: 500 }
//       );
//     }

//     // Initialize Razorpay here instead of at module level
//     const razorpay = new Razorpay({
//       key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });

//     // If coupon is provided, re-validate it to prevent tampering
//     if (couponCode) {
//       try {
//         // Set up Google Sheets authentication
//         const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n');
//         const auth = new google.auth.JWT({
//           email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//           key: privateKey,
//           scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
//         });

//         await auth.authorize();
//         const sheets = google.sheets({ version: 'v4', auth });

//         // Fetch and validate coupon
//         const response = await sheets.spreadsheets.values.get({
//           spreadsheetId: process.env.GOOGLE_SHEET_ID,
//           range: 'Coupons!A:H',
//         });

//         const rows = response.data.values;
//         if (rows && rows.length > 1) {
//           const coupons = rows.slice(1);
//           const coupon = coupons.find(row => 
//             row[0] && row[0].toString().toUpperCase() === couponCode.toUpperCase()
//           );

//           if (!coupon) {
//             return NextResponse.json(
//               { message: 'Invalid coupon code during order creation', success: false },
//               { status: 400 }
//             );
//           }

//           // Re-validate coupon constraints
//           const [
//             code,
//             discountType,
//             discountValue,
//             minOrderAmount,
//             maxDiscount,
//             validFrom,
//             validUntil,
//             applicableCourses
//           ] = coupon;

//           // Check expiry
//           const currentDate = new Date();
//           const validUntilDate = validUntil ? new Date(validUntil) : null;
//           if (validUntilDate && currentDate > validUntilDate) {
//             return NextResponse.json(
//               { message: 'Coupon has expired', success: false },
//               { status: 400 }
//             );
//           }

//           // Check minimum amount
//           const minAmount = parseFloat(minOrderAmount) || 0;
//           if (originalAmount < minAmount) {
//             return NextResponse.json(
//               { message: `Minimum order amount of ₹${minAmount} required`, success: false },
//               { status: 400 }
//             );
//           }

//           // Check course applicability using course ID
//           if (applicableCourses && applicableCourses.trim() !== '') {
//             const applicableCoursesArray = applicableCourses.split(',').map(c => c.trim().toLowerCase());
//             // Use courseId if available, otherwise fall back to course name
//             const courseToCheck = courseId ? courseId.toLowerCase() : course.toLowerCase();
            
//             if (!applicableCoursesArray.includes(courseToCheck)) {
//               return NextResponse.json(
//                 { message: 'Coupon not applicable for this course', success: false },
//                 { status: 400 }
//               );
//             }
//           }
//           // If applicableCourses is empty, the coupon applies to all courses
//         }
//       } catch (error) {
//         console.error('Error validating coupon during order creation:', error);
//         return NextResponse.json(
//           { message: 'Failed to validate coupon', success: false },
//           { status: 500 }
//         );
//       }
//     }

//     // Ensure amount is a number and convert to integer (paise)
//     const amountInPaise = Math.round(Number(amount));
             
//     if (isNaN(amountInPaise) || amountInPaise <= 0) {
//       return NextResponse.json(
//         { message: 'Invalid amount', success: false },
//         { status: 400 }
//       );
//     }

//     const options = {
//       amount: amountInPaise,
//       currency,
//       receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       notes: {
//         course,
//         plan,
//         student_name: studentData.name,
//         student_email: studentData.email,
//         student_phone: studentData.phone,
//         coupon_code: couponCode || '',
//         original_amount: originalAmount || amount,
//         discount_amount: discountAmount || 0,
//         course_id: courseId || '',
//       },
//     };

//     console.log('Creating Razorpay order with options:', options);
//     const order = await razorpay.orders.create(options);
//     console.log('Order created successfully:', order.id);

//     return NextResponse.json({
//       id: order.id,
//       currency: order.currency,
//       amount: order.amount,
//       success: true,
//     });

//   } catch (error) {
//     console.error('Error creating order:', error);
//     return NextResponse.json(
//       {
//         message: 'Failed to create order',
//         error: error.message,
//         success: false,
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function OPTIONS() {
//   return new Response(null, {
//     status: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   });
// }\




import Razorpay from 'razorpay';
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

// Enhanced function to parse coupon data from concatenated string format
const parseCouponFromConcatenatedString = (couponString) => {
  try {
    console.log('Parsing concatenated coupon string:', couponString);
    
    // Remove any extra whitespace
    const cleanString = couponString.trim();
    
    // Extract coupon code (everything before the first lowercase letter or number pattern)
    const codeMatch = cleanString.match(/^([A-Z]+)/);
    const code = codeMatch ? codeMatch[1] : '';
    
    let remaining = cleanString.substring(code.length);
    
    // Extract discount type (percentage/fixed)
    const typeMatch = remaining.match(/^(percentage|fixed|flat)/i);
    const discountType = typeMatch ? typeMatch[1].toLowerCase() : 'percentage';
    
    remaining = remaining.substring(typeMatch ? typeMatch[1].length : 0);
    
    // Extract discount value (numbers at the beginning)
    const valueMatch = remaining.match(/^(\d+)/);
    const discountValue = valueMatch ? parseFloat(valueMatch[1]) : 0;
    
    remaining = remaining.substring(valueMatch ? valueMatch[1].length : 0);
    
    // Extract min order amount (next set of numbers)
    const minAmountMatch = remaining.match(/^(\d+)/);
    const minOrderAmount = minAmountMatch ? parseFloat(minAmountMatch[1]) : 0;
    
    remaining = remaining.substring(minAmountMatch ? minAmountMatch[1].length : 0);
    
    // Extract max discount (next set of numbers, could be 0)
    const maxDiscountMatch = remaining.match(/^(\d+)/);
    const maxDiscount = maxDiscountMatch ? parseFloat(maxDiscountMatch[1]) : Infinity;
    
    remaining = remaining.substring(maxDiscountMatch ? maxDiscountMatch[1].length : 0);
    
    // Extract dates (YYYY-MM-DD format)
    const datePattern = /(\d{4}-\d{2}-\d{2})/g;
    const dates = remaining.match(datePattern) || [];
    
    const validFrom = dates[0] || '';
    const validUntil = dates[1] || '';
    
    // Remove dates from remaining string
    dates.forEach(date => {
      remaining = remaining.replace(date, '');
    });
    
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
    
    return result;
    
  } catch (error) {
    console.error('Error parsing concatenated coupon string:', error);
    return null;
  }
};

// Helper function to parse coupon data from sheet row
const parseCouponData = (row, headerRow) => {
  try {
    console.log('Parsing coupon data from row:', row);
    console.log('Using headers:', headerRow);
    
    // If there's only one column or the data appears to be concatenated
    if (row.length === 1 || (row.length <= 2 && row[0].length > 10)) {
      console.log('Detected concatenated format, parsing...');
      return parseCouponFromConcatenatedString(row[0]);
    }
    
    // Handle the case where we have individual columns
    if (row.length >= 8) {
      // Direct mapping for 8-column format
      const result = {
        code: (row[0] || '').toString().trim().toUpperCase(),
        discountType: (row[1] || 'percentage').toString().trim().toLowerCase(),
        discountValue: parseFloat(row[2] || '0') || 0,
        minOrderAmount: parseFloat(row[3] || '0') || 0,
        maxDiscount: parseFloat(row[4] || '0') || Infinity,
        validFrom: (row[5] || '').toString().trim(),
        validUntil: (row[6] || '').toString().trim(),
        applicableCourses: (row[7] || 'all').toString().trim(),
      };
      
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
      const value = row[index] ? row[index].toString().trim() : '';
      data[standardKey] = value;
    });

    // Return standardized coupon data with fallbacks for different column arrangements
    const result = {
      code: (data.code || data.couponcode || '').toUpperCase().trim(),
      discountType: (data.discounttype || data.type || 'percentage').toLowerCase(),
      discountValue: parseFloat(data.discountvalue || data.discountpercentage || data.discount || data.percentage || '0') || 0,
      minOrderAmount: parseFloat(data.minorderamount || data.minamount || '0') || 0,
      maxDiscount: parseFloat(data.maxdiscount || '0') || Infinity,
      validFrom: (data.validfrom || data.startdate || '').trim(),
      validUntil: (data.validuntil || data.enddate || data.expiry || '').trim(),
      applicableCourses: (data.applicablecourses || data.courses || data.courseids || 'all').trim(),
    };
    
    return result;
    
  } catch (error) {
    console.error('Error parsing coupon data:', error);
    return null;
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      amount, 
      currency = 'INR', 
      course, 
      plan, 
      studentData, 
      couponCode, 
      originalAmount, 
      discountAmount,
      courseId
    } = body;
             
    console.log('Create order request:', { 
      amount, 
      currency, 
      course, 
      plan, 
      studentData, 
      couponCode, 
      originalAmount, 
      discountAmount,
      courseId
    });

    // Validate required fields
    if (!amount || !course || !plan || !studentData) {
      return new Response(
        JSON.stringify({
          message: 'Missing required fields',
          success: false
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay credentials');
      return new Response(
        JSON.stringify({
          message: 'Server configuration error',
          success: false
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // If coupon is provided, re-validate it to prevent tampering
    if (couponCode) {
      try {
        // Debug logging for environment variables
        console.log('Environment variables check for coupon validation:');
        console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
        console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
        console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64 exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64);
        console.log('GOOGLE_SHEET_ID exists:', !!process.env.GOOGLE_SHEET_ID);

        // Validate environment variables for Google Sheets
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SHEET_ID) {
          console.error('Missing required Google Sheets configuration');
          return new Response(
            JSON.stringify({
              message: 'Server configuration error - cannot validate coupon',
              success: false
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

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

        // Set up Google Sheets authentication
        const auth = new google.auth.JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        console.log('Attempting to authorize for coupon validation...');
        await auth.authorize();
        console.log('Authorization successful');

        const sheets = google.sheets({ version: 'v4', auth });

        // Fetch coupons from Google Sheets - try multiple possible sheet names
        const possibleSheetNames = ['Coupons', 'coupons', 'COUPONS', 'Coupon', 'coupon'];
        let response = null;
        let usedSheetName = '';

        for (const sheetName of possibleSheetNames) {
          try {
            console.log(`Trying to read sheet: ${sheetName}`);
            response = await sheets.spreadsheets.values.get({
              spreadsheetId: process.env.GOOGLE_SHEET_ID,
              range: `${sheetName}!A:Z`,
            });
            usedSheetName = sheetName;
            console.log(`Successfully read sheet: ${sheetName}`);
            break;
          } catch (error) {
            console.log(`Sheet '${sheetName}' not found, trying next...`);
            continue;
          }
        }

        if (!response) {
          console.error('No coupon sheet found with standard names');
          return new Response(
            JSON.stringify({
              message: 'Coupon database not found during order creation',
              success: false
            }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        const rows = response.data.values;
        console.log(`Found ${rows?.length || 0} rows in sheet '${usedSheetName}'`);
        
        if (!rows || rows.length === 0) {
          return new Response(
            JSON.stringify({
              message: 'No coupons found in database during order creation',
              success: false
            }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        // Handle the case where there are no headers (just data rows)
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

        // Find matching coupon
        const couponCodeUpper = couponCode.toString().toUpperCase().trim();
        let matchingCouponRow = null;
        
        for (let i = 0; i < dataRows.length; i++) {
          const row = dataRows[i];
          
          if (row && row.length > 0) {
            const parsedCoupon = parseCouponData(row, headerRow);
            
            if (parsedCoupon && parsedCoupon.code === couponCodeUpper) {
              console.log('Found matching coupon during order creation!');
              matchingCouponRow = parsedCoupon;
              break;
            }
          }
        }

        if (!matchingCouponRow) {
          console.log('Coupon not found during order creation:', couponCodeUpper);
          return new Response(
            JSON.stringify({
              message: 'Invalid coupon code during order creation',
              success: false
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        console.log('Found matching coupon during order creation:', matchingCouponRow);

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

          return new Response(
            JSON.stringify({
              message: dateMessage,
              success: false
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        // Check minimum order amount
        if (originalAmount < matchingCouponRow.minOrderAmount) {
          return new Response(
            JSON.stringify({
              message: `Minimum order amount of ₹${matchingCouponRow.minOrderAmount} required for this coupon`,
              success: false
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        // Check if coupon is applicable for the course
        if (!isCouponApplicableToCourse(matchingCouponRow.applicableCourses, courseId, course)) {
          return new Response(
            JSON.stringify({
              message: 'This coupon is not applicable for the selected course',
              success: false
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        console.log('Coupon validation successful during order creation');

      } catch (error) {
        console.error('Error validating coupon during order creation:', error);
        return new Response(
          JSON.stringify({
            message: 'Failed to validate coupon during order creation',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            success: false
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    // Ensure amount is a number and convert to integer (paise)
    const amountInPaise = Math.round(Number(amount));
             
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      return new Response(
        JSON.stringify({
          message: 'Invalid amount',
          success: false
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const options = {
      amount: amountInPaise,
      currency,
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      notes: {
        course,
        plan,
        student_name: studentData.name,
        student_email: studentData.email,
        student_phone: studentData.phone,
        coupon_code: couponCode || '',
        original_amount: originalAmount || amount,
        discount_amount: discountAmount || 0,
        course_id: courseId || '',
      },
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order.id);

    return new Response(
      JSON.stringify({
        id: order.id,
        currency: order.currency,
        amount: order.amount,
        success: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to create order',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        success: false,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
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