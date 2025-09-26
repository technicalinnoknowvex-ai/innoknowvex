import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export async function sendEnquiry(enquiryDetails) {
  try {
    console.log("🚀 Sending enquiry to Supabase:", enquiryDetails);

    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          name: enquiryDetails.name,
          email: enquiryDetails.email,
          phone: enquiryDetails.phone,
          program: enquiryDetails.program,
          timestamp: enquiryDetails.timestamp
        }
      ])
      .select()

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw new Error(error.message || "Failed to save enquiry to database");
    }

    console.log("✅ Enquiry saved successfully:", data);
    return data[0];
  } catch (error) {
    console.error("Send Enquiry Error:", error);
    throw new Error(`Failed to send enquiry: ${error.message}`);
  }
}