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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16191f]/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-sm shadow-md w-full max-w-lg overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-6 border-b border-[#eaeded]">
          <h2 className="text-xl font-bold text-[#16191f]">Create New Project</h2>
          <button 
            onClick={onClose} 
            className="text-[#545b64] hover:text-[#16191f] transition-colors rounded-sm p-1 hover:bg-[#f2f3f3]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <form id="create-project-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#16191f] mb-1">Project Name</label>
              <input 
                required 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full rounded-sm border-[#879596] py-2.5 px-3 border focus:ring-2 focus:ring-[#0972d3] focus:border-[#0972d3] outline-none transition-all sm:text-sm" 
                placeholder="e.g. Project Delta" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#16191f] mb-1">Goal</label>
              <textarea 
                required 
                value={goal} 
                onChange={e => setGoal(e.target.value)} 
                rows={3} 
                className="w-full rounded-sm border-[#879596] py-2.5 px-3 border focus:ring-2 focus:ring-[#0972d3] focus:border-[#0972d3] outline-none transition-all resize-none sm:text-sm" 
                placeholder="What is the objective?" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#16191f] mb-1">Deadline</label>
                <input 
                  required 
                  type="date" 
                  value={deadline} 
                  onChange={e => setDeadline(e.target.value)} 
                  className="w-full rounded-sm border-[#879596] py-2.5 px-3 border focus:ring-2 focus:ring-[#0972d3] focus:border-[#0972d3] outline-none transition-all sm:text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#16191f] mb-1">Budget ($)</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={budget} 
                  onChange={e => setBudget(e.target.value)} 
                  className="w-full rounded-sm border-[#879596] py-2.5 px-3 border focus:ring-2 focus:ring-[#0972d3] focus:border-[#0972d3] outline-none transition-all sm:text-sm" 
                  placeholder="0.00" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#16191f] mb-1">Manager (Owner ID)</label>
              <select 
                required 
                value={ownerId} 
                onChange={e => setOwnerId(e.target.value)} 
                className="w-full rounded-sm border-[#879596] py-2.5 px-3 border focus:ring-2 focus:ring-[#0972d3] focus:border-[#0972d3] outline-none transition-all sm:text-sm bg-white" 
              >
                <option value="" disabled>Select a manager...</option>
                <option value="manager-1">Alice Smith (manager-1)</option>
                <option value="manager-2">Bob Jones (manager-2)</option>
                <option value="manager-3">Charlie Davis (manager-3)</option>
                <option value="manager-4">Diana Prince (manager-4)</option>
              </select>
              <p className="mt-1.5 text-xs text-[#545b64]">
                The Cognito sub or username of the manager who will submit weekly reports.
              </p>
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 z-10 p-6 border-t border-[#eaeded] bg-[#f2f3f3] flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-[#16191f] bg-white border border-[#879596] rounded-sm hover:bg-[#f2f3f3] transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="create-project-form" 
            disabled={isSubmitting} 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#0972d3] border border-transparent rounded-sm hover:bg-[#005299] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
