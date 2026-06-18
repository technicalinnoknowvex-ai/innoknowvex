import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions (not exported as route handlers)
async function getCouponsData() {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coupons:', error);
      throw new Error('Failed to fetch coupons');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCouponsData:', error);
    throw error;
  }
}

async function createCouponData(couponData) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .insert([couponData])
      .select()
      .single();

    if (error) {
      console.error('Error creating coupon:', error);
      
      if (error.code === '23505') {
        throw new Error('A coupon with this code already exists');
      }
      
      throw new Error('Failed to create coupon');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in createCouponData:', error);
    throw error;
  }
}

async function updateCouponData(couponId, couponData) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .update(couponData)
      .eq('id', couponId)
      .select()
      .single();

    if (error) {
      console.error('Error updating coupon:', error);
      
      if (error.code === '23505') {
        throw new Error('A coupon with this code already exists');
      }
      
      throw new Error('Failed to update coupon');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateCouponData:', error);
    throw error;
  }
}

async function deleteCouponData(couponId) {
  try {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', couponId);

    if (error) {
      console.error('Error deleting coupon:', error);
      throw new Error('Failed to delete coupon');
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteCouponData:', error);
    throw error;
  }
}

// GET endpoint - fetch all coupons
export async function GET() {
  try {
    const coupons = await getCouponsData();
    return Response.json({ success: true, data: coupons }, { status: 200 });
  } catch (error) {
    console.error('GET /api/validate-coupon/createCoupon error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST endpoint - create a new coupon
export async function POST(request) {
  try {
    const couponData = await request.json();
    const result = await createCouponData(couponData);
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error('POST /api/validate-coupon/createCoupon error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// PUT endpoint - update a coupon
export async function PUT(request) {
  try {
    const { couponId, couponData } = await request.json();
    
    if (!couponId) {
      return Response.json(
        { success: false, message: 'couponId is required' },
        { status: 400 }
      );
    }

    const result = await updateCouponData(couponId, couponData);
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('PUT /api/validate-coupon/createCoupon error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE endpoint - delete a coupon
export async function DELETE(request) {
  try {
    const { couponId } = await request.json();
    
    if (!couponId) {
      return Response.json(
        { success: false, message: 'couponId is required' },
        { status: 400 }
      );
    }

    const result = await deleteCouponData(couponId);
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/validate-coupon/createCoupon error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}