import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: any) => void;
}

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real Amplify app, this creates the record in DynamoDB:
      // const { data: newProject } = await client.models.Project.create({
      //   name,
      //   goal,
      //   deadline,
      //   budget: budget ? parseFloat(budget) : undefined,
      //   pulseStatus: 'HEALTHY',
      //   ownerId,
      // });

      // Mock creation for preview environment
      await new Promise(resolve => setTimeout(resolve, 800));
      const newProject = {
        id: Math.random().toString(36).substring(7),
        name,
        goal,
        deadline,
        budget: budget ? parseFloat(budget) : undefined,
        pulseStatus: 'HEALTHY',
        ownerId,
        weeklyReports: []
      };

      onSuccess(newProject);
      
      // Reset form
      setName('');
      setGoal('');
      setDeadline('');
      setBudget('');
      setOwnerId('');
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Create New Project</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="create-project-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
              <input 
                required 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full rounded-lg border-slate-300 py-2.5 px-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all sm:text-sm" 
                placeholder="e.g. Project Delta" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Goal</label>
              <textarea 
                required 
                value={goal} 
                onChange={e => setGoal(e.target.value)} 
                rows={3} 
                className="w-full rounded-lg border-slate-300 py-2.5 px-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none sm:text-sm" 
                placeholder="What is the objective?" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                <input 
                  required 
                  type="date" 
                  value={deadline} 
                  onChange={e => setDeadline(e.target.value)} 
                  className="w-full rounded-lg border-slate-300 py-2.5 px-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all sm:text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Budget ($)</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={budget} 
                  onChange={e => setBudget(e.target.value)} 
                  className="w-full rounded-lg border-slate-300 py-2.5 px-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all sm:text-sm" 
                  placeholder="0.00" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Manager (Owner ID)</label>
              <input 
                required 
                type="text" 
                value={ownerId} 
                onChange={e => setOwnerId(e.target.value)} 
                className="w-full rounded-lg border-slate-300 py-2.5 px-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all sm:text-sm" 
                placeholder="e.g. manager-123" 
              />
              <p className="mt-1.5 text-xs text-slate-500">
                The Cognito sub or username of the manager who will submit weekly reports.
              </p>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="create-project-form" 
            disabled={isSubmitting} 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
