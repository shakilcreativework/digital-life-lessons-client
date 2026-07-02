
export const fetchUserFavorites = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    const res = await fetch(`${baseUrl}/api/favorites?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch favorites: ${res.status}`);
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to load favorites");
    }

    return data.data || [];
  } catch (error) {
    console.error("Fetch favorites error:", error);
    throw error;
  }
};