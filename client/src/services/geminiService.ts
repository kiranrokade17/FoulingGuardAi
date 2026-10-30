import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchService } from './searchService';

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ReportContext {
  reportId: string;
  vessel: string;
  species: string;
  coverage: string;
  criticality: string;
  fuelPenalty: string;
  method: string;
  urgency: string;
  note: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private maxContextLength = 4000;
  private maxHistoryMessages = 10;

  constructor() {
    this.initializeAPI();
  }

  private initializeAPI() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
    if (apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      } catch (error) {
        console.error('Failed to initialize Gemini API:', error);
      }
    }
  }

  setApiKey(apiKey: string): boolean {
    try {
      localStorage.setItem('gemini_api_key', apiKey);
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      return true;
    } catch (error) {
      console.error('Invalid API key:', error);
      return false;
    }
  }

  getApiKey(): string | null {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
  }

  removeApiKey() {
    localStorage.removeItem('gemini_api_key');
    this.genAI = null;
    this.model = null;
  }

  isConfigured(): boolean {
    return this.model !== null;
  }

  private buildContextPrompt(reportContext?: ReportContext): string {
    if (!reportContext) {
      return `You are FoulingGuard AI, a friendly marine biofouling expert assistant. Help users with:
- Hull fouling analysis and detection
- Species identification and characteristics
- Cleaning methods and recommendations
- Prevention strategies
- Environmental impact assessment

RESPONSE STYLE:
- Respond naturally to greetings ("hey", "hello", "hi") with brief, friendly replies
- Match the user's tone and question complexity
- Keep casual responses short, technical responses detailed
- Be conversational and helpful

Focus on marine biofouling topics but respond appropriately to the user's communication style.`;
    }

    return `You are FoulingGuard AI, a marine biofouling expert analyzing Report ${reportContext.reportId} for vessel ${reportContext.vessel}.

REPORT DATA:
- Vessel: ${reportContext.vessel}
- Species: ${reportContext.species}
- Coverage: ${reportContext.coverage}%
- Criticality: ${reportContext.criticality}
- Fuel Penalty: ${reportContext.fuelPenalty}%
- Recommended Method: ${reportContext.method}
- Urgency: ${reportContext.urgency}
- Notes: ${reportContext.note}

RESPONSE GUIDELINES:
1. Respond naturally to greetings ("hey", "hello", "hi") with brief, friendly replies
2. For casual questions, give conversational responses
3. For technical questions, provide detailed analysis using report data
4. Match the user's tone - casual for casual, technical for technical
5. Don't always give full report analysis unless specifically asked

Be conversational and helpful, adapting your response length to the user's question.`;
  }

  private trimContext(messages: ChatMessage[]): ChatMessage[] {
    const recentMessages = messages.slice(-this.maxHistoryMessages);
    
    let totalLength = 0;
    const trimmedMessages: ChatMessage[] = [];
    
    for (let i = recentMessages.length - 1; i >= 0; i--) {
      const messageLength = recentMessages[i].text.length;
      if (totalLength + messageLength > this.maxContextLength) {
        break;
      }
      trimmedMessages.unshift(recentMessages[i]);
      totalLength += messageLength;
    }
    
    return trimmedMessages;
  }

  async generateResponse(
    userMessage: string,
    chatHistory: ChatMessage[] = [],
    reportContext?: ReportContext,
    useWebSearch: boolean = false
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API not configured. Please set your API key.');
    }

    try {
      const systemPrompt = this.buildContextPrompt(reportContext);
      const trimmedHistory = this.trimContext(chatHistory);
      
      let conversationContext = systemPrompt + '\n\nCONVERSATION HISTORY:\n';
      
      trimmedHistory.forEach(msg => {
        conversationContext += `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}\n`;
      });
      
      // Add web search results ONLY if explicitly enabled
      let searchResults = '';
      if (useWebSearch && reportContext) {
        searchResults = await searchService.searchReportContext(reportContext, userMessage);
      }
      
      conversationContext += `${searchResults}\nUser: ${userMessage}\nAssistant:`;

      const result = await this.model.generateContent(conversationContext);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      if (error.message?.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        throw new Error('API quota exceeded. Please check your Gemini API usage.');
      } else {
        throw new Error('Failed to generate response. Please try again.');
      }
    }
  }
}

export const geminiService = new GeminiService();