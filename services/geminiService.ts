
import { GoogleGenAI, Type } from "@google/genai";
import { BrandProfile, ModuleId, LayoutStyle, DesignStyle, CopywritingResponse, CampaignStrategy, AspectRatio } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// 1. Brand DNA Analysis
export const analyzeBrandDNA = async (logoBase64: string): Promise<Partial<BrandProfile>> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found. Returning mock data.");
    return new Promise(resolve => setTimeout(() => resolve({
      colors: { primary: '#4f46e5', secondary: '#1e1b4b', accent: '#ccff00' },
      vibe: "Prestigious, Innovative, Tech-Forward",
      fontPairing: "Montserrat & Merriweather"
    }), 2000));
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "image/png", data: logoBase64 } },
            { text: "Analyze this logo. Extract the 3 dominant hex colors. Describe the vibe in 3 adjectives. Suggest a Google Font pairing." }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colors: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING },
                secondary: { type: Type.STRING },
                accent: { type: Type.STRING },
              }
            },
            vibe: { type: Type.STRING },
            fontPairing: { type: Type.STRING },
          }
        }
      }
    });

    const jsonText = response.text;
    return jsonText ? JSON.parse(jsonText) : {};
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

// 2. Smart Source Analysis (Critique uploaded photo)
export const analyzeImageQuality = async (imageBase64: string): Promise<string[]> => {
  if (!process.env.API_KEY) return ["Lighting: Good", "Subject: Clear"];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
            { text: "Critique this image for a school marketing post. List 3 key issues or positive traits (e.g. 'Low Lighting', 'Cluttered Background'). Return as a simple JSON array of strings." }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (e) {
    return ["Analysis Unavailable"];
  }
};

// 3. Campaign Strategy (The "Agent Brain")
export const generateCampaignStrategy = async (
  topic: string, 
  brandName: string,
  designStyle: DesignStyle,
  imageAnalysis: string[] = []
): Promise<CampaignStrategy> => {
    if (!process.env.API_KEY) {
        return {
            headline: "Future Leaders",
            subhead: "Join us for an amazing experience.",
            cta: "Learn More",
            caption: "Big things are happening! #School",
            artDirection: "A nice background."
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                role: 'user',
                parts: [{ text: `
                    Act as a Creative Director for a school named "${brandName}".
                    Task: Create a campaign strategy based on this topic: "${topic}".
                    Design Template: "${designStyle}".
                    Image Context: ${imageAnalysis.join(', ')}.

                    Return a JSON object with:
                    1. 'headline': Catchy, short (max 5 words).
                    2. 'subhead': Informative, persuading (max 12 words).
                    3. 'cta': Action-oriented (max 3 words).
                    4. 'caption': A full social media caption with emojis and hashtags.
                    5. 'artDirection': A detailed prompt for the AI image generator.
                       - 'swiss': Ask for clean geometric composition, high contrast, asymmetry, grid-based layout.
                       - 'bold-school': Ask for vibrant pop-art style, high energy, brutalist elements, flat lighting.
                       - 'soft-modern': Ask for bright, airy, pastel tones, soft gradients, rounded shapes, glassmorphism feel.
                       - 'tech-future': Ask for dark mode, neon accents, cyber-grid overlays, futuristic lighting.
                       - CRITICAL: The image generator will receive a source image. Tell it to PRESERVE the subject but enhance the environment style.
                `}]
            }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING },
                        subhead: { type: Type.STRING },
                        cta: { type: Type.STRING },
                        caption: { type: Type.STRING },
                        artDirection: { type: Type.STRING }
                    }
                }
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (e) {
        console.error("Strategy generation failed", e);
        return {
            headline: "Update",
            subhead: topic,
            cta: "Check it out",
            caption: `${topic} - Check it out!`,
            artDirection: "clean background"
        };
    }
}

// 4. Asset Generation (Transforming Source Image)
export const generateMarketingAsset = async (
  sourceImageBase64: string | null, 
  brand: BrandProfile, 
  artDirection: string,
  aspectRatio: AspectRatio = '1:1'
): Promise<string> => {
  if (!process.env.API_KEY) {
    return new Promise(resolve => setTimeout(() => resolve("https://picsum.photos/seed/" + Math.random() + "/800/800"), 3000));
  }

  try {
    let promptText = `
      Act as a professional photo editor and designer.
      Brand Name: ${brand.name}.
      Brand Colors to hint at: ${brand.colors.primary}, ${brand.colors.accent}.
      Art Direction: ${artDirection}.
      Requirements: High quality, photorealistic or high-end style transfer.
      CRITICAL: Leave negative space for text overlays.
    `;
    
    // Explicit instructions for image transformation
    if (sourceImageBase64) {
        promptText += `
        TRANSFORMATION TASK:
        1. Use the provided Source Image as the absolute reference for the subject.
        2. Do NOT replace the people/subject. Keep them recognizable.
        3. Enhance the lighting, remove clutter from the background, and apply the artistic style described in 'Art Direction'.
        4. Integrate brand color accents subtly into the environment.
        `;
    } else {
        promptText += `Generate a high-quality stock image representing the topic.`;
    }

    const parts: any[] = [{ text: promptText }];
    
    if (sourceImageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: sourceImageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: { parts },
      config: {
          imageConfig: {
              aspectRatio: aspectRatio 
          }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated");

  } catch (e) {
    console.error("Generation Failed", e);
    return "https://picsum.photos/800/800?error=true";
  }
};
