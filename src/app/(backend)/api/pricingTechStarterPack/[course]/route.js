import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const course = resolvedParams.course;

    console.log('🔍 Fetching pricing for course:', course);

    if (!course || course === '[course]') {
      return NextResponse.json(
        { message: 'Course parameter is required', success: false },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase configuration');
      return NextResponse.json(
        { message: 'Server configuration error', success: false },
        { status: 500 }
      );
    }

    console.log('📊 Querying Supabase for course:', course);

    const { data, error } = await supabase
      .from('pricing_techpack') 
      .select('*')
      .eq('program_id', course)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('❌ Supabase query error:', error);
      
      const { data: allData, error: allError } = await supabase
        .from('pricing_techpack')
        .select('*')
        .eq('is_active', true)
        .limit(1);

      if (allError || !allData || allData.length === 0) {
        console.error('❌ Error fetching fallback data:', allError);
        
        const fallbackData = {
          program_id: course,
          program_name: 'Tech Starter Pack',
          original_price: 33000,
          current_price: 25000,
          currency: 'INR',
          description: 'Complete tech learning bundle',
          features: [
            { name: "All Programming Languages", included: true },
            { name: "Complete DSA Coverage", included: true },
            { name: "Multiple Learning Plans", included: true },
            { name: "Lifetime Support", included: true }
          ],
          is_active: true,
        };

        console.log('🔄 Using hardcoded fallback data');
        return NextResponse.json(fallbackData, { status: 200 });
      }

      const fallbackData = allData[0];
      console.log('🔄 Using database fallback data:', fallbackData);

      const pricingData = {
        program_id: fallbackData.program_id,
        program_name: fallbackData.program_name,
        original_price: parseInt(fallbackData.original_price) || 33000,
        current_price: parseInt(fallbackData.current_price) || 25000,
        currency: fallbackData.currency || 'INR',
        description: fallbackData.description,
        features: fallbackData.features || [
          { name: "All Programming Languages", included: true },
          { name: "Complete DSA Coverage", included: true },
          { name: "Multiple Learning Plans", included: true },
          { name: "Lifetime Support", included: true }
        ],
        is_active: fallbackData.is_active,
      };

      return NextResponse.json(pricingData, { status: 200 });
    }

    console.log('✅ Found pricing data:', data);

    const pricingData = {
      program_id: data.program_id,
      program_name: data.program_name,
      original_price: parseInt(data.original_price) || 33000,
      current_price: parseInt(data.current_price) || 25000,
      currency: data.currency || 'INR',
      description: data.description,
      features: data.features || [
        { name: "All Programming Languages", included: true },
        { name: "Complete DSA Coverage", included: true },
        { name: "Multiple Learning Plans", included: true },
        { name: "Lifetime Support", included: true }
      ],
      is_active: data.is_active,
    };

    return NextResponse.json(pricingData, { status: 200 });

  } catch (error) {
    console.error('💥 Error fetching techpack pricing data:', error);
    
    const fallbackData = {
      program_id: 'fallback',
      program_name: 'Tech Starter Pack',
      original_price: 33000,
      current_price: 25000,
      currency: 'INR',
      description: 'Complete tech learning bundle',
      features: [
        { name: "All Programming Languages", included: true },
        { name: "Complete DSA Coverage", included: true },
        { name: "Multiple Learning Plans", included: true },
        { name: "Lifetime Support", included: true }
      ],
      is_active: true,
    };

    return NextResponse.json(fallbackData, { status: 200 });
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