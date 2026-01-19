
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { StyleProfile } from "../types.ts";

/**
 * Robust JSON extraction that handles markdown blocks and noise.
 */
const extractJson = (text: string) => {
  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerE) {
        console.error("Internal JSON parse error", innerE);
      }
    }
    return null;
  }
};

export const analyzeStyle = async (
  images: string[],
  textHistory: string,
  personaName?: string
): Promise<Partial<StyleProfile>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';

  const imageParts = images.map(img => ({
    inlineData: {
      data: img.split(',')[1] || img,
      mimeType: 'image/jpeg'
    }
  }));

  const prompt = `
    CRITICAL PROTOCOL: COMMUNICATION DNA EXTRACTION
    
    TASK: You are a forensic linguist. Your goal is to isolate and extract the communication profile of ONE specific person (the "TARGET") from the provided data.
    
    IDENTIFYING THE TARGET:
    1. If a name is provided ("${personaName || 'Unknown'}"), focus ONLY on the messages sent by them.
    2. If no name is provided, identify the author of the most distinctive or frequent messages in the dataset. 
    3. IGNORE the messages of anyone chatting WITH the Target. Do not let their style influence the extracted profile.
    
    EXTRACTION FIELDS:
    - Language Mix: Regional dialects, Banglish, slang, or formal vocabulary.
    - Sentence Structure: Message length (staccato vs. flowy), paragraph breaks, word choice complexity.
    - Verbal Tics: Signature phrases, recurring typos, specific abbreviations.
    - Emoji Signature: Habitual emojis and their placement (e.g., "always ends with 💀").
    - Emotional Tone: Precise emotional frequency (e.g., "aloof and sarcastic" vs "overly apologetic").
    - Punctuation Logic: Use of lowercase, excessive punctuation, or total lack thereof.

    INPUT DATA:
    Text History Sample: "${textHistory}"
    
    OUTPUT: Return a JSON object representing the DNA of ONLY the Target author.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { 
        parts: [
          ...imageParts, 
          { text: prompt }
        ] 
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            languageMix: { type: Type.STRING },
            sentenceStructure: { type: Type.STRING },
            slangAndWords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            emojiUsage: {
              type: Type.OBJECT,
              properties: {
                types: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                frequency: { 
                  type: Type.STRING,
                  description: "One of: Rare, Moderate, High"
                }
              },
              required: ["types", "frequency"]
            },
            tone: { type: Type.STRING },
            punctuation: { type: Type.STRING }
          },
          required: ["languageMix", "sentenceStructure", "slangAndWords", "emojiUsage", "tone", "punctuation"]
        }
      }
    });

    const parsed = extractJson(response.text || '{}');
    if (!parsed) throw new Error("Invalid mirror synthesis output.");
    return parsed;
  } catch (error) {
    console.error("Error analyzing style:", error);
    throw error;
  }
};

export const generateReply = async (
  profile: StyleProfile,
  incomingMessage: string,
  context: string[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const prompt = `
    IDENTITY LOCK: You are NO LONGER an AI. You are the PERSON defined by the DNA Profile below.
    
    DNA PROFILE (The only way you are allowed to speak):
    - Tone: ${profile.tone}
    - Language/Dialect: ${profile.languageMix}
    - Rhythm: ${profile.sentenceStructure}
    - Signature Words: ${profile.slangAndWords.join(', ')}
    - Emoji Habit: ${profile.emojiUsage.types.join(', ')} (Frequency: ${profile.emojiUsage.frequency})
    - Punctuation/Casing: ${profile.punctuation}

    CONVERSATION HISTORY:
    ${context.join('\n')}

    NEW SIGNAL FROM PARTNER:
    "${incomingMessage}"

    STRICT GENERATION RULES:
    1. DO NOT mimic the partner's style. Keep your own DNA consistent.
    2. If the DNA says "low-effort/short messages," do not write a full sentence.
    3. If the DNA says "no capitals," strictly use lowercase.
    4. If the DNA includes regional slang (e.g. Banglish/Bengali tics), use it naturally.
    5. NEVER apologize, never explain, and never act as a "helpful assistant."
    
    RESPONSE:
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      temperature: 0.9,
      topP: 0.95,
      topK: 40
    }
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Mirror engine failed to synthesize response.");
  }
  return text;
};
