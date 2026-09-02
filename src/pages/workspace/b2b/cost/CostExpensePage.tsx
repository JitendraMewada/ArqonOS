import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Building2,
  X
} from 'lucide-react';
import { useCost } from './CostContext';
import { CostExpense } from './data/mockCostData';
import { cn } from '../../../../lib/utils';

export function CostExpensePage() {
  const {
    projectsFinancials,
    expenses,
    selectedProjectId,
    setSelectedProjectId,
    addExpense,
    exportFinancialSummary
  } = useCost();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectId, setProjectId] = useState(projectsFinancials[0]?.projectId || '');
  const [category, setCategory] = useState<CostExpense['category']>('Materials & Finishes');
  const [spaceName, setSpaceName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<CostExpense['paymentMethod']>('Bank Transfer');
  const [status, setStatus] = useState<CostExpense['status']>('Paid');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [notes, setNotes] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      if (selectedProjectId !== 'ALL' && exp.projectId !== selectedProjectId) return false;
      if (categoryFilter !== 'ALL' && exp.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && exp.status !== statusFilter) return false;

      if (!searchQuery) return true;
      return (
        exp.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.invoiceRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exp.spaceName && exp.spaceName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [expenses, selectedProjectId, categoryFilter, statusFilter, searchQuery]);

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || amount <= 0 || !vendorName) return;

    const proj = projectsFinancials.find(p => p.projectId === projectId);
    await addExpense({
      projectId,
      projectName: proj?.projectName || 'Project',
      date: new Date().toISOString().split('T')[0],
      category,
      spaceName: spaceName || 'General / Unallocated',
      vendorName,
      amount: Number(amount),
      paymentMethod,
      status,
      invoiceRef: invoiceRef || `INV-${Date.now().toString().slice(-4)}`,
      notes
    });

    setIsModalOpen(false);
    setAmount(0);
    setVendorName('');
    setInvoiceRef('');
    setNotes('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto animate-in fade-in duration-300 text-left">
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase tracking-wider mb-2 border border-slate-300/50 dark:border-slate-700/50">
              <Receipt className="w-3.5 h-3.5" />
              Expense Ledger & Disbursement
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Expense Transactions
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Itemized record of direct purchases, subcontractor payments, and material drawdowns.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => exportFinancialSummary()}
              className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Transactions
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-extrabold transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Log Expense
            </button>
          </div>
        </div>

        {/* Filters and Stats Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vendor, invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="ALL">All Categories</option>
              <option value="Materials & Finishes">Materials & Finishes</option>
              <option value="Millwork & Joinery">Millwork & Joinery</option>
              <option value="FF&E & Furniture">FF&E & Furniture</option>
              <option value="MEP & Lighting">MEP & Lighting</option>
              <option value="Labor & Supervision">Labor & Supervision</option>
              <option value="Civil & Demolition">Civil & Demolition</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Filtered Spend Volume</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              ₹{totalFilteredAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Project & Space</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white">{exp.date}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{exp.projectName}</div>
                    <div className="text-[11px] text-slate-500">{exp.spaceName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {exp.vendorName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    <div>{exp.paymentMethod}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{exp.invoiceRef}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                    ₹{exp.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold",
                      exp.status === 'Paid' ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" :
                      exp.status === 'Approved' ? "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400" :
                      "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                    )}>
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Record New Expense</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Target Project</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {projectsFinancials.map(p => (
                    <option key={p.projectId} value={p.projectId}>{p.projectName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    required
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    placeholder="Vendor Name"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    placeholder="Amount"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-1.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
