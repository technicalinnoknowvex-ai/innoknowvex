import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const script_url= process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
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
          language: enquiryDetails.language,
          timestamp: enquiryDetails.timestamp
        }
      ])
      .select()
      
    if (error) {
      console.error("Supabase Insert Error:", error);
      throw new Error(error.message || "Failed to save enquiry to database");
    }

    

    console.log("✅ Enquiry saved successfully:", data);

    try {
      const sheetResponse = await fetch('/api/send-enquiry', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: enquiryDetails.name,
          email: enquiryDetails.email,
          phone: enquiryDetails.phone,
          program: enquiryDetails.program,
          language: enquiryDetails.language,
          timestamp: enquiryDetails.timestamp
        })
      });

      const sheetData = await sheetResponse.json();
      console.log("Google Sheets response:", sheetData);

    } catch (sheetError) {
      console.error("Google Sheets Error:", sheetError);
      // Important: don't break main flow if Sheets fails
    }

    return data[0];

  } catch (error) {
    console.error("Send Enquiry Error:", error);
    throw new Error(`Failed to send enquiry: ${error.message}`);
  }
}