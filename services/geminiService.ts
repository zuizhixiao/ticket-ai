
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedTicketInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a movie poster image to extract or generate ticket details.
 * @param base64Image The base64 encoded image string (without data:image/... prefix)
 * @param mimeType The mime type of the image
 */
export const analyzePoster = async (
  base64Image: string,
  mimeType: string
): Promise<GeneratedTicketInfo> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this movie poster to generate realistic movie ticket details for a Chinese audience.
            
            1. Extract the Movie Title.
            2. Suggest a Cinema Name (in Chinese).
            3. Suggest a realistic Address (in Chinese).
            4. Pick a random future Date (YYYY-MM-DD).
            5. Pick a random Time (HH:MM).
            6. Suggest a Hall number (e.g., 5号厅).
            7. Suggest a Hall Type (e.g., IMAX, Dolby, 2D, 3D).
            8. Suggest a Language (e.g., 国语, 英语).
            9. Suggest a Seat number (e.g., 8排12座).
            10. Suggest a Price (e.g., ¥55.9).
            11. Suggest a Theme Color (Hex Code).
            
            Return in JSON format.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            cinemaName: { type: Type.STRING },
            address: { type: Type.STRING },
            date: { type: Type.STRING },
            time: { type: Type.STRING },
            hall: { type: Type.STRING },
            hallType: { type: Type.STRING },
            language: { type: Type.STRING },
            seat: { type: Type.STRING },
            price: { type: Type.STRING },
            themeColor: { type: Type.STRING },
          },
          required: ["title", "cinemaName"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedTicketInfo;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      title: "未知电影",
    };
  }
};
