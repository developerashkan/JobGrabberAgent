
import { GoogleGenAI, Type } from "@google/genai";
import { JobListing, SearchParams } from "../types";

export class JobSearchService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async searchJobs(params: SearchParams): Promise<{ jobs: JobListing[], sources: any[] }> {
    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - params.daysBack * 86400000).toISOString().split('T')[0];
    
    // Enhanced prompt with strict verification instructions
    const prompt = `
      ACT AS A REAL-TIME JOB VERIFICATION ENGINE.
      Your goal is to find LIVE, ACTIVE job postings for:
      Title: "${params.jobTitle}"
      Location: "${params.location}"
      Published between: ${startDate} and ${today} (Last ${params.daysBack} days).

      STRICT QUALITY RULES:
      1. ONLY include jobs that are currently active. Look for snippets saying "Just posted", "1 day ago", or "Active".
      2. PREFER direct company career pages (e.g., jobs.lever.co, greenhouse.io, or company.com/careers).
      3. AVOID "dead" or "cached" aggregator links that often result in 404s. 
      4. DO NOT include listings where the snippet indicates the job is "Closed" or "No longer accepting applications".
      5. ENSURE the URL is a direct link to the job description or application form, not a general search page.
      6. VERIFY that the location in the snippet matches "${params.location}".

      For each validated job, return:
      - title: Full job title
      - company: Company name
      - location: Specific city/region
      - publishDate: Relative date found (e.g., "2 days ago") or specific date
      - url: The verified direct application URL
      - snippet: A 2-sentence summary of the role and requirements
      - source: The platform name (e.g., "LinkedIn", "Greenhouse")
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              jobs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    publishDate: { type: Type.STRING },
                    url: { type: Type.STRING },
                    snippet: { type: Type.STRING },
                    source: { type: Type.STRING },
                  },
                  required: ["title", "company", "location", "publishDate", "url"],
                },
              },
            },
          },
        },
      });

      const data = JSON.parse(response.text || '{"jobs": []}');
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      return {
        jobs: data.jobs || [],
        sources: sources
      };
    } catch (error) {
      console.error("Gemini Search Error:", error);
      throw error;
    }
  }
}
