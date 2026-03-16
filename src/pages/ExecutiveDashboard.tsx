import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MOCK_PROJECTS } from '../data/mockData';
import { cn } from '../utils/cn';
import { ProjectDetailsModal } from '../components/ProjectDetailsModal';

const COLORS = {
  'Planning': '#545b64', // gray
  'Active': '#0972d3',   // blue
  'At Risk': '#d13212',  // red/orange
  'Completed': '#1d8102' // green
};

export default function ExecutiveDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    setProjects(MOCK_PROJECTS);
  }, []);

  // Prepare data for Bar Chart (Budget vs Spent)
  const financialData = projects.map(p => ({
    name: p.name.split(':')[0], // Short name
    Budget: p.budget,
    Spent: p.spent,
  }));

  // Prepare data for Pie Chart (Status Distribution)
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#16191f]">Executive Dashboard</h1>
        <p className="mt-1 text-sm text-[#545b64]">
          High-level overview of portfolio health, financial allocation, and project status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Allocation Chart */}
        <div className="bg-white p-5 rounded-sm shadow-sm border border-[#eaeded]">
          <h2 className="text-lg font-semibold text-[#16191f] mb-4">Financial Allocation</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#545b64', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#545b64', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend iconType="circle" />
                <Bar dataKey="Budget" fill="#cbd5e1" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Spent" fill="#0972d3" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Composition */}
        <div className="bg-white p-5 rounded-sm shadow-sm border border-[#eaeded]">
          <h2 className="text-lg font-semibold text-[#16191f] mb-4">Portfolio Composition</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div>
        <h2 className="text-lg font-semibold text-[#16191f] mb-4">Project Summaries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            const utilization = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
            const isOverBudget = utilization > 90;

            return (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="bg-white p-5 rounded-sm shadow-sm border border-[#eaeded] hover:shadow-md hover:border-[#0972d3] transition-all cursor-pointer flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-[#16191f] line-clamp-1" title={project.name}>{project.name}</h3>
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-sm whitespace-nowrap ml-2",
                    project.status === 'Planning' && "bg-[#f2f3f3] text-[#545b64]",
                    project.status === 'Active' && "bg-[#f2f8fd] text-[#0972d3]",
                    project.status === 'At Risk' && "bg-[#fdf3e1] text-[#d13212]",
                    project.status === 'Completed' && "bg-[#f2f8f2] text-[#1d8102]"
                  )}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-sm text-[#545b64] line-clamp-2 mb-4 flex-1">
                  {project.goal}
                </p>

                <div className="mt-auto">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#545b64] font-medium">Budget Utilization</span>
                    <span className={cn("font-bold", isOverBudget ? "text-[#d13212]" : "text-[#16191f]")}>
                      {utilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#eaeded] rounded-sm h-2 overflow-hidden">
                    <div 
                      className={cn("h-2 rounded-sm", isOverBudget ? "bg-[#d13212]" : "bg-[#0972d3]")}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2 text-[#545b64]">
                    <span>Spent: ${project.spent.toLocaleString()}</span>
                    <span>Budget: ${project.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedProject && (
        <ProjectDetailsModal 
          isOpen={!!selectedProject} 
          onClose={() => setSelectedProject(null)} 
          project={selectedProject} 
        />
      )}
    </div>
  );
}
