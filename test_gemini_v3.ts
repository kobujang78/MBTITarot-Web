import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyC6TMTleiVsr0OyQFlrpgPm7x4isbG5hJY";

async function testGemini() {
    console.log("Testing with API Key:", apiKey.substring(0, 10) + "...");

    try {
        const ai = new GoogleGenAI(apiKey);
        console.log("SDK Initialized.");

        // Testing gemini-2.0-flash (User's preferred model)
        console.log("Requesting gemini-2.0-flash...");
        const response2 = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: "Hello, confirm you are working.",
        });
        console.log("SUCCESS: gemini-2.0-flash responded.");
        console.log("Response:", response2.text);
    } catch (error) {
        console.error("FAILED with gemini-2.0-flash:", error.message || error);

        // Fallback to testing gemini-1.5-flash
        try {
            const ai = new GoogleGenAI(apiKey);
            console.log("Requesting gemini-1.5-flash...");
            const response1 = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: "Hello, confirm you are working.",
            });
            console.log("SUCCESS: gemini-1.5-flash responded.");
            console.log("Response:", response1.text);
        } catch (err) {
            console.error("FAILED with gemini-1.5-flash:", err.message || err);
        }
    }
}

testGemini();
