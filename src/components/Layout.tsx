import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  userRole: 'Director' | 'Manager';
  signOut: () => void;
}

export function Layout({ children, userRole, signOut }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userRole={userRole} signOut={signOut} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
