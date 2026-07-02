// lib/api.js
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getLessonByUserId = async (id) => {
    try {
        const response = await fetch(`${baseUrl}/api/creator/lessons/${id}`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch lesson: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Failed to resolve lesson:", error);
        return null; // Return null so the UI knows no data exists
    }
};