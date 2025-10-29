import { GoogleGenAI, Type } from '@google/genai';
import { GeminiResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set. Please ensure it's configured correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function parseJsonResponse(text: string): any {
    try {
        return JSON.parse(text);
    } catch (e) {
        const match = text.match(/```(json)?\s*([\s\S]*?)\s*```/);
        if (match && match[2]) {
            try {
                return JSON.parse(match[2]);
            } catch (e2) {
                console.error("Failed to parse extracted JSON from markdown.", e2);
                throw new Error("AI response was not valid JSON, even after extracting from markdown.");
            }
        }
    }
    console.error("Failed to parse JSON and no markdown block found in response:", text);
    throw new Error("AI response was not in a recognizable JSON format.");
}


export async function runFinancialAnalysis(query: string, documentContent: string | null): Promise<GeminiResponse> {
  
  const documentPrompt = documentContent 
    ? `Based on the content of the following document:\n\n---\n${documentContent}\n---\n\n`
    : '';

  const finalQueryPrompt = `${documentPrompt}Analyze the following financial query: "${query}". Provide a detailed, well-structured response in Markdown format. Also, provide a list of 3 plausible, but fictional, sources that a real analysis might have used. The final output must be a single JSON object matching the provided schema, without any surrounding text or markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: finalQueryPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    analysis: {
                        type: Type.STRING,
                        description: 'The detailed financial analysis in Markdown format.',
                    },
                    sources: {
                        type: Type.ARRAY,
                        description: 'A list of fictional source documents.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: {
                                    type: Type.STRING,
                                    description: 'The title of the source document.'
                                },
                                url: {
                                    type: Type.STRING,
                                    description: 'A plausible URL for the source.'
                                }
                            },
                            required: ["title", "url"],
                        }
                    }
                },
                required: ["analysis", "sources"],
            },
            temperature: 0.5,
        },
    });
    
    const jsonStr = response.text.trim();
    if (!jsonStr) {
        throw new Error("The AI model returned an empty response.");
    }
    
    const result = parseJsonResponse(jsonStr);
    
    if (!result.analysis || !Array.isArray(result.sources)) {
        console.error("Parsed JSON is missing required fields:", result);
        throw new Error("AI response is missing required 'analysis' or 'sources' fields.");
    }

    return result as GeminiResponse;

  } catch (error) {
    console.error("Error during financial analysis:", error);
    let detailedMessage = "An unexpected error occurred while communicating with the AI model.";
    if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.includes('403')) {
            detailedMessage = "The API Key is invalid or has insufficient permissions. Please verify your API key configuration.";
        } else if (error.message.includes('400')) {
             detailedMessage = "The request to the AI model was malformed. This could be a temporary issue or a problem with the query. Please try again.";
        } else if (error.message.includes('500') || error.message.includes('503')) {
            detailedMessage = "The AI model service is currently unavailable. Please try again later.";
        } else {
            detailedMessage = error.message;
        }
    }
    
    throw new Error(`${detailedMessage}`);
  }
}