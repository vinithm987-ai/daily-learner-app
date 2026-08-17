/**
 * LUMINA AI - Google Gemini API Handler
 * Connects directly to Google Generative Language API
 */

class GeminiService {
  constructor() {
    this.apiKey = localStorage.getItem('lumina_gemini_key') || '';
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('lumina_gemini_key', key);
  }

  getApiKey() {
    return this.apiKey;
  }

  hasValidKey() {
    return this.apiKey && this.apiKey.trim().length > 10;
  }

  async generateVocabularyWord() {
    if (!this.hasValidKey()) {
      throw new Error("No Gemini API key supplied. Please click the API key button to configure.");
    }

    const endpoint = `[generativelanguage.googleapis.com](https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey})`;

    const prompt = `Generate 1 advanced or useful English vocabulary word in raw JSON format with no markdown formatting. The JSON object must have exact keys:
    {
      "word": "word name",
      "pronunciation": "/phonetic/",
      "meaning": "clear definition",
      "example": "an exemplary contextual sentence",
      "synonyms": ["syn1", "syn2", "syn3"]
    }`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    
    // Clean codeblock markers if present
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  }

  async analyzeSpeakingAttempt(targetSentence, userSpokenText) {
    if (!this.hasValidKey()) {
      // Fallback feedback score calculation
      const accuracy = this.calculateSimilarity(targetSentence.toLowerCase(), userSpokenText.toLowerCase());
      return {
        score: Math.round(accuracy * 100),
        feedback: accuracy > 0.8 ? "Excellent pronunciation and accuracy!" : "Good attempt, practice enunciating each syllable clearly."
      };
    }

    const endpoint = `[generativelanguage.googleapis.com](https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey})`;
    const prompt = `Target Sentence: "${targetSentence}"\nUser Spoke: "${userSpokenText}"\nProvide a pronunciation feedback assessment in JSON: {"score": number (0-100), "feedback": "constructive tip"}. Return raw JSON only.`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(rawText);
    } catch (e) {
      return { score: 75, feedback: "Attempt recorded successfully!" };
    }
  }

  calculateSimilarity(str1, str2) {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    let matches = 0;
    words1.forEach(w => { if (words2.includes(w)) matches++; });
    return matches / Math.max(words1.length, 1);
  }
}
