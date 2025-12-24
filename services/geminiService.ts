
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFestiveMessage = async (recipientName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Escribe un mensaje corto, festivo y emocionante en español (máximo 40 palabras) para revelar el Amigo Invisible. El nombre es: ${recipientName}. Usa un tono navideño y alegre.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });
    return response.text || `¡Felicidades! Tu amigo invisible es ${recipientName}. ¡Que pases una feliz navidad!`;
  } catch (error) {
    console.error("Error generating festive message:", error);
    return `¡Felicidades! Tu amigo invisible es ${recipientName}.`;
  }
};

export const getChristmasRiddle = async (): Promise<{ riddle: string, answer: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Genera una adivinanza navideña sencilla en español con una sola palabra de respuesta. Formato JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riddle: { type: Type.STRING },
            answer: { type: Type.STRING }
          },
          required: ["riddle", "answer"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    return { 
      riddle: "¿Quién tiene barbas blancas, viste de rojo y trae regalos?", 
      answer: "Papa Noel" 
    };
  }
};
