import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message requis' });
  }

  try {
    const formattedContents = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        formattedContents.push({
          role: item.role === 'model' ? 'model' : 'user',
          parts: [{ text: item.text }],
        });
      }
    }
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: "Tu es l'Assistant RH du SIRH Entreprise...",
      },
    });

    return res.status(200).json({ reply: response.text });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}