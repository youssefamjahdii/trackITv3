import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Search, ExternalLink, Bell, Settings, User, Star } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  userRole: 'Director' | 'Manager';
  signOut: () => void;
}

export function Layout({ children, userRole, signOut }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-[#16191f]">
      {/* Top Navigation */}
      <header className="h-12 bg-[#232f3e] flex items-center justify-between px-4 text-white flex-shrink-0 z-30 sticky top-0">
        <div className="flex items-center w-1/3">
          <div className="border border-gray-400 px-1 text-xs mr-3 rounded-sm">Logo</div>
          <span className="text-sm font-bold tracking-wide">Cabin - IS IT & CL</span>
        </div>
        
        <div className="flex-1 flex justify-center w-1/3">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Star className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-1 border border-transparent rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-0 sm:text-sm"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-5 text-sm w-1/3">
          <button className="flex items-center hover:text-gray-300 transition-colors">
            Link <ExternalLink className="w-4 h-4 ml-1" />
          </button>
          <button className="hover:text-gray-300 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="hover:text-gray-300 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button onClick={signOut} className="hover:text-gray-300 transition-colors">
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar userRole={userRole} />
        <main className="flex-1 overflow-y-auto bg-white flex flex-col">
          <div className="flex-1 px-6 py-4">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#f8f9fa] border-t border-gray-200 px-6 py-2 text-xs text-gray-500 flex-shrink-0">
        <div className="font-bold text-black">Data Privacy Notice</div>
        <div className="italic">By using this application, you acknowledge that your data may be collected and processed in accordance with our Privacy Policy and applicable data protection laws.</div>
      </footer>
    </div>
  );
}
