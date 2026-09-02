import React from 'react';
import { CostHelp } from './CostHelp';
import { CostOverview } from './CostOverview';
import { CostBudgetPage } from './CostBudgetPage';
import { CostExpensePage } from './CostExpensePage';
import { CostReportsPage } from './CostReportsPage';
import { CostProvider } from './CostContext';

interface CostAppProps {
  activePage: string;
  onNavigate: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function CostApp({ activePage, onNavigate, navigateToApp }: CostAppProps) {
  const renderContent = () => {
    switch (activePage) {
      case 'Budget Page':
      case 'Budget':
        return <CostBudgetPage />;
      case 'Expense Page':
      case 'Expenses':
      case 'Expense':
        return <CostExpensePage />;
      case 'Reports Page':
      case 'Reports':
      case 'Report':
        return <CostReportsPage />;
      case 'Help':
        return <CostHelp />;
      case 'Overview':
      default:
        return <CostOverview />;
    }
  };

  return (
    <CostProvider>
      <div className="w-full h-full flex flex-col">
        {renderContent()}
      </div>
    </CostProvider>
  );
}

