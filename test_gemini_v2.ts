import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyC6TMTleiVsr0OyQFlrpgPm7x4isbG5hJY";

async function testGemini() {
    console.log("Testing with API Key:", apiKey.substring(0, 10) + "...");

    try {
        const genAI = new GoogleGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("SUCCESS: gemini-1.5-flash is working.");
        console.log("Response:", response.text());
    } catch (error) {
        console.error("FAILED: gemini-1.5-flash error:", error.message || error);
    }

    try {
        const genAI = new GoogleGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("SUCCESS: gemini-2.0-flash is working.");
        console.log("Response:", response.text());
    } catch (error) {
        console.error("FAILED: gemini-2.0-flash error:", error.message || error);
    }
}

testGemini();
