import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, LogOut, Activity, PieChart, BrainCircuit } from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  userRole: 'Director' | 'Manager';
  signOut: () => void;
}

export function Sidebar({ userRole, signOut }: SidebarProps) {
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: PieChart,
      roles: ['Director'],
    },
    {
      name: 'Global Timeline',
      href: '/timeline',
      icon: LayoutDashboard,
      roles: ['Director'],
    },
    {
      name: 'Strategy AI',
      href: '/strategy-ai',
      icon: BrainCircuit,
      roles: ['Director'],
    },
    {
      name: 'Weekly Check-in',
      href: '/manager',
      icon: CheckSquare,
      roles: ['Manager', 'Director'], // Directors might also manage projects
    },
  ];

  return (
    <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
      <div className="flex items-center h-16 px-6 border-b border-slate-800">
        <Activity className="w-6 h-6 text-indigo-400 mr-2" />
        <span className="text-lg font-bold text-white tracking-tight">TrackIT</span>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems
          .filter((item) => item.roles.includes(userRole))
          .map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                  isActive
                    ? 'bg-indigo-500/20 text-white font-bold'
                    : 'text-slate-400 font-medium hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={signOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
