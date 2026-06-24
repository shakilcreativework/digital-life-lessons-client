export const getAllUsers = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
        const response = await fetch(`${baseUrl}/api/users`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Server Action fetch failed with status: ${response.status}`);
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error("❌ Failed to resolve lessons from Express cluster:", error);
        // Fallback array prevents map layout crashes in your UI components
        return [];
    }
};