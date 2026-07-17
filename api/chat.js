import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { contents, config } = req.body;
    
    // Safety check: input validation
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: 'Invalid request payload. contents must be an array.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Serverless Vercel chat API called but GEMINI_API_KEY env is missing.');
      return res.status(200).json({ text: "Serverless Mode: GEMINI_API_KEY not configured in Vercel settings.", success: false });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: config || { temperature: 0.7, maxOutputTokens: 1024 }
    });

    const text = response.text();
    return res.status(200).json({ text, success: true });
  } catch (error) {
    console.error('Serverless GenAI API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
