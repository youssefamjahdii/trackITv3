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
  const [risks, setRisks] = useState('');
  const [status, setStatus] = useState('HEALTHY');
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
      setRisks('');
      setStatus('HEALTHY');
      
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
        <h1 className="text-2xl font-bold text-[#16191f]">Weekly Check-in</h1>
        <p className="mt-1 text-sm text-[#545b64]">
          Submit your weekly progress report. The AI Auditor will review this against your project goals.
        </p>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-[#eaeded] overflow-hidden">
        <div className="p-6 border-b border-[#eaeded] bg-[#f2f3f3]">
          <label htmlFor="project-select" className="block text-sm font-medium text-[#16191f] mb-2">
            Select Active Project
          </label>
          <select
            id="project-select"
            className="block w-full rounded-sm border-[#879596] py-3 pl-4 pr-10 text-base focus:border-[#0972d3] focus:outline-none focus:ring-[#0972d3] sm:text-sm bg-white shadow-sm"
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
            <div className="mt-4 flex items-center justify-between p-4 bg-white rounded-sm border border-[#eaeded]">
              <div>
                <span className="text-xs font-semibold text-[#545b64] uppercase tracking-wider block mb-1">Project Goal</span>
                <p className="text-sm text-[#16191f]">{selectedProject.goal}</p>
              </div>
              <PulseBadge status={selectedProject.pulseStatus} className="ml-4 flex-shrink-0" />
            </div>
          )}
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-[#16191f] mb-2">
                  Current Project Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={!selectedProject || isSubmitting}
                  className="block w-full rounded-sm border-[#879596] py-2.5 pl-3 pr-10 text-base focus:border-[#0972d3] focus:outline-none focus:ring-[#0972d3] sm:text-sm bg-white shadow-sm"
                >
                  <option value="HEALTHY">Healthy / On Track</option>
                  <option value="AT_RISK">At Risk</option>
                  <option value="CRITICAL">Critical / Off Track</option>
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-[#16191f] mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-[#545b64]" />
                  What did you accomplish this week?
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  className="block w-full rounded-sm border-[#879596] shadow-sm focus:border-[#0972d3] focus:ring-[#0972d3] sm:text-sm p-3 resize-none transition-colors"
                  placeholder="Be specific. Focus on facts and completed milestones..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={!selectedProject || isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="risks" className="block text-sm font-medium text-[#16191f] mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-[#545b64]" />
                  Risks & Blockers
                </label>
                <textarea
                  id="risks"
                  rows={3}
                  className="block w-full rounded-sm border-[#879596] shadow-sm focus:border-[#0972d3] focus:ring-[#0972d3] sm:text-sm p-3 resize-none transition-colors"
                  placeholder="Identify any risks, blockers, or dependencies..."
                  value={risks}
                  onChange={(e) => setRisks(e.target.value)}
                  disabled={!selectedProject || isSubmitting}
                />
              </div>
            </div>

            <p className="mt-2 text-xs text-[#545b64] flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              Keep it objective. The AI Auditor will grade this against the project goal.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[#eaeded]">
              <div className="text-sm">
                {submitSuccess && (
                  <span className="flex items-center text-[#1d8102] font-medium animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Report submitted successfully
                  </span>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!selectedProject || !notes.trim() || isSubmitting}
                className={cn(
                  "inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white transition-all duration-200",
                  !selectedProject || !notes.trim() || isSubmitting
                    ? "bg-[#eaeded] text-[#545b64] cursor-not-allowed"
                    : "bg-[#0972d3] hover:bg-[#005299] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0972d3]"
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
