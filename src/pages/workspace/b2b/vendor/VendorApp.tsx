import React from 'react';
import { VendorProvider } from './VendorContext';
import { VendorOverview } from './VendorOverview';
import { VendorDirectoryPage } from './VendorDirectoryPage';
import { VendorProcurementPage } from './VendorProcurementPage';
import { VendorContractsPage } from './VendorContractsPage';
import { VendorHelp } from './VendorHelp';

interface VendorAppProps {
  activePage: string;
  onNavigate: (page: string) => void;
  navigateToApp?: (appId: string, pageName: string) => void;
}

export function VendorApp({ activePage, onNavigate, navigateToApp }: VendorAppProps) {
  const renderActivePage = () => {
    switch (activePage) {
      case 'Overview':
        return <VendorOverview onNavigatePage={onNavigate} navigateToApp={navigateToApp} />;
      case 'Directory Page':
      case 'Directory':
        return <VendorDirectoryPage />;
      case 'Procurement Page':
      case 'Procurement':
        return <VendorProcurementPage />;
      case 'Contracts Page':
      case 'Contracts':
        return <VendorContractsPage />;
      case 'Help':
        return <VendorHelp />;
      default:
        return <VendorOverview onNavigatePage={onNavigate} navigateToApp={navigateToApp} />;
    }
  };

  return (
    <VendorProvider>
      <div className="w-full h-full flex flex-col">
        {renderActivePage()}
      </div>
    </VendorProvider>
  );
}
