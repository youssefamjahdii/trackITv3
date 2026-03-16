import { useState } from 'react';
import { X, Users, CheckCircle2, Circle, DollarSign, BrainCircuit, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { GoogleGenAI } from '@google/genai';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

export function ProjectDetailsModal({ isOpen, onClose, project }: ProjectDetailsModalProps) {
  const [aiAudit, setAiAudit] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  if (!isOpen || !project) return null;

  const utilization = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
  const isOverBudget = utilization > 90;

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAiAudit(null);

    try {
      // Initialize Gemini API
      // Note: In a real app, you should proxy this through your backend to keep the API key secure.
      // For this preview, we are using the environment variable directly.
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

      const prompt = `
        You are an expert Project Management AI Auditor. Analyze the following project and provide a concise, strategic audit.
        Focus on financial health, task progress, and potential risks.

        Project Name: ${project.name}
        Description: ${project.description}
        Goal: ${project.goal}
        Status: ${project.status}
        Budget: $${project.budget}
        Spent: $${project.spent} (${utilization.toFixed(1)}% utilized)
        
        Active Tasks:
        ${project.tasks.map((t: any) => `- ${t.name} (${t.completed ? 'Completed' : 'Pending'}) assigned to ${t.assignee}`).join('\n')}

        Provide your response in 3 short paragraphs:
        1. Financial Health
        2. Execution & Velocity
        3. Strategic Recommendations
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      setAiAudit(response.text || 'No audit generated.');
    } catch (error) {
      console.error('AI Audit failed:', error);
      setAiAudit('Failed to generate AI audit. Please check your API key configuration or try again later.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16191f]/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-sm shadow-md w-full max-w-3xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-6 border-b border-[#eaeded]">
          <div>
            <h2 className="text-xl font-bold text-[#16191f]">{project.name}</h2>
            <p className="text-sm text-[#545b64] mt-1">{project.goal}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#545b64] hover:text-[#16191f] transition-colors rounded-sm p-1 hover:bg-[#f2f3f3] flex-shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          
          {/* Financial Status Block */}
          <section>
            <h3 className="text-sm font-semibold text-[#16191f] uppercase tracking-wider mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-[#545b64]" />
              Financial Status
            </h3>
            <div className="bg-[#f2f3f3] rounded-sm p-5 border border-[#eaeded]">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-sm text-[#545b64] font-medium">Utilized Capital</p>
                  <p className="text-2xl font-bold text-[#16191f]">${project.spent.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#545b64] font-medium">Total Budget</p>
                  <p className="text-lg font-semibold text-[#16191f]">${project.budget.toLocaleString()}</p>
                </div>
              </div>
              <div className="w-full bg-[#eaeded] rounded-sm h-2.5 overflow-hidden mt-4">
                <div 
                  className={cn("h-2.5 rounded-sm transition-all duration-500", isOverBudget ? "bg-[#d13212]" : "bg-[#0972d3]")}
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </div>
              <p className={cn("text-xs mt-2 font-medium", isOverBudget ? "text-[#d13212]" : "text-[#545b64]")}>
                {utilization.toFixed(1)}% of budget utilized
                {isOverBudget && " (Warning: Exceeds 90% threshold)"}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Observers */}
            <section>
              <h3 className="text-sm font-semibold text-[#16191f] uppercase tracking-wider mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2 text-[#545b64]" />
                Active Observers
              </h3>
              <ul className="space-y-2">
                {project.observers?.map((observer: string, idx: number) => (
                  <li key={idx} className="flex items-center text-sm text-[#16191f] bg-white border border-[#eaeded] rounded-sm p-3 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-[#f2f8fd] text-[#0972d3] flex items-center justify-center text-xs font-bold mr-3">
                      {observer.charAt(0)}
                    </div>
                    {observer}
                  </li>
                ))}
                {(!project.observers || project.observers.length === 0) && (
                  <li className="text-sm text-[#545b64] italic">No active observers.</li>
                )}
              </ul>
            </section>

            {/* Tasks & Milestones */}
            <section>
              <h3 className="text-sm font-semibold text-[#16191f] uppercase tracking-wider mb-3 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-[#545b64]" />
                Tasks & Milestones
              </h3>
              <ul className="space-y-3">
                {project.tasks?.map((task: any) => (
                  <li key={task.id} className="flex items-start">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#1d8102] mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#879596] mr-3 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={cn("text-sm font-medium", task.completed ? "text-[#545b64] line-through" : "text-[#16191f]")}>
                        {task.name}
                      </p>
                      <p className="text-xs text-[#545b64] mt-0.5">Assigned to: {task.assignee}</p>
                    </div>
                  </li>
                ))}
                {(!project.tasks || project.tasks.length === 0) && (
                  <li className="text-sm text-[#545b64] italic">No tasks defined.</li>
                )}
              </ul>
            </section>
          </div>

          {/* Strategy AI Integration */}
          <section className="border-t border-[#eaeded] pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#16191f] uppercase tracking-wider flex items-center">
                <BrainCircuit className="w-4 h-4 mr-2 text-[#0972d3]" />
                Strategy AI Audit
              </h3>
              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[#0972d3] bg-[#f2f8fd] border border-[#0972d3] rounded-sm hover:bg-[#e9f2fa] transition-colors disabled:opacity-50"
              >
                {isAuditing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5 mr-1.5" />}
                {aiAudit ? 'Re-run Audit' : 'Trigger Analysis'}
              </button>
            </div>

            {aiAudit && (
              <div className="bg-[#f2f8fd] border border-[#0972d3] rounded-sm p-5 text-sm text-[#16191f] whitespace-pre-wrap leading-relaxed">
                {aiAudit}
              </div>
            )}
            {!aiAudit && !isAuditing && (
              <div className="bg-[#f2f3f3] border border-[#eaeded] border-dashed rounded-sm p-6 text-center">
                <p className="text-sm text-[#545b64]">Run a Strategy AI audit to get real-time insights on project health, velocity, and risks.</p>
              </div>
            )}
            {isAuditing && (
              <div className="bg-[#f2f8fd] border border-[#0972d3] rounded-sm p-6 text-center flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#0972d3] animate-spin mb-2" />
                <p className="text-sm text-[#0972d3] font-medium">Analyzing project data with Gemini...</p>
              </div>
            )}
          </section>

        </div>
        
        <div className="sticky bottom-0 z-10 p-6 border-t border-[#eaeded] bg-[#f2f3f3] flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-[#16191f] bg-white border border-[#879596] rounded-sm hover:bg-[#f2f3f3] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
