import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Euro,
  Filter,
  TrendingDown,
  CheckCircle2,
  Clock,
  Building,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Expense, ExpenseCategory } from '../../types';

interface ExpensesViewProps {
  onOpenNewExpense: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ onOpenNewExpense }) => {
  const { expenses, projects, globalSearchQuery, openProjectDetails } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  const effectiveSearch = globalSearchQuery || localSearch;

  const filteredExpenses = expenses.filter((e) => {
    const matchesCategory =
      categoryFilter === 'All' ? true : e.category === categoryFilter;
    const matchesProject =
      projectFilter === 'All' ? true : e.projectId === projectFilter;
    const matchesSearch =
      e.description.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      e.supplier.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      e.projectName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (e.receiptRef && e.receiptRef.toLowerCase().includes(effectiveSearch.toLowerCase()));

    return matchesCategory && matchesProject && matchesSearch;
  });

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categories: (ExpenseCategory | 'All')[] = [
    'All',
    'Materials',
    'Labor',
    'Equipment',
    'Subcontractors',
    'Transportation',
    'Other',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Expense KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">
            Total Recorded Expenses
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            €{totalAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {filteredExpenses.length} invoice items
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">
            Materials & Equipment Share
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">
            €{expenses
              .filter((e) => e.category === 'Materials' || e.category === 'Equipment')
              .reduce((s, e) => s + e.amount, 0)
              .toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Direct job site allocation
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">
            Subcontractor Billings
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            €{expenses
              .filter((e) => e.category === 'Subcontractors')
              .reduce((s, e) => s + e.amount, 0)
              .toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Milestone progress verified</div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenNewExpense}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Expense</span>
          </button>
        </div>

        {/* Second Filter Row: Search & Project */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses, description, supplier, invoice..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Supplier / Payee</th>
                <th className="py-3 px-3">Invoice / Ref</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-amber-50/40 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {exp.date}
                  </td>
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => openProjectDetails(exp.projectId)}
                      className="font-semibold text-slate-900 hover:text-amber-700 text-left"
                    >
                      {exp.projectName}
                    </button>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {exp.description}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {exp.supplier}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                    {exp.receiptRef || '—'}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                    €{exp.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        exp.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {exp.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
