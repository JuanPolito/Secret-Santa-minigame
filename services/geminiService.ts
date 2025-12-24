
import { GoogleGenAI, Type } from "@google/genai";

export const getFestiveMessage = async (recipientName: string): Promise<string> => {
  try {
    // Obtenemos la API_KEY de forma segura
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    
    if (!apiKey) {
      console.warn("API_KEY no encontrada. Usando mensaje por defecto.");
      return `¡Felicidades! Tu amigo invisible es ${recipientName}. ¡Que pases una excelente Navidad!`;
    }

    const ai = new GoogleGenAI({ apiKey });
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
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    if (!apiKey) throw new Error("No API Key");

    const ai = new GoogleGenAI({ apiKey });
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
