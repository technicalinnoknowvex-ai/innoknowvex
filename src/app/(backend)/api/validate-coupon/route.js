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