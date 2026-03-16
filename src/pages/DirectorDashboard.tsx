import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { PulseBadge } from '../components/PulseBadge';
import { format } from 'date-fns';
import { ChevronRight, Calendar, Target, User, FileText, BrainCircuit, LayoutDashboard, Plus } from 'lucide-react';
import { cn } from '../utils/cn';
import { CreateProjectModal } from '../components/CreateProjectModal';

const client = generateClient<Schema>();

// Mock Data for Preview Environment
const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'Project Alpha: Cloud Migration',
    goal: 'Migrate all legacy on-premise databases to AWS Aurora by Q3.',
    deadline: '2026-09-30',
    budget: 150000,
    pulseStatus: 'HEALTHY' as const,
    ownerId: 'manager-1',
    weeklyReports: [
      {
        id: 'r1',
        weekNumber: 12,
        timestamp: new Date().toISOString(),
        managerNotes: 'Successfully completed the schema conversion for the HR database. Testing phase begins next week.',
        aiAuditSummary: 'Velocity: On track. Schema conversion completed as planned. Accuracy: High. Pulse: HEALTHY.',
      }
    ]
  },
  {
    id: '2',
    name: 'Project Beta: AI Customer Support',
    goal: 'Implement Bedrock-powered chatbot for tier 1 customer support tickets.',
    deadline: '2026-06-15',
    budget: 85000,
    pulseStatus: 'WARNING' as const,
    ownerId: 'manager-2',
    weeklyReports: [
      {
        id: 'r2',
        weekNumber: 12,
        timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
        managerNotes: 'Integration with Zendesk is delayed due to API rate limits. Working with support to increase quotas.',
        aiAuditSummary: 'Velocity: Delayed. Zendesk integration blocked by API limits. Accuracy: Moderate. Pulse: WARNING.',
      }
    ]
  },
  {
    id: '3',
    name: 'Project Gamma: Mobile App V2',
    goal: 'Launch the completely redesigned mobile app with new authentication flow.',
    deadline: '2026-04-01',
    budget: 200000,
    pulseStatus: 'CRITICAL' as const,
    ownerId: 'manager-3',
    weeklyReports: [
      {
        id: 'r3',
        weekNumber: 12,
        timestamp: new Date(Date.now() - 86400000 * 14).toISOString(),
        managerNotes: 'The new auth flow is failing security audits. We need to rewrite the token handling logic entirely. Launch will be delayed by at least 3 weeks.',
        aiAuditSummary: 'Velocity: Severely delayed. Security audit failure requires rewrite. Accuracy: Low. Pulse: CRITICAL.',
      }
    ]
  }
];

export default function DirectorDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    // In a real Amplify app, we would use observeQuery
    // const sub = client.models.Project.observeQuery().subscribe({
    //   next: ({ items }) => {
    //     setProjects(items);
    //     setIsLoading(false);
    //   }
    // });
    // return () => sub.unsubscribe();

    // Using mock data for the preview
    setTimeout(() => {
      setProjects(MOCK_PROJECTS);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Global Timeline</h1>
          <p className="mt-1 text-sm text-slate-500">
            High-level overview of all active projects and their AI-audited health status.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="lg:col-span-1 space-y-4">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-200",
                selectedProject?.id === project.id
                  ? "bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500"
                  : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-900 line-clamp-1">{project.name}</h3>
                <PulseBadge status={project.pulseStatus} className="ml-2 flex-shrink-0" />
              </div>
              <div className="flex items-center text-xs text-slate-500 mt-3">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                Due: {format(new Date(project.deadline), 'MMM d, yyyy')}
              </div>
            </button>
          ))}
        </div>

        {/* Project Details */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedProject.name}</h2>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-slate-500">
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-1.5 text-slate-400" />
                        Goal: {selectedProject.goal}
                      </span>
                    </div>
                  </div>
                  <PulseBadge status={selectedProject.pulseStatus} className="text-sm px-3 py-1" />
                </div>
              </div>

              <div className="p-6 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                  Weekly Reports & AI Audits
                </h3>
                
                <div className="space-y-6">
                  {selectedProject.weeklyReports.map((report: any) => (
                    <div key={report.id} className="relative pl-6 border-l-2 border-slate-200 last:border-transparent pb-6 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-indigo-500" />
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">Week {report.weekNumber}</span>
                        <span className="text-xs text-slate-500">{format(new Date(report.timestamp), 'MMM d, yyyy')}</span>
                      </div>

                      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-3 shadow-sm">
                        <div className="flex items-start mb-2">
                          <FileText className="w-4 h-4 text-slate-400 mr-2 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Manager Notes</span>
                            <p className="text-sm text-slate-700">{report.managerNotes}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-50 rounded-lg border border-indigo-100 p-4">
                        <div className="flex items-start">
                          <BrainCircuit className="w-4 h-4 text-indigo-500 mr-2 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">AI Auditor Summary</span>
                            <p className="text-sm text-indigo-900">{report.aiAuditSummary}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedProject.weeklyReports.length === 0 && (
                    <p className="text-sm text-slate-500 italic">No weekly reports submitted yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 border-dashed h-full min-h-[400px] flex flex-col items-center justify-center text-slate-500">
              <LayoutDashboard className="w-12 h-12 text-slate-300 mb-4" />
              <p>Select a project from the timeline to view details</p>
            </div>
          )}
        </div>
      </div>

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={(newProject) => {
          setProjects([newProject, ...projects]);
          setSelectedProject(newProject);
        }} 
      />
    </div>
  );
}
