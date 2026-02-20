import { GoogleGenerativeAI } from "@google/generative-ai";

function getGenAI() {
  const key = process.env.GOOGLE_GEMINI_API_KEY;
  if (!key?.trim()) {
    throw new Error("GOOGLE_GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenerativeAI(key);
}

export interface SummarizeResponse {
  summary: string;
}

export interface GrammarFixResponse {
  fixedContent: string;
  corrections: Array<{
    original: string;
    corrected: string;
    reason: string;
  }>;
}

export interface AutoTagResponse {
  tags: string[];
}

class AIService {
  private get model() {
    return getGenAI().getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        // Reduce chance of empty/blocked responses for note-taking
        temperature: 0.2,
      },
    });
  }

  /** Safely get text from Gemini response; throws if blocked or empty with a clear message */
  private getResponseText(response: { text(): string }): string {
    try {
      const text = response.text();
      if (typeof text !== "string" || !text.trim()) {
        throw new Error("Gemini returned no text (empty or blocked). Try different content.");
      }
      return text;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("valid `Part`") || message.includes("none were returned")) {
        throw new Error("Response was blocked by safety filters. Try rephrasing or shortening the content.");
      }
      throw err;
    }
  }

  /**
   * Summarize the given content
   */
  async summarize(content: string): Promise<SummarizeResponse> {
    const prompt = `You are a helpful AI assistant. Summarize the following note content in a concise manner (2-3 sentences maximum). Return ONLY a JSON object with this exact structure:
{
  "summary": "your summary here"
}

Content to summarize:
${content}`;

    let text: string;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      text = this.getResponseText(response);
    } catch (error) {
      console.error("Error calling Gemini (summarize):", error);
      throw error;
    }

    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      const parsed = JSON.parse(jsonText.trim()) as SummarizeResponse;
      
      return {
        summary: parsed.summary || "Unable to generate summary.",
      };
    } catch (error) {
      console.error("Error parsing summarize response:", error);
      return {
        summary: "Unable to generate summary.",
      };
    }
  }

  /**
   * Fix grammar and spelling errors in the content
   */
  async fixGrammar(content: string): Promise<GrammarFixResponse> {
    const prompt = `You are a grammar correction assistant. Fix all grammar, spelling, and punctuation errors in the following text. Return ONLY a JSON object with this exact structure:
{
  "fixedContent": "the corrected text",
  "corrections": [
    {
      "original": "incorrect text",
      "corrected": "corrected text",
      "reason": "brief explanation"
    }
  ]
}

Text to fix:
${content}`;

    let text: string;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      text = this.getResponseText(response);
    } catch (error) {
      console.error("Error calling Gemini (fixGrammar):", error);
      throw error;
    }

    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      const parsed = JSON.parse(jsonText.trim()) as GrammarFixResponse;
      
      return {
        fixedContent: parsed.fixedContent || content,
        corrections: parsed.corrections || [],
      };
    } catch (error) {
      console.error("Error parsing grammar fix response:", error);
      return {
        fixedContent: content,
        corrections: [],
      };
    }
  }

  /**
   * Automatically generate tags for the content
   */
  async autoTag(title: string, content: string): Promise<AutoTagResponse> {
    const prompt = `You are a content tagging assistant. Analyze the following note and generate 3-5 relevant tags. Tags should be:
- Single words or short phrases (max 2 words)
- Lowercase
- Relevant to the content
- Specific and meaningful

Return ONLY a JSON object with this exact structure:
{
  "tags": ["tag1", "tag2", "tag3"]
}

Note title: ${title}
Note content: ${content}`;

    let text: string;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      text = this.getResponseText(response);
    } catch (error) {
      console.error("Error calling Gemini (autoTag):", error);
      throw error;
    }

    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      const parsed = JSON.parse(jsonText.trim()) as AutoTagResponse;
      
      return {
        tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
      };
    } catch (error) {
      console.error("Error parsing auto-tag response:", error);
      return {
        tags: [],
      };
    }
  }
}

export const aiService = new AIService();
