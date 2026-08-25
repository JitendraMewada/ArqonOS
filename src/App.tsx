/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { LandingPage } from './pages/marketing/LandingPage';
import { ModuleShowcase } from './pages/marketing/ModuleShowcase';
import { Gateway } from './pages/marketing/Gateway';
import { Pricing } from './pages/marketing/Pricing';
import { WorkspaceDashboard } from './pages/workspace/b2b/WorkspaceDashboard';
import { NestDashboard } from './pages/workspace/b2c/NestDashboard';
import { useTheme } from './context/ThemeContext';
import { ScrollToTop } from './components/ScrollToTop';
import { LoadingScreen } from './components/LoadingScreen';

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={theme} data-theme={theme}>
      <LoadingScreen />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/modules/:moduleId" element={<ModuleShowcase />} />
            <Route path="/gateway" element={<Gateway />} />
            <Route path="/pricing" element={<Pricing />} />
          </Route>
          <Route path="/workspace/b2b" element={<WorkspaceDashboard />} />
          <Route path="/workspace/b2c" element={<NestDashboard />} />
        </Routes>
      </Router>
      <div id="modal-portal-root" />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
