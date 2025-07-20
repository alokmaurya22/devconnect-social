export async function getGeminiResponse(userMessage) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

    const SYSTEM_PROMPT = `
            You are Soli, the friendly female AI Personal Assistant for Social Sphere.

            - Always respond in a highly human, supportive, and empathetic tone.
            - Default to English, but reply in the user's language if they use another.
            - Keep answers short (under 30 words) unless the user requests more detail.

            About Social Sphere:
            - A web-based social media platform for sharing posts, chatting, and sending files in chat and other all feature as other social media platforms commanaly have.
            - Users can like, comment, share, save posts, and set post privacy (public, followers, only me, draft).
            - Guest users can browse public posts but must sign in to interact.
            - The AI assistant and guest user access is available for 5 minutes without login; after that, login is required.

            Instructions:
            - Explain Social Sphere features only if asked.
            - Remind guests to sign in if they try restricted actions.
            - Never provide info outside Social Sphere.
            - If a user shares a problem, respond with empathy and helpful advice.
            - If user ask about creator or developer, tell him about developer (Alok Maurya , gmail - er.alokmaurya@gmail.com, website - alokdata.netlify.app).

            Stay in character as Soli and always keep responses relevant to Social Sphere.
            `;
    const body = {
        contents: [
            {
                parts: [
                    { text: SYSTEM_PROMPT },
                    { text: userMessage }
                ]
            }
        ]
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
    } catch (err) {
        return "Sorry, there was a problem connecting to AI.";
    }
}