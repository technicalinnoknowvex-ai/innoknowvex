// Register admin or student by specifying 'role': 'ADMIN' or 'STUDENT' in data
export async function registerUser(data) {
  try {
    const res = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // data must include { name, email, password, role }
    });

    const result = await res.json();

    if (!res.ok) {
      const errorMessage =
        result.error || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return result;
  } catch (error) {
    console.error("Register failed:", error);

    if (error instanceof Error) {
      if (
        error.message === "fetch failed" ||
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Network connection failed. Please check your internet connection and try again."
        );
      }
      throw error;
    }

    throw new Error("An unexpected error occurred. Please try again.");
  }
}
