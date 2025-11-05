
import { GoogleGenAI } from "@google/genai";

export const generateDescription = async (productName: string, keywords: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return "API key not configured. Please check your environment variables.";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Generate a compelling, one-paragraph e-commerce product description for the following product.
    
    Product Name: "${productName}"
    Keywords: "${keywords}"
    
    The description should be engaging, highlight key features based on the keywords, and encourage a purchase. Do not use markdown or special formatting.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Failed to generate description: ${error.message}`;
    }
    return "An unknown error occurred while generating the description.";
  }
};
