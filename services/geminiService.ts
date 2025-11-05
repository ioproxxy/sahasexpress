import { GoogleGenAI, Type } from "@google/genai";
import { Product } from '../types';

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

export const getRecommendedProducts = async (mainProduct: Product, allProducts: Product[]): Promise<number[]> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return [];
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const otherProducts = allProducts
            .filter(p => p.id !== mainProduct.id)
            .map(({ id, name, category, description }) => ({ id, name, category, description }));

        if (otherProducts.length === 0) {
            return [];
        }

        const prompt = `Based on the product provided below, recommend up to 3 similar products from the "Available Products" list.

Product:
- Name: ${mainProduct.name}
- Category: ${mainProduct.category}
- Description: ${mainProduct.description}

Available Products:
${JSON.stringify(otherProducts, null, 2)}

Return your answer as a JSON object with a single key "recommended_ids", which is an array of the integer IDs for the recommended products. For example: {"recommended_ids": [12, 34, 56]}. Do not include any other text or explanation.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommended_ids: {
                            type: Type.ARRAY,
                            description: "An array of product IDs to recommend.",
                            items: {
                                type: Type.NUMBER,
                            }
                        }
                    }
                }
            }
        });

        const jsonResponseText = response.text.trim();
        const result = JSON.parse(jsonResponseText);
        
        if (result && result.recommended_ids && Array.isArray(result.recommended_ids)) {
            return result.recommended_ids.filter(id => typeof id === 'number');
        }

        return [];

    } catch (error) {
        console.error("Error calling Gemini API for recommendations:", error);
        return [];
    }
}
