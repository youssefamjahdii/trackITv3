import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { PulseBadge } from '../components/PulseBadge';
import { format } from 'date-fns';
import { Send, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

const client = generateClient<Schema>();

// Mock Data for Preview Environment
const MOCK_MY_PROJECTS = [
  {
    id: '1',
    name: 'Project Alpha: Cloud Migration',
    goal: 'Migrate all legacy on-premise databases to AWS Aurora by Q3.',
    deadline: '2026-09-30',
    pulseStatus: 'HEALTHY' as const,
    weeklyReports: [
      {
        id: 'r1',
        weekNumber: 12,
        timestamp: new Date().toISOString(),
        managerNotes: 'Successfully completed the schema conversion for the HR database. Testing phase begins next week.',
      }
    ]
  }
];

export default function ManagerDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // In a real Amplify app, observeQuery automatically filters based on the user's ownerId
    // const sub = client.models.Project.observeQuery().subscribe({
    //   next: ({ items }) => setProjects(items)
    // });
    // return () => sub.unsubscribe();

    // Using mock data for the preview
    setProjects(MOCK_MY_PROJECTS);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !notes.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // In a real Amplify app:
      // await client.models.WeeklyReport.create({
      //   projectId: selectedProject.id,
      //   managerNotes: notes,
      //   weekNumber: 13, // Calculate current week
      //   timestamp: new Date().toISOString()
      // });

      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setNotes('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Weekly Check-in</h1>
        <p className="mt-1 text-sm text-slate-500">
          Submit your weekly progress report. The AI Auditor will review this against your project goals.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <label htmlFor="project-select" className="block text-sm font-medium text-slate-700 mb-2">
            Select Active Project
          </label>
          <select
            id="project-select"
            className="block w-full rounded-lg border-slate-300 py-3 pl-4 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white shadow-sm"
            value={selectedProject?.id || ''}
            onChange={(e) => {
              const proj = projects.find(p => p.id === e.target.value);
              setSelectedProject(proj || null);
            }}
          >
            <option value="" disabled>-- Choose a project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {selectedProject && (
            <div className="mt-4 flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project Goal</span>
                <p className="text-sm text-slate-900">{selectedProject.goal}</p>
              </div>
              <PulseBadge status={selectedProject.pulseStatus} className="ml-4 flex-shrink-0" />
            </div>
          )}
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-slate-400" />
                What did you accomplish this week?
              </label>
              <textarea
                id="notes"
                rows={6}
                className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 resize-none transition-colors"
                placeholder="Be specific. Focus on facts, completed milestones, and blockers..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!selectedProject || isSubmitting}
              />
              <p className="mt-2 text-xs text-slate-500 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Keep it objective. The AI Auditor will grade this against the project goal.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-sm">
                {submitSuccess && (
                  <span className="flex items-center text-emerald-600 font-medium animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Report submitted successfully
                  </span>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!selectedProject || !notes.trim() || isSubmitting}
                className={cn(
                  "inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white transition-all duration-200",
                  !selectedProject || !notes.trim() || isSubmitting
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
