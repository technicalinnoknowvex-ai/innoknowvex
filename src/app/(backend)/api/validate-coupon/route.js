import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Validate coupon function
async function validateCoupon(couponCode, courseData = {}) {
  try {
    if (!couponCode || typeof couponCode !== 'string' || couponCode.trim() === '') {
      return { 
        success: false, 
        message: 'Please enter a coupon code',
        userFriendly: true 
      };
    }

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase().trim())
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('❌ [COUPON VALIDATION] Database error:', error);
      
      if (error.code === 'PGRST116') {
        return { 
          success: false, 
          message: 'Invalid coupon code',
          userFriendly: true 
        };
      }
      
      return { 
        success: false, 
        message: 'Unable to validate coupon. Please try again.',
        userFriendly: true 
      };
    }

    if (!data) {
      return { 
        success: false, 
        message: 'Invalid coupon code',
        userFriendly: true 
      };
    }

    const now = new Date();
    
    // Check validity dates
    if (data.valid_from && new Date(data.valid_from) > now) {
      const validFromDate = new Date(data.valid_from).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return { 
        success: false, 
        message: `This coupon is valid from ${validFromDate}`,
        userFriendly: true 
      };
    }

    if (data.valid_until && new Date(data.valid_until) < now) {
      const expiredDate = new Date(data.valid_until).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return { 
        success: false, 
        message: `This coupon expired on ${expiredDate}`,
        userFriendly: true 
      };
    }

    // Check usage limits
    if (data.max_uses && data.times_used >= data.max_uses) {
      return { 
        success: false, 
        message: 'This coupon has reached its maximum usage limit',
        userFriendly: true 
      };
    }

    // console.log('✅ [COUPON VALIDATION] Coupon is valid:', data.code);
    return { success: true, coupon: data };

  } catch (error) {
    console.error('❌ [COUPON VALIDATION] Unexpected error:', error);
    return { 
      success: false, 
      message: 'Something went wrong. Please try again later.',
      userFriendly: true 
    };
  }
}

// Calculate discount function
function calculateDiscount(coupon, originalPrice) {
  try {
    if (!coupon || !originalPrice || originalPrice <= 0) {
      return {
        success: false,
        message: 'Invalid price or coupon data'
      };
    }

    let discountAmount = 0;
    let finalPrice = originalPrice;

    switch (coupon.discount_type) {
      case 'percentage':
        if (coupon.percentage_discount) {
          discountAmount = (originalPrice * coupon.percentage_discount) / 100;
          finalPrice = originalPrice - discountAmount;
        }
        break;

      case 'fixed':
        if (coupon.fixed_amount_discount) {
          discountAmount = Math.min(coupon.fixed_amount_discount, originalPrice);
          finalPrice = originalPrice - discountAmount;
        }
        break;

      case 'fixed_price':
        if (coupon.fixed_amount_discount && coupon.fixed_amount_discount < originalPrice) {
          finalPrice = coupon.fixed_amount_discount;
          discountAmount = originalPrice - finalPrice;
        }
        break;

      case 'minimum_price':
        if (coupon.fixed_amount_discount) {
          finalPrice = Math.max(coupon.fixed_amount_discount, 0);
          discountAmount = originalPrice - finalPrice;
        }
        break;

      default:
        return {
          success: false,
          message: 'Invalid discount type'
        };
    }

    // Ensure final price is not negative
    finalPrice = Math.max(finalPrice, 0);
    discountAmount = originalPrice - finalPrice;

    return {
      success: true,
      originalPrice,
      discountAmount: Math.round(discountAmount),
      finalPrice: Math.round(finalPrice),
      savingsPercentage: Math.round((discountAmount / originalPrice) * 100)
    };

  } catch (error) {
    console.error('Error calculating discount:', error);
    return {
      success: false,
      message: 'Unable to calculate discount'
    };
  }
}

// POST endpoint
export async function POST(request) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ [VALIDATE-COUPON API] Failed to parse request body:', parseError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid request format',
          coupon: null,
          pricing: null
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { couponCode, courseId, originalPrice, course, plan } = body;

    // console.log('🎫 [VALIDATE-COUPON API] Received request:', {
    //   couponCode,
    //   courseId,
    //   originalPrice,
    //   course,
    //   plan
    // });

    // Validate required fields
    if (!couponCode || typeof couponCode !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please enter a coupon code',
          coupon: null,
          pricing: null
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!originalPrice || isNaN(originalPrice) || originalPrice <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid price information',
          coupon: null,
          pricing: null
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate the coupon
    const validationResult = await validateCoupon(couponCode, {
      courseId,
      course,
      plan
    });

    // Check if validation failed
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.message || 'Invalid coupon code',
          coupon: null,
          pricing: null
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Calculate discount
    const discountResult = calculateDiscount(
      validationResult.coupon,
      originalPrice
    );

    if (!discountResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to calculate discount',
          coupon: null,
          pricing: null
        },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Return success response with coupon and pricing details
    // console.log('✅ [VALIDATE-COUPON API] Coupon valid:', {
    //   code: validationResult.coupon.code,
    //   discount: discountResult.discountAmount,
    //   finalPrice: discountResult.finalPrice
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Coupon applied successfully',
        coupon: validationResult.coupon,
        pricing: {
          originalPrice: discountResult.originalPrice,
          discountAmount: discountResult.discountAmount,
          finalAmount: discountResult.finalPrice,
          savingsPercentage: discountResult.savingsPercentage
        }
      },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ [VALIDATE-COUPON API] Unexpected error:', error);
    
    // ALWAYS return JSON, never throw or return empty response
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again later.',
        coupon: null,
        pricing: null
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle GET requests (optional)
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      message: 'Method not allowed. Use POST.' 
    },
    { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}