const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function sendEnquiry(enquiryDetails) {
  try {
    const response = await fetch(`${BASE_URL}/api/user/send-enquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enquiryDetails),
    });

    const result = await response.json();
    console.log("🚀 ~ result:", result);

    if (!response.ok) {
      console.error("Send Enquiry Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to send enquiry"
      );
    }

    console.log("Send Enquiry Success:", result.message);
    return result.data;
  } catch (error) {
    console.error("Send Enquiry Error:", error);
    throw new Error(`Failed to send enquiry: ${error.message}`);
  }
}
