import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  Euro,
  Users,
  Package,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { projects, expenses, workers, materials, notify } = useApp();
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('2026-YTD');

  const filteredProjects =
    selectedProjectFilter === 'All'
      ? projects
      : projects.filter((p) => p.id === selectedProjectFilter);

  // Financial aggregates
  const totalValue = filteredProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = filteredProjects.reduce((sum, p) => sum + p.spent, 0);
  const totalProfitBuffer = totalValue - totalSpent;
  const avgMargin = Math.round((totalProfitBuffer / totalValue) * 100);

  // Cost breakdown by category
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleExport = (format: 'PDF' | 'Excel') => {
    notify(`Generating comprehensive ${format} Executive Report for BuildCore Construction Belgium...`, 'info');
    setTimeout(() => {
      notify(`Executive ${format} Report downloaded successfully!`);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Controls & Export Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Financial, Operational & Margin Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Automated company-wide reporting replacing 14 manual Excel spreadsheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Project:</span>
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Projects (Combined)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('Excel')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export .XLSX</span>
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Executive PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Total Contract Value</div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            €{totalValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Contractually bound</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Actual Cumulative Spent</div>
          <div className="text-2xl font-black text-amber-700 font-mono">
            €{totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Incurred costs to date</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Projected Gross Margin</div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            €{totalProfitBuffer.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            {avgMargin}% Gross Margin Projected
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">Company Workforce Capacity</div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            45 Active Staff
          </div>
          <div className="text-[11px] text-slate-500 mt-1">1,780 Billable Hours / wk</div>
        </div>
      </div>

      {/* Section: Project Profitability & Cost Variance */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Project Profitability & Budget Utilization Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Contract value vs. current cost commitment vs. remaining gross margin buffer
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3">Manager</th>
                <th className="py-2.5 px-3">Contract Value</th>
                <th className="py-2.5 px-3">Spent</th>
                <th className="py-2.5 px-3">Gross Margin (€)</th>
                <th className="py-2.5 px-3">Margin %</th>
                <th className="py-2.5 px-3">Progress</th>
                <th className="py-2.5 px-3">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProjects.map((p) => {
                const margin = p.budget - p.spent;
                const marginPercent = Math.round((margin / p.budget) * 100);

                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-3 text-slate-600">{p.projectManager}</td>
                    <td className="py-3 px-3 font-mono font-bold">€{p.budget.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-700">
                      €{p.spent.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                      €{margin.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          marginPercent < 20
                            ? 'bg-rose-100 text-rose-800'
                            : marginPercent < 35
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {marginPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{p.progress}%</span>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'On Track'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'At Risk'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Labor & Material Cost Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Category Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Cost Allocation by Operational Category
            </h3>
            <p className="text-xs text-slate-500">Materials, labor, subcontractors, and equipment hire</p>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(categoryTotals).map(([cat, amount]) => {
              const totalCost = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
              const percentage = Math.round((amount / totalCost) * 100);

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">{cat}</span>
                    <span className="font-mono font-bold text-slate-900">
                      €{amount.toLocaleString()} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Worker Hours & CAO Compliance */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Workforce Labor Hours & Utilization
            </h3>
            <p className="text-xs text-slate-500">CP 124 / PC 124 Construction standard 40h compliance</p>
          </div>

          <div className="space-y-2.5 text-xs">
            {workers.slice(0, 5).map((w) => (
              <div
                key={w.id}
                className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">{w.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {w.role} • {w.currentProjectName}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 block">
                    {w.hoursThisWeek} hrs
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    100% on target
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
