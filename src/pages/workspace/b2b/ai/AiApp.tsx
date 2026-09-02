import React from 'react';
import { AiProvider } from './AiContext';
import { AiOverview } from './AiOverview';
import { AiAutomationPage } from './AiAutomationPage';
import { AiPredictionPage } from './AiPredictionPage';
import { AiOptimizationPage } from './AiOptimizationPage';
import { AiHelp } from './AiHelp';

interface AiAppProps {
  activePage: string;
  onNavigate: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function AiApp({ activePage, onNavigate, navigateToApp }: AiAppProps) {
  const renderActivePage = () => {
    switch (activePage) {
      case 'Automation Page':
        return <AiAutomationPage />;
      case 'Prediction Page':
        return <AiPredictionPage />;
      case 'Optimization Page':
        return <AiOptimizationPage />;
      case 'Help':
      case 'Help Page':
        return <AiHelp />;
      case 'Overview':
      case 'Overview Page':
      default:
        return <AiOverview onNavigatePage={onNavigate} navigateToApp={navigateToApp} />;
    }
  };

  return (
    <AiProvider>
      <div className="w-full h-full flex flex-col p-6 overflow-y-auto">
        {renderActivePage()}
      </div>
    </AiProvider>
  );
}
