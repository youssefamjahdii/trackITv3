import { useState } from 'react';
import { BrainCircuit, Send, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { MOCK_PROJECTS } from '../data/mockData';
import { cn } from '../utils/cn';

export default function StrategyAI() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsAnalyzing(true);
    setResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

      // Build context from all projects
      const portfolioContext = MOCK_PROJECTS.map(p => 
        `Project: ${p.name}\nStatus: ${p.status}\nBudget: $${p.budget}\nSpent: $${p.spent}\nGoal: ${p.goal}`
      ).join('\n\n');

      const systemInstruction = `You are an elite Portfolio Strategy AI. You have access to the following portfolio data:\n\n${portfolioContext}\n\nAnswer the user's strategic questions based on this data. Be concise, analytical, and actionable.`;

      const result = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          systemInstruction,
        }
      });

      setResponse(result.text || 'No insights generated.');
    } catch (error) {
      console.error('Strategy AI failed:', error);
      setResponse('Failed to connect to Strategy AI. Please check your API key configuration.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <BrainCircuit className="w-7 h-7 mr-3 text-indigo-600" />
          Strategy AI
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ask questions about your entire portfolio. The AI analyzes all active projects, budgets, and statuses to provide strategic insights.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
        {/* Chat / Response Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
          {!response && !isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <Sparkles className="w-12 h-12 text-indigo-200" />
              <p className="text-sm">Try asking: "Which projects are at risk of going over budget?"</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-indigo-500 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Analyzing portfolio data...</p>
            </div>
          )}

          {response && !isAnalyzing && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center mb-4 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <BrainCircuit className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Strategic Analysis</h3>
              </div>
              <div className="prose prose-sm prose-indigo max-w-none text-slate-700 whitespace-pre-wrap">
                {response}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleAnalyze} className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a strategic question about your portfolio..."
              className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              disabled={isAnalyzing}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isAnalyzing}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
