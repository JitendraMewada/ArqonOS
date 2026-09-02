import React from 'react';
import { InsightProvider } from './InsightContext';
import { InsightOverview } from './InsightOverview';
import { InsightDashboardPage } from './InsightDashboardPage';
import { InsightReportsPage } from './InsightReportsPage';
import { InsightForecastPage } from './InsightForecastPage';
import { InsightHelp } from './InsightHelp';

interface InsightAppProps {
  activePage: string;
  onNavigate: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function InsightApp({ activePage, onNavigate, navigateToApp }: InsightAppProps) {
  const renderActivePage = () => {
    switch (activePage) {
      case 'Overview':
        return <InsightOverview onNavigatePage={onNavigate} navigateToApp={navigateToApp} />;
      case 'Dashboard Page':
      case 'Dashboard':
        return <InsightDashboardPage />;
      case 'Reports Page':
      case 'Reports':
        return <InsightReportsPage />;
      case 'Forecast Page':
      case 'Forecast':
        return <InsightForecastPage />;
      case 'Help':
        return <InsightHelp />;
      default:
        return <InsightOverview onNavigatePage={onNavigate} navigateToApp={navigateToApp} />;
    }
  };

  return (
    <InsightProvider>
      <div className="w-full h-full flex flex-col">
        {renderActivePage()}
      </div>
    </InsightProvider>
  );
}
