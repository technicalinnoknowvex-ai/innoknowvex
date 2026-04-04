import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all coupons
export async function getCoupons() {
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
    console.error('Error in getCoupons:', error);
    throw error;
  }
}

// Create a new coupon
export async function createCoupon(couponData) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .insert([couponData])
      .select()
      .single();

    if (error) {
      console.error('Error creating coupon:', error);
      
      // Handle duplicate code error
      if (error.code === '23505') {
        throw new Error('A coupon with this code already exists');
      }
      
      throw new Error('Failed to create coupon');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in createCoupon:', error);
    throw error;
  }
}

// Update an existing coupon
export async function updateCoupon(couponId, couponData) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .update(couponData)
      .eq('id', couponId)
      .select()
      .single();

    if (error) {
      console.error('Error updating coupon:', error);
      
      // Handle duplicate code error
      if (error.code === '23505') {
        throw new Error('A coupon with this code already exists');
      }
      
      throw new Error('Failed to update coupon');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateCoupon:', error);
    throw error;
  }
}

// Delete a coupon
export async function deleteCoupon(couponId) {
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
    console.error('Error in deleteCoupon:', error);
    throw error;
  }
}