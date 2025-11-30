// import { createClient } from '@supabase/supabase-js';

// // Helper function to validate date format and check if coupon is still valid
// const isValidCouponDate = (validFrom, validUntil) => {
//   try {
//     const now = new Date();
//     const startDate = validFrom ? new Date(validFrom) : null;
//     const endDate = validUntil ? new Date(validUntil) : null;

//     // If no dates provided, consider it always valid
//     if (!startDate && !endDate) return true;

//     // Check start date
//     if (startDate && now < startDate) return false;

//     // Check end date
//     if (endDate && now > endDate) return false;

//     return true;
//   } catch (error) {
//     console.error('Error validating coupon dates:', error);
//     return false;
//   }
// };

// // Helper function to check if a coupon is applicable to the specific course
// const isCouponApplicableToCourse = (applicableCourses, courseId, courseName) => {
//   // If applicableCourses is null, empty array, or contains no items, the coupon is always applicable
//   if (!applicableCourses || applicableCourses.length === 0) {
//     return true;
//   }
  
//   // Check if array contains "all" or "*" indicating universal applicability
//   if (applicableCourses.some(course => 
//     typeof course === 'string' && 
//     (course.toLowerCase() === 'all' || course === '*')
//   )) {
//     return true;
//   }

//   // Check if courseId or courseName is in the list of applicable courses
//   const coursesList = applicableCourses.map(item => 
//     typeof item === 'string' ? item.toLowerCase().trim() : ''
//   );
  
//   const courseIdLower = courseId ? courseId.toLowerCase().trim() : '';
//   const courseNameLower = courseName ? courseName.toLowerCase().trim() : '';

//   // The coupon is applicable if the courseId or courseName is in the list
//   return coursesList.includes(courseIdLower) || coursesList.includes(courseNameLower);
// };

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { couponCode, course, originalPrice, courseId, plan } = body;

//     console.log('Coupon validation request:', {
//       couponCode,
//       course,
//       originalPrice,
//       courseId,
//       plan
//     });

//     // Validate required fields
//     if (!couponCode || !originalPrice) {
//       return new Response(
//         JSON.stringify({
//           message: 'Missing required fields: couponCode and originalPrice are required',
//           success: false
//         }), {
//           status: 400,
//           headers: { "Content-Type": "application/json" }
//         }
//       );
//     }

//     if (originalPrice <= 0) {
//       return new Response(
//         JSON.stringify({
//           message: 'Invalid original price',
//           success: false
//         }), {
//           status: 400,
//           headers: { "Content-Type": "application/json" }
//         }
//       );
//     }

//     // Validate Supabase environment variables
//     if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
//       console.error('Missing required Supabase configuration');
//       return new Response(
//         JSON.stringify({
//           message: 'Server configuration error',
//           success: false
//         }), {
//           status: 500,
//           headers: { "Content-Type": "application/json" }
//         }
//       );
//     }

//     // Initialize Supabase client
//     const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
//     console.log('Successfully initialized Supabase client');

//     // Query the Supabase database for the coupon
//     const { data, error } = await supabase
//       .from('coupons')
//       .select('*')
//       .eq('code', couponCode.toUpperCase())
//       .eq('is_active', true); // Only get active coupons

//     if (error) {
//       console.error('Supabase query error:', error);
//       return new Response(
//         JSON.stringify({
//           message: 'Failed to fetch coupon from database',
//           success: false
//         }), {
//           status: 500,
//           headers: { "Content-Type": "application/json" }
//         }
//       );
//     }

//     const matchingCoupon = data?.[0];

//     if (!matchingCoupon) {
//       console.log('Coupon not found or inactive:', couponCode.toUpperCase());
//       return new Response(
//         JSON.stringify({
//           message: 'Invalid or inactive coupon code',
//           success: false
//         }), {
//           status: 404,
//           headers: { "Content-Type": "application/json" }
//         }
//       );
//     }

//     console.log('Found matching coupon:', matchingCoupon);

//     // Check if coupon is active
//     if (!matchingCoupon.is_active) {
//       return new Response(
//         JSON.stringify({
//           message: 'This coupon is no longer active',
//           success: false
//         }), {
//           status: 400,
//           headers: { "Content-Type": "application/json" }
//         }
//       );
//     }

//     // Validate coupon dates
//     if (!isValidCouponDate(matchingCoupon.valid_from, matchingCoupon.valid_until)) {
//       let dateMessage = 'Coupon is not valid';
//       if (matchingCoupon.valid_until && new Date() > new Date(matchingCoupon.valid_until)) {
//         dateMessage = `Coupon expired on ${new Date(matchingCoupon.valid_until).toLocaleDateString()}`;
//       } else if (matchingCoupon.valid_from && new Date() < new Date(matchingCoupon.valid_from)) {
//         dateMessage = `Coupon will be valid from ${new Date(matchingCoupon.valid_from).toLocaleDateString()}`;
//       }

//       return new Response(
//         JSON.stringify({
//           message: dateMessage,
//           success: false
//         }), {
//           status: 400,
//           headers: { "Content-Type": "application/json" }
//         }
//       );
//     }

//     // Check usage limits
//     if (matchingCoupon.max_uses && matchingCoupon.times_used >= matchingCoupon.max_uses) {
//       return new Response(
//         JSON.stringify({
//           message: 'This coupon has reached its usage limit',
//           success: false
//         }), {
//           status: 400,
//           headers: { "Content-Type": "application/json" }
//         }
//       );
//     }

//     // Check minimum order amount
//     if (matchingCoupon.min_order_amount && originalPrice < matchingCoupon.min_order_amount) {
//       return new Response(
//         JSON.stringify({
//           message: `Minimum order amount of ₹${matchingCoupon.min_order_amount} required for this coupon`,
//           success: false
//         }), {
//           status: 400,
//           headers: { "Content-Type": "application/json" }
//         }
//       );
//     }

//     // Check if coupon is applicable for the course
//     if (!isCouponApplicableToCourse(matchingCoupon.applicable_courses, courseId, course)) {
//       return new Response(
//         JSON.stringify({
//           message: 'This coupon is not applicable for the selected course',
//           success: false
//         }), {
//           status: 400,
//           headers: { "Content-Type": "application/json" }
//         }
//       );
//     }

//     // Calculate discount based on the correct schema field names
//     let discountAmount = 0;
//     const discountType = matchingCoupon.discount_type;
//     let discountPercentage = 0;

//     if (discountType === 'percentage') {
//       // Use percentage_discount field from schema
//       const percentageValue = matchingCoupon.percentage_discount || 0;
//       discountAmount = Math.round((originalPrice * percentageValue) / 100);
//       discountPercentage = percentageValue;
//     } else if (discountType === 'fixed') {
//       // Use fixed_amount_discount field from schema
//       discountAmount = Math.min(matchingCoupon.fixed_amount_discount || 0, originalPrice);
//       discountPercentage = Math.round((discountAmount / originalPrice) * 100);
//     }

//     // Ensure discount doesn't exceed the order amount
//     discountAmount = Math.min(discountAmount, originalPrice);
//     const finalAmount = Math.max(originalPrice - discountAmount, 0);

//     // Recalculate percentage based on actual discount amount
//     const actualDiscountPercentage = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

//     console.log('Coupon validation successful:', {
//       code: matchingCoupon.code,
//       discountType: discountType,
//       discountValue: discountType === 'percentage' ? matchingCoupon.percentage_discount : matchingCoupon.fixed_amount_discount,
//       discountAmount,
//       finalAmount,
//       originalPrice,
//       actualDiscountPercentage
//     });

//     const result = {
//       success: true,
//       message: 'Coupon applied successfully',
//       coupon: {
//         code: matchingCoupon.code,
//         description: matchingCoupon.description,
//         discountType: discountType,
//         discountPercentage: actualDiscountPercentage,
//         originalDiscountValue: discountType === 'percentage' ? matchingCoupon.percentage_discount : matchingCoupon.fixed_amount_discount,
//         applicableCourses: matchingCoupon.applicable_courses,
//         validFrom: matchingCoupon.valid_from,
//         validUntil: matchingCoupon.valid_until,
//         minOrderAmount: matchingCoupon.min_order_amount,
//         maxUses: matchingCoupon.max_uses,
//         timesUsed: matchingCoupon.times_used,
//         isActive: matchingCoupon.is_active,
//       },
//       pricing: {
//         originalAmount: originalPrice,
//         discountAmount: Math.round(discountAmount),
//         finalAmount: Math.round(finalAmount),
//         savingsPercentage: actualDiscountPercentage
//       }
//     };

//     return new Response(
//       JSON.stringify(result), {
//         status: 200,
//         headers: { "Content-Type": "application/json" }
//       }
//     );

//   } catch (error) {
//     console.error('Error validating coupon:', error);
//     return new Response(
//       JSON.stringify({
//         message: 'Failed to validate coupon due to a server error',
//         error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
//         success: false,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" }
//       }
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
// }





import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all coupons
export const getCoupons = async () => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching coupons:', error);
    return [];
  }
};

// Create new coupon
export const createCoupon = async (couponData) => {
  try {
    // Validate required fields
    if (!couponData.code || !couponData.discount_type) {
      throw new Error('Code and discount type are required');
    }

    // Validate discount type specific fields
    if (couponData.discount_type === 'percentage') {
      if (!couponData.percentage_discount || couponData.percentage_discount < 0 || couponData.percentage_discount > 100) {
        throw new Error('Percentage discount must be between 0 and 100');
      }
      couponData.fixed_amount_discount = null;
    } else if (couponData.discount_type === 'fixed' || couponData.discount_type === 'fixed_price' || couponData.discount_type === 'minimum_price') {
      if (!couponData.fixed_amount_discount || couponData.fixed_amount_discount <= 0) {
        throw new Error('Fixed amount discount must be greater than 0');
      }
      couponData.percentage_discount = null;
    }

    const { data, error } = await supabase
      .from('coupons')
      .insert([{
        ...couponData,
        code: couponData.code.toUpperCase(),
        times_used: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error creating coupon:', error);
    throw new Error(error.message);
  }
};

// Update coupon
export const updateCoupon = async (id, couponData) => {
  try {
    // Validate discount type specific fields
    if (couponData.discount_type === 'percentage') {
      if (!couponData.percentage_discount || couponData.percentage_discount < 0 || couponData.percentage_discount > 100) {
        throw new Error('Percentage discount must be between 0 and 100');
      }
      couponData.fixed_amount_discount = null;
    } else if (couponData.discount_type === 'fixed' || couponData.discount_type === 'fixed_price' || couponData.discount_type === 'minimum_price') {
      if (!couponData.fixed_amount_discount || couponData.fixed_amount_discount <= 0) {
        throw new Error('Fixed amount discount must be greater than 0');
      }
      couponData.percentage_discount = null;
    }

    const { data, error } = await supabase
      .from('coupons')
      .update({
        ...couponData,
        code: couponData.code ? couponData.code.toUpperCase() : undefined
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error updating coupon:', error);
    throw new Error(error.message);
  }
};

// Delete coupon
export const deleteCoupon = async (id) => {
  try {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting coupon:', error);
    throw new Error(error.message);
  }
};

// Validate coupon (for public use)
export const validateCoupon = async (couponCode, courseData = {}) => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new Error('Invalid or inactive coupon code');
    }

    const now = new Date();
    
    // Check validity dates
    if (data.valid_from && new Date(data.valid_from) > now) {
      throw new Error(`Coupon will be valid from ${new Date(data.valid_from).toLocaleDateString()}`);
    }

    if (data.valid_until && new Date(data.valid_until) < now) {
      throw new Error(`Coupon expired on ${new Date(data.valid_until).toLocaleDateString()}`);
    }

    // Check usage limits
    if (data.max_uses && data.times_used >= data.max_uses) {
      throw new Error('This coupon has reached its usage limit');
    }

    return { success: true, coupon: data };
  } catch (error) {
    console.error('Error validating coupon:', error);
    throw new Error(error.message);
  }
};