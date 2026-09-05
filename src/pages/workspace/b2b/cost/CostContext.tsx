import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CostExpense,
  ProjectFinancials,
  PortfolioSummary,
  MOCK_PROJECT_FINANCIALS,
  MOCK_EXPENSES_LIST,
  calculatePortfolioSummary
} from './data/mockCostData';

interface CostContextType {
  projectsFinancials: ProjectFinancials[];
  expenses: CostExpense[];
  selectedProjectId: string | 'ALL';
  setSelectedProjectId: (id: string | 'ALL') => void;
  portfolioSummary: PortfolioSummary;
  activeProject?: ProjectFinancials;
  
  // Filtering & Search
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  timeframe: 'all' | 'this_month' | 'this_quarter' | 'this_year';
  setTimeframe: (tf: 'all' | 'this_month' | 'this_quarter' | 'this_year') => void;
  
  // Mutations
  addExpense: (expense: Omit<CostExpense, 'id'>) => Promise<void>;
  updateExpense: (id: string, updates: Partial<CostExpense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateProjectBudget: (projectId: string, budgetData: Partial<ProjectFinancials>) => Promise<void>;
  syncEngineData: () => Promise<void>;
  isSyncing: boolean;
  getProjectFinancials: (projectId: string) => ProjectFinancials | undefined;
  exportFinancialSummary: (projectId?: string) => void;
}

const CostContext = createContext<CostContextType | undefined>(undefined);

export function CostProvider({ children }: { children: React.ReactNode }) {
  const [projectsFinancials, setProjectsFinancials] = useState<ProjectFinancials[]>(() => {
    const saved = localStorage.getItem('arqon_cost_projects');
    if (saved && saved !== 'undefined' && saved !== 'null') {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if cached demo project has the updated 9 spaces
          const gm = parsed.find(p => p.projectId === 'proj-goldmine');
          if (gm && gm.spaces && gm.spaces.length >= 9) {
            return parsed.map(p => {
              if (p.projectId === 'proj-goldmine' || p.projectName?.includes('Goldmine')) {
                return {
                  ...p,
                  projectName: 'Demo Project',
                  projectCode: 'demo-arq-001',
                  clientName: 'Demo Client',
                  projectType: 'Residence',
                  location: 'Demo Tower, Demo City, Demo State - 000000',
                };
              }
              return p;
            });
          }
        }
      } catch (e) {
        console.error('Error parsing saved cost projects', e);
      }
    }
    return MOCK_PROJECT_FINANCIALS;
  });

  const [expenses, setExpenses] = useState<CostExpense[]>(() => {
    const saved = localStorage.getItem('arqon_cost_expenses');
    if (saved && saved !== 'undefined' && saved !== 'null') {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          return parsed.map((e: CostExpense) => {
            if (e.projectName?.includes('Goldmine')) {
              return { ...e, projectName: 'Demo Project' };
            }
            return e;
          });
        }
      } catch (e) {
        console.error('Error parsing saved cost expenses', e);
      }
    }
    return MOCK_EXPENSES_LIST;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeframe, setTimeframe] = useState<'all' | 'this_month' | 'this_quarter' | 'this_year'>('all');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('arqon_cost_projects', JSON.stringify(projectsFinancials));
  }, [projectsFinancials]);

  useEffect(() => {
    localStorage.setItem('arqon_cost_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Derived portfolio summary
  const portfolioSummary = calculatePortfolioSummary(projectsFinancials);

  // Derived active single project
  const activeProject = selectedProjectId === 'ALL'
    ? undefined
    : projectsFinancials.find(p => p.projectId === selectedProjectId);

  // Mutation functions
  const addExpense = async (expenseData: Omit<CostExpense, 'id'>) => {
    const newId = `exp-${Date.now()}`;
    const newExpense: CostExpense = {
      ...expenseData,
      id: newId
    };

    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);

    // Update the corresponding project's actual incurred cost
    setProjectsFinancials(prev => prev.map(proj => {
      if (proj.projectId === expenseData.projectId) {
        const newActualCost = proj.actualIncurredCost + expenseData.amount;
        const newForecast = Math.max(proj.approvedBudget, newActualCost + proj.committedCost);
        const newVariance = proj.approvedBudget - newForecast;
        const newGrossMargin = proj.contractValue - newForecast;
        const newMarginPct = proj.contractValue > 0 ? (newGrossMargin / proj.contractValue) * 100 : 0;
        
        let health: 'Healthy' | 'Caution' | 'Critical Overrun' = 'Healthy';
        if (newVariance < -50000) health = 'Critical Overrun';
        else if (newVariance < 0) health = 'Caution';

        return {
          ...proj,
          actualIncurredCost: newActualCost,
          forecastAtCompletion: newForecast,
          variance: newVariance,
          grossMargin: newGrossMargin,
          marginPercentage: Number(newMarginPct.toFixed(1)),
          budgetHealth: health
        };
      }
      return proj;
    }));
  };

  const updateExpense = async (id: string, updates: Partial<CostExpense>) => {
    setExpenses(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteExpense = async (id: string) => {
    const target = expenses.find(e => e.id === id);
    if (!target) return;

    setExpenses(prev => prev.filter(item => item.id !== id));

    // Deduct from project financials
    setProjectsFinancials(prev => prev.map(proj => {
      if (proj.projectId === target.projectId) {
        const newActualCost = Math.max(0, proj.actualIncurredCost - target.amount);
        const newForecast = Math.max(proj.approvedBudget, newActualCost + proj.committedCost);
        const newVariance = proj.approvedBudget - newForecast;
        const newGrossMargin = proj.contractValue - newForecast;
        const newMarginPct = proj.contractValue > 0 ? (newGrossMargin / proj.contractValue) * 100 : 0;

        let health: 'Healthy' | 'Caution' | 'Critical Overrun' = 'Healthy';
        if (newVariance < -50000) health = 'Critical Overrun';
        else if (newVariance < 0) health = 'Caution';

        return {
          ...proj,
          actualIncurredCost: newActualCost,
          forecastAtCompletion: newForecast,
          variance: newVariance,
          grossMargin: newGrossMargin,
          marginPercentage: Number(newMarginPct.toFixed(1)),
          budgetHealth: health
        };
      }
      return proj;
    }));
  };

  const updateProjectBudget = async (projectId: string, budgetData: Partial<ProjectFinancials>) => {
    setProjectsFinancials(prev => prev.map(p => {
      if (p.projectId === projectId) {
        const updated = { ...p, ...budgetData };
        if (budgetData.approvedBudget !== undefined || budgetData.contractValue !== undefined) {
          const forecast = updated.forecastAtCompletion || updated.actualIncurredCost + updated.committedCost;
          updated.variance = (updated.approvedBudget || 0) - forecast;
          updated.grossMargin = (updated.contractValue || 0) - forecast;
          updated.marginPercentage = updated.contractValue > 0 ? Number(((updated.grossMargin / updated.contractValue) * 100).toFixed(1)) : 0;
          if (updated.variance < -50000) updated.budgetHealth = 'Critical Overrun';
          else if (updated.variance < 0) updated.budgetHealth = 'Caution';
          else updated.budgetHealth = 'Healthy';
        }
        return updated;
      }
      return p;
    }));
  };

  // Cross-Engine Sync function to fetch & import data from Studio, Connect, People, and Flow
  const syncEngineData = async () => {
    setIsSyncing(true);
    try {
      // Simulate real-time synchronization with cross-engine registries
      await new Promise(resolve => setTimeout(resolve, 600));

      // Pull any new Studio projects from local storage
      const studioProjectsRaw = localStorage.getItem('mock_projects');
      if (studioProjectsRaw) {
        try {
          const studioProjects = JSON.parse(studioProjectsRaw);
          if (Array.isArray(studioProjects)) {
            setProjectsFinancials(currentList => {
              const updatedList = [...currentList];
              studioProjects.forEach((sp: any) => {
                const existingIndex = updatedList.findIndex(p => p.projectId === sp.id);
                if (existingIndex >= 0) {
                  // Update with Studio fields
                  updatedList[existingIndex] = {
                    ...updatedList[existingIndex],
                    projectName: sp.name || updatedList[existingIndex].projectName,
                    projectCode: sp.code || updatedList[existingIndex].projectCode,
                    clientName: sp.clientName || updatedList[existingIndex].clientName,
                    estimatedBudget: sp.estimatedBudget || updatedList[existingIndex].estimatedBudget,
                    approvedBudget: sp.approvedBudget || updatedList[existingIndex].approvedBudget,
                    totalAreaSqFt: sp.totalArea || updatedList[existingIndex].totalAreaSqFt,
                    status: (sp.status === 'Active' ? 'Active' : sp.status === 'On Hold' ? 'On Hold' : 'Active')
                  };
                }
              });
              return updatedList;
            });
          }
        } catch (e) {
          console.error('Error importing Studio projects into Cost', e);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const getProjectFinancials = (projectId: string) => {
    return projectsFinancials.find(p => p.projectId === projectId);
  };

  const exportFinancialSummary = (projectId?: string) => {
    const targetProject = projectId ? getProjectFinancials(projectId) : activeProject;
    
    let content = '';
    if (targetProject) {
      content = `ARQON OS - FINANCIAL COST SUMMARY FOR ${targetProject.projectName.toUpperCase()} (${targetProject.projectCode})
---------------------------------------------------------------------------------
Client Name: ${targetProject.clientName}
Location: ${targetProject.location} | Total Area: ${targetProject.totalAreaSqFt.toLocaleString()} sq ft
Studio Gate Status: ${targetProject.approvalGateStatus}
Timeline: ${targetProject.startDate} to ${targetProject.endDate}

FINANCIAL OVERVIEW:
- Total Client Contract Value: ₹${targetProject.contractValue.toLocaleString()}
- Approved BOQ Budget:         ₹${targetProject.approvedBudget.toLocaleString()}
- Actual Incurred Cost:        ₹${targetProject.actualIncurredCost.toLocaleString()}
- Committed Vendor POs:        ₹${targetProject.committedCost.toLocaleString()}
- Forecast at Completion (EAC):₹${targetProject.forecastAtCompletion.toLocaleString()}
- Financial Variance:          ₹${targetProject.variance.toLocaleString()} (${targetProject.variance >= 0 ? 'Under Budget' : 'Cost Overrun'})
- Projected Gross Margin:      ₹${targetProject.grossMargin.toLocaleString()} (${targetProject.marginPercentage}%)
- Client Invoiced:             ₹${targetProject.cashflowInvoiced.toLocaleString()}
- Client Received:             ₹${targetProject.cashflowReceived.toLocaleString()}
- Outstanding Receivables:     ₹${targetProject.cashflowOutstanding.toLocaleString()}

SPACE-BY-SPACE COST BREAKDOWN:
${targetProject.spaces.map(s => `• ${s.spaceName} (${s.areaSqFt} sq ft): Allocated ₹${s.allocatedBudget.toLocaleString()} | Actual ₹${s.actualCost.toLocaleString()} | Variance ₹${s.variance.toLocaleString()}`).join('\n')}

Generated systematically by ArqonOS Financial Control Engine.`;
    } else {
      content = `ARQON OS - OVERALL PORTFOLIO FINANCIAL SUMMARY (ALL PROJECTS)
---------------------------------------------------------------------------------
Total Active Projects:         ${portfolioSummary.totalActiveProjects}
Total Portfolio Contract Value:₹${portfolioSummary.totalPortfolioContractValue.toLocaleString()}
Total Portfolio BOQ Budget:    ₹${portfolioSummary.totalPortfolioApprovedBudget.toLocaleString()}
Total Portfolio Incurred Cost: ₹${portfolioSummary.totalPortfolioIncurredCost.toLocaleString()}
Total Committed Vendor POs:    ₹${portfolioSummary.totalPortfolioCommittedCost.toLocaleString()}
Total Remaining Budget:        ₹${portfolioSummary.totalPortfolioRemainingBudget.toLocaleString()}
Portfolio Gross Margin:        ₹${portfolioSummary.portfolioGrossMargin.toLocaleString()} (${portfolioSummary.portfolioGrossMarginPercentage}%)
Total Client Invoiced:         ₹${portfolioSummary.totalInvoiced.toLocaleString()}
Total Client Collections:      ₹${portfolioSummary.totalCollected.toLocaleString()}
Total Outstanding Receivables: ₹${portfolioSummary.totalReceivables.toLocaleString()}

PROJECT HEALTH MATRIX:
• Healthy: ${portfolioSummary.healthyProjectsCount} projects
• Caution: ${portfolioSummary.cautionProjectsCount} projects
• Overrun: ${portfolioSummary.overrunProjectsCount} projects

Generated systematically by ArqonOS Financial Control Engine.`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Arqon_Cost_${targetProject ? targetProject.projectCode : 'Portfolio_Overview'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <CostContext.Provider
      value={{
        projectsFinancials,
        expenses,
        selectedProjectId,
        setSelectedProjectId,
        portfolioSummary,
        activeProject,
        filterCategory,
        setFilterCategory,
        searchQuery,
        setSearchQuery,
        timeframe,
        setTimeframe,
        addExpense,
        updateExpense,
        deleteExpense,
        updateProjectBudget,
        syncEngineData,
        isSyncing,
        getProjectFinancials,
        exportFinancialSummary
      }}
    >
      {children}
    </CostContext.Provider>
  );
}

export function useCost() {
  const context = useContext(CostContext);
  if (!context) {
    throw new Error('useCost must be used within a CostProvider');
  }
  return context;
}
