import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.VITE_GEMINI_API_KEY;

async function testGemini() {
    if (!apiKey) {
        console.error("VITE_GEMINI_API_KEY not found in .env.local");
        return;
    }

    console.log("Testing with API Key:", apiKey.substring(0, 10) + "...");

    try {
        const genAI = new GoogleGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Success with gemini-1.5-flash:", response.text());
    } catch (error) {
        console.error("Failed with gemini-1.5-flash:", error);
    }

    try {
        const genAI = new GoogleGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Success with gemini-2.0-flash:", response.text());
    } catch (error) {
        console.error("Failed with gemini-2.0-flash:", error);
    }
}

testGemini();
