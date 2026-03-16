import { NavLink } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  userRole: 'Director' | 'Manager';
}

export function Sidebar({ userRole }: SidebarProps) {
  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      isSub: false,
    },
    {
      name: 'Global Timeline',
      href: '/timeline',
      isSub: false,
    },
    {
      name: 'Strategy AI',
      href: '/strategy-ai',
      isSub: false,
    },
    {
      name: 'Weekly Check-in',
      href: '/manager',
      isSub: false,
    },
  ];

  return (
    <div className="flex flex-col w-56 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <span className="font-bold text-sm text-gray-900">trackIT</span>
        <ChevronLeft className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 py-2 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'block px-4 py-1.5 text-sm transition-colors whitespace-pre-line',
                  item.isSub ? 'pl-8' : '',
                  isActive
                    ? 'text-[#0972d3] font-bold'
                    : 'text-gray-600 font-normal hover:text-gray-900'
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
