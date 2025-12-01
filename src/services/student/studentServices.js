const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ;

export async function getStudent(studentId) {
  try {
    const response = await fetch(`${BASE_URL}/api/v2/student/${studentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to fetch student",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Service error:", error);
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}
