import { useState, useEffect } from 'react';
import { Calendar, Plus, ChevronRight, Clock } from 'lucide-react';
import { MOCK_PROJECTS } from '../data/mockData';
import { PulseBadge } from '../components/PulseBadge';
import { ProjectDetailsModal } from '../components/ProjectDetailsModal';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { format, parseISO } from 'date-fns';
import { cn } from '../utils/cn';

export default function DirectorDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    // Sort projects by deadline ascending
    const sorted = [...MOCK_PROJECTS].sort((a, b) => 
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
    setProjects(sorted);
  }, []);

  const handleCreateProject = (newProject: any) => {
    setProjects(prev => [...prev, newProject].sort((a, b) => 
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    ));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#16191f]">Global Timeline</h1>
          <p className="mt-1 text-sm text-[#545b64]">
            Track all active initiatives, their deadlines, and current health status.
          </p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-[#0972d3] hover:bg-[#005299] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0972d3] transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </button>
      </div>

      <div className="relative border-l-2 border-[#eaeded] ml-4 md:ml-6 space-y-8 pb-8">
        {projects.map((project, index) => {
          const isPastDue = new Date(project.deadline) < new Date();
          
          return (
            <div key={project.id} className="relative pl-8 md:pl-12">
              {/* Timeline dot */}
              <div className={cn(
                "absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                isPastDue ? "bg-[#d13212]" : "bg-[#0972d3]"
              )} />
              
              <div className="bg-white p-5 rounded-sm shadow-sm border border-[#eaeded] hover:shadow-md hover:border-[#0972d3] transition-all group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-[#16191f]">{project.name}</h3>
                      <PulseBadge status={project.pulseStatus} />
                    </div>
                    <p className="text-sm text-[#545b64] mb-4">{project.goal}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-[#545b64]">
                        <Calendar className="w-4 h-4 mr-1.5 text-[#879596]" />
                        <span className={cn("font-medium", isPastDue && "text-[#d13212]")}>
                          Due: {format(parseISO(project.deadline), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center text-[#545b64]">
                        <Clock className="w-4 h-4 mr-1.5 text-[#879596]" />
                        <span>Status: {project.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center px-3 py-1.5 border border-[#879596] text-sm font-medium rounded-sm text-[#16191f] bg-white hover:bg-[#f2f3f3] transition-colors"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1 text-[#545b64]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProject && (
        <ProjectDetailsModal 
          isOpen={!!selectedProject} 
          onClose={() => setSelectedProject(null)} 
          project={selectedProject} 
        />
      )}

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={handleCreateProject} 
      />
    </div>
  );
}
