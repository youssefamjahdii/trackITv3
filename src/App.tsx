import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import DirectorDashboard from './pages/DirectorDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import StrategyAI from './pages/StrategyAI';
import '@aws-amplify/ui-react/styles.css';

export default function App() {
  // In a real app, we'd determine the role from the user's Cognito groups
  // For this preview, we'll default to 'Director' to show the full UI
  const userRole = 'Director';

  // Mock signOut for preview
  const handleSignOut = () => {
    console.log('Sign out clicked (Preview Mode)');
  };

  return (
    <BrowserRouter>
      <Layout userRole={userRole} signOut={handleSignOut}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ExecutiveDashboard />} />
          <Route path="/timeline" element={<DirectorDashboard />} />
          <Route path="/strategy-ai" element={<StrategyAI />} />
          <Route path="/manager" element={<ManagerDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
