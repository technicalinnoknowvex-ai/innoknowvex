// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// // Get all coupons
// export const getCoupons = async () => {
//   try {
//     const { data, error } = await supabase
//       .from('coupons')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('Error fetching coupons:', error);
//       throw error;
//     }
//     return data || [];
//   } catch (error) {
//     console.error('Unexpected error fetching coupons:', error);
//     return [];
//   }
// };

// // Create new coupon
// export const createCoupon = async (couponData) => {
//   try {
//     // Validate required fields
//     if (!couponData.code || !couponData.discount_type) {
//       throw new Error('Code and discount type are required');
//     }

//     // Validate discount type specific fields
//     if (couponData.discount_type === 'percentage') {
//       if (!couponData.percentage_discount || couponData.percentage_discount < 0 || couponData.percentage_discount > 100) {
//         throw new Error('Percentage discount must be between 0 and 100');
//       }
//       couponData.fixed_amount_discount = null;
//     } else if (couponData.discount_type === 'fixed' || couponData.discount_type === 'fixed_price' || couponData.discount_type === 'minimum_price') {
//       if (!couponData.fixed_amount_discount || couponData.fixed_amount_discount <= 0) {
//         throw new Error('Fixed amount discount must be greater than 0');
//       }
//       couponData.percentage_discount = null;
//     }

//     const { data, error } = await supabase
//       .from('coupons')
//       .insert([{
//         ...couponData,
//         code: couponData.code.toUpperCase(),
//         times_used: 0
//       }])
//       .select()
//       .single();

//     if (error) {
//       console.error('Error creating coupon:', error);
//       throw error;
//     }
//     return { success: true, data };
//   } catch (error) {
//     console.error('Unexpected error creating coupon:', error);
//     throw new Error(error.message);
//   }
// };

// // Update coupon
// export const updateCoupon = async (id, couponData) => {
//   try {
//     // Validate discount type specific fields
//     if (couponData.discount_type === 'percentage') {
//       if (!couponData.percentage_discount || couponData.percentage_discount < 0 || couponData.percentage_discount > 100) {
//         throw new Error('Percentage discount must be between 0 and 100');
//       }
//       couponData.fixed_amount_discount = null;
//     } else if (couponData.discount_type === 'fixed' || couponData.discount_type === 'fixed_price' || couponData.discount_type === 'minimum_price') {
//       if (!couponData.fixed_amount_discount || couponData.fixed_amount_discount <= 0) {
//         throw new Error('Fixed amount discount must be greater than 0');
//       }
//       couponData.percentage_discount = null;
//     }

//     const { data, error } = await supabase
//       .from('coupons')
//       .update({
//         ...couponData,
//         code: couponData.code ? couponData.code.toUpperCase() : undefined
//       })
//       .eq('id', id)
//       .select()
//       .single();

//     if (error) {
//       console.error('Error updating coupon:', error);
//       throw error;
//     }
//     return { success: true, data };
//   } catch (error) {
//     console.error('Unexpected error updating coupon:', error);
//     throw new Error(error.message);
//   }
// };

// // Delete coupon
// export const deleteCoupon = async (id) => {
//   try {
//     const { error } = await supabase
//       .from('coupons')
//       .delete()
//       .eq('id', id);

//     if (error) {
//       console.error('Error deleting coupon:', error);
//       throw error;
//     }
//     return { success: true };
//   } catch (error) {
//     console.error('Unexpected error deleting coupon:', error);
//     throw new Error(error.message);
//   }
// };

// // Validate coupon (for public use)
// export const validateCoupon = async (couponCode, courseData = {}) => {
//   try {
//     const { data, error } = await supabase
//       .from('coupons')
//       .select('*')
//       .eq('code', couponCode.toUpperCase())
//       .eq('is_active', true)
//       .single();

//     if (error || !data) {
//       throw new Error('Invalid or inactive coupon code');
//     }

//     const now = new Date();
    
//     // Check validity dates
//     if (data.valid_from && new Date(data.valid_from) > now) {
//       throw new Error(`Coupon will be valid from ${new Date(data.valid_from).toLocaleDateString()}`);
//     }

//     if (data.valid_until && new Date(data.valid_until) < now) {
//       throw new Error(`Coupon expired on ${new Date(data.valid_until).toLocaleDateString()}`);
//     }

//     // Check usage limits
//     if (data.max_uses && data.times_used >= data.max_uses) {
//       throw new Error('This coupon has reached its usage limit');
//     }

//     return { success: true, coupon: data };
//   } catch (error) {
//     console.error('Error validating coupon:', error);
//     throw new Error(error.message);
//   }
// };






import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    // ============================================
    // STEP 1: Parse request body
    // ============================================
    const body = await request.json();
    const {
      couponCode,
      courseId,
      originalPrice,
      course,
      plan,
    } = body;

    console.log('🎟️ [COUPON] Validating coupon:', {
      code: couponCode,
      courseId,
      originalPrice,
      plan,
    });

    // Validate required fields
    if (!couponCode || !originalPrice) {
      return NextResponse.json(
        {
          success: false,
          message: 'Coupon code and original price are required',
        },
        { status: 400 }
      );
    }

    // ============================================
    // STEP 2: Fetch coupon from database
    // ============================================
    const { data: couponData, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (couponError || !couponData) {
      console.log('❌ [COUPON] Coupon not found or inactive:', couponCode);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or inactive coupon code',
        },
        { status: 404 }
      );
    }

    console.log('✅ [COUPON] Coupon found:', couponData.code);

    // ============================================
    // STEP 3: Check validity dates
    // ============================================
    const now = new Date();

    if (couponData.valid_from && new Date(couponData.valid_from) > now) {
      const validFromDate = new Date(couponData.valid_from).toLocaleDateString();
      console.log('❌ [COUPON] Coupon not yet valid. Valid from:', validFromDate);
      return NextResponse.json(
        {
          success: false,
          message: `Coupon will be valid from ${validFromDate}`,
        },
        { status: 400 }
      );
    }

    if (couponData.valid_until && new Date(couponData.valid_until) < now) {
      const expiredDate = new Date(couponData.valid_until).toLocaleDateString();
      console.log('❌ [COUPON] Coupon expired on:', expiredDate);
      return NextResponse.json(
        {
          success: false,
          message: `Coupon expired on ${expiredDate}`,
        },
        { status: 400 }
      );
    }

    console.log('✅ [COUPON] Validity dates check passed');

    // ============================================
    // STEP 4: Check usage limits
    // ============================================
    if (couponData.max_uses && couponData.times_used >= couponData.max_uses) {
      console.log('❌ [COUPON] Usage limit reached:', {
        timesUsed: couponData.times_used,
        maxUses: couponData.max_uses,
      });
      return NextResponse.json(
        {
          success: false,
          message: 'This coupon has reached its usage limit',
        },
        { status: 400 }
      );
    }

    console.log('✅ [COUPON] Usage limit check passed:', {
      timesUsed: couponData.times_used,
      maxUses: couponData.max_uses || 'unlimited',
    });

    // ============================================
    // STEP 5: Check minimum order amount
    // ============================================
    if (couponData.min_order_amount && originalPrice < couponData.min_order_amount) {
      console.log('❌ [COUPON] Order amount too low:', {
        orderAmount: originalPrice,
        minRequired: couponData.min_order_amount,
      });
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order amount of ₹${couponData.min_order_amount} required`,
        },
        { status: 400 }
      );
    }

    // ============================================
    // STEP 6: Check maximum order amount (if applicable)
    // ============================================
    if (couponData.max_order_amount && originalPrice > couponData.max_order_amount) {
      console.log('❌ [COUPON] Order amount too high:', {
        orderAmount: originalPrice,
        maxAllowed: couponData.max_order_amount,
      });
      return NextResponse.json(
        {
          success: false,
          message: `This coupon is only valid for orders up to ₹${couponData.max_order_amount}`,
        },
        { status: 400 }
      );
    }

    // ============================================
    // STEP 7: Check applicable courses
    // ============================================
    if (couponData.applicable_courses && couponData.applicable_courses.length > 0) {
      const isApplicable = couponData.applicable_courses.includes(courseId);
      
      if (!isApplicable) {
        console.log('❌ [COUPON] Coupon not applicable to this course:', {
          courseId,
          applicableCourses: couponData.applicable_courses,
        });
        return NextResponse.json(
          {
            success: false,
            message: 'This coupon is not applicable to the selected course',
          },
          { status: 400 }
        );
      }
    }

    console.log('✅ [COUPON] Course applicability check passed');

    // ============================================
    // STEP 8: Calculate discount based on discount type
    // ============================================
    let discountAmount = 0;
    let finalAmount = originalPrice;

    switch (couponData.discount_type) {
      case 'percentage':
        // Percentage discount
        discountAmount = (originalPrice * couponData.percentage_discount) / 100;
        finalAmount = originalPrice - discountAmount;
        console.log('💰 [COUPON] Percentage discount:', {
          percentage: couponData.percentage_discount,
          discountAmount,
          finalAmount,
        });
        break;

      case 'fixed':
        // Fixed amount discount
        discountAmount = couponData.fixed_amount_discount;
        finalAmount = Math.max(0, originalPrice - discountAmount);
        console.log('💰 [COUPON] Fixed discount:', {
          fixedDiscount: couponData.fixed_amount_discount,
          discountAmount,
          finalAmount,
        });
        break;

      case 'fixed_price':
        // Set a fixed final price
        finalAmount = couponData.fixed_amount_discount;
        discountAmount = originalPrice - finalAmount;
        console.log('💰 [COUPON] Fixed price:', {
          fixedPrice: couponData.fixed_amount_discount,
          discountAmount,
          finalAmount,
        });
        break;

      case 'minimum_price':
        // Ensure final price doesn't go below minimum
        const potentialDiscount = originalPrice - couponData.fixed_amount_discount;
        if (potentialDiscount > 0) {
          discountAmount = potentialDiscount;
          finalAmount = couponData.fixed_amount_discount;
        } else {
          discountAmount = 0;
          finalAmount = originalPrice;
        }
        console.log('💰 [COUPON] Minimum price:', {
          minimumPrice: couponData.fixed_amount_discount,
          discountAmount,
          finalAmount,
        });
        break;

      default:
        console.error('❌ [COUPON] Unknown discount type:', couponData.discount_type);
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid discount type',
          },
          { status: 500 }
        );
    }

    // Ensure final amount is never negative
    if (finalAmount < 0) {
      finalAmount = 0;
      discountAmount = originalPrice;
    }

    // Calculate savings percentage
    const savingsPercentage = originalPrice > 0
      ? Math.round((discountAmount / originalPrice) * 100)
      : 0;

    console.log('✅ [COUPON] Final calculation:', {
      originalPrice,
      discountAmount,
      finalAmount,
      savingsPercentage,
    });

    // ============================================
    // STEP 9: Return success response
    // ============================================
    return NextResponse.json({
      success: true,
      message: 'Coupon applied successfully',
      coupon: {
        code: couponData.code,
        description: couponData.description,
        discount_type: couponData.discount_type,
        percentage_discount: couponData.percentage_discount,
        fixed_amount_discount: couponData.fixed_amount_discount,
      },
      pricing: {
        originalPrice: originalPrice,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
        savingsPercentage: savingsPercentage,
      },
    });

  } catch (error) {
    console.error('❌ [COUPON] Error validating coupon:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to validate coupon',
        error: process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
      },
      { status: 500 }
    );
  }
}