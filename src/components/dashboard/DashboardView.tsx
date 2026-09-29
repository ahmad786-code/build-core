import React, { useState } from 'react';
import {
  FolderKanban,
  Euro,
  Users,
  CheckSquare,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileCheck2,
  ChevronRight,
  HardHat,
  ShieldAlert,
  ArrowRight,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus } from '../../types';

interface DashboardViewProps {
  onOpenNewReport: () => void;
  onOpenNewTask: () => void;
  onOpenNewExpense: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewReport,
  onOpenNewTask,
  onOpenNewExpense,
}) => {
  const {
    projects,
    tasks,
    activities,
    openProjectDetails,
    setActiveTab,
  } = useApp();

  const [activeChartMetric, setActiveChartMetric] = useState<'budget' | 'monthly'>('budget');

  // Exact 5 highlighted projects as per specification
  const topProjects = projects.slice(0, 5);

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'On Track':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            On Track
          </span>
        );
      case 'At Risk':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            At Risk
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-700" />
            Delayed
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-700" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  // Monthly expense breakdown data for demo
  const monthlyExpenses = [
    { month: 'May 2026', total: 310200, materials: 140000, labor: 95000, subs: 75200 },
    { month: 'Jun 2026', total: 365800, materials: 172000, labor: 110000, subs: 83800 },
    { month: 'Jul 2026', total: 398400, materials: 191000, labor: 118000, subs: 89400 },
    { month: 'Aug 2026', total: 412000, materials: 198000, labor: 121000, subs: 93000 },
    { month: 'Sep 2026 (MTD)', total: 428500, materials: 205000, labor: 126500, subs: 97000 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Welcome & Owner Value Hook */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-slate-700">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <HardHat className="w-72 h-72 text-amber-400 -rotate-12 translate-x-12" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Single Source of Truth for BuildCore Construction Belgium
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-2">
            BuildCore Command Center
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Total operational visibility across Belgian job sites. Live project margins, daily site compliance, subcontractor trade billing, and material inventory—zero lost paperwork.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewReport}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <FileCheck2 className="w-4 h-4 stroke-[2.5]" />
              Submit Site Report
            </button>
            <button
              onClick={onOpenNewTask}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-600 flex items-center gap-2 transition"
            >
              <CheckSquare className="w-4 h-4 text-amber-400" />
              Dispatch Site Task
            </button>
            <button
              onClick={onOpenNewExpense}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-600 flex items-center gap-2 transition"
            >
              <Euro className="w-4 h-4 text-emerald-400" />
              Record Job Expense
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid - Exactly matching specs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Company-Wide Key Performance Indicators
          </h3>
          <span className="text-xs text-slate-400">Live Sync • Belgian Ops</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
          {/* 1. Active Projects */}
          <div
            onClick={() => setActiveTab('projects')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Active Projects</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">8</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <span>All 8 sites manned</span>
            </div>
          </div>

          {/* 2. Total Project Value */}
          <div
            onClick={() => setActiveTab('reports')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Project Value</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <Euro className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">€4.8M</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Combined contracts
            </div>
          </div>

          {/* 3. Total Expenses This Month */}
          <div
            onClick={() => setActiveTab('expenses')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Expenses This Month</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">€428,500</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <span>-3.2% vs budget forecast</span>
            </div>
          </div>

          {/* 4. Workers Active */}
          <div
            onClick={() => setActiveTab('workers')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Workers Active</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">45</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              100% attendance logged
            </div>
          </div>

          {/* 5. Pending Tasks */}
          <div
            onClick={() => setActiveTab('tasks')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Pending Tasks</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">27</div>
            <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <span>2 overdue inspections</span>
            </div>
          </div>

          {/* 6. Material Requests */}
          <div
            onClick={() => setActiveTab('purchase-orders')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Material Requests</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">12</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              4 POs pending approval
            </div>
          </div>

          {/* 7. Projects At Risk */}
          <div
            onClick={() => setActiveTab('projects')}
            className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm hover:border-rose-400 hover:shadow-md transition cursor-pointer group bg-rose-50/20"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-rose-800">Projects At Risk</span>
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-700">2</div>
            <div className="text-[11px] text-rose-600 font-semibold mt-1">
              Antwerp & Bruges
            </div>
          </div>
        </div>
      </div>

      {/* Project Progress Table - Central Feature */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Active Project Progress & Financial Health
            </h3>
            <p className="text-xs text-slate-500">
              Live tracking of the 5 flagship jobs. Click any project to open detailed project workspace.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All 8 Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Project Name</th>
                <th className="py-3 px-4">Manager</th>
                <th className="py-3 px-4 w-48">Progress</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Spent</th>
                <th className="py-3 px-4">Remaining</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {topProjects.map((proj) => {
                const remaining = proj.budget - proj.spent;
                const spendRatio = Math.round((proj.spent / proj.budget) * 100);

                return (
                  <tr
                    key={proj.id}
                    onClick={() => openProjectDetails(proj.id)}
                    className="hover:bg-amber-50/40 transition cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 group-hover:text-amber-700 transition">
                        {proj.name}
                      </div>
                      <div className="text-xs text-slate-400 font-normal">
                        {proj.location} • {proj.client}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                          {proj.projectManager
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span className="text-slate-800 text-xs font-semibold">
                          {proj.projectManager}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900">{proj.progress}%</span>
                        <span className="text-[11px] text-slate-400">
                          Spent: {spendRatio}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            proj.status === 'At Risk'
                              ? 'bg-amber-500'
                              : proj.status === 'Delayed'
                              ? 'bg-rose-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-semibold text-slate-900">
                      €{proj.budget.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 font-mono font-semibold text-slate-900">
                      €{proj.spent.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 font-mono text-xs">
                      <span className={remaining < 100000 ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                        €{remaining.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(proj.status)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button className="text-xs font-semibold text-amber-600 hover:text-amber-700 group-hover:translate-x-1 transition inline-flex items-center gap-1">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Charts & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Charts (Budget vs Actual & Monthly Expenses) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {activeChartMetric === 'budget'
                  ? 'Budget vs. Actual Spent Comparison'
                  : 'Monthly Operating Expenditure (€428,500 Current)'}
              </h3>
              <p className="text-xs text-slate-500">
                Visualizing contract variance and cost control across key projects.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveChartMetric('budget')}
                className={`px-3 py-1 rounded-md transition ${
                  activeChartMetric === 'budget'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Budget vs Actual
              </button>
              <button
                onClick={() => setActiveChartMetric('monthly')}
                className={`px-3 py-1 rounded-md transition ${
                  activeChartMetric === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Expenses
              </button>
            </div>
          </div>

          {activeChartMetric === 'budget' ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-end gap-5 text-xs text-slate-600 mb-2 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-slate-300"></div>
                  <span>Total Budget (€)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
                  <span>Actual Spent (€)</span>
                </div>
              </div>

              {topProjects.map((p) => {
                const maxVal = 1300000;
                const budgetPercent = (p.budget / maxVal) * 100;
                const spentPercent = (p.spent / maxVal) * 100;
                const variance = p.budget - p.spent;

                return (
                  <div key={p.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{p.name}</span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-500">Budget: €{(p.budget / 1000).toFixed(0)}k</span>
                        <span className="font-bold text-amber-700">Spent: €{(p.spent / 1000).toFixed(0)}k</span>
                        <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          €{(variance / 1000).toFixed(0)}k rem.
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {/* Budget Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                        <div
                          className="bg-slate-300 h-full rounded-full transition-all duration-500"
                          style={{ width: `${budgetPercent}%` }}
                        />
                      </div>
                      {/* Spent Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            p.status === 'At Risk' ? 'bg-amber-500' : 'bg-amber-600'
                          }`}
                          style={{ width: `${spentPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Monthly Expenses Chart */
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span>Monthly Run-rate Trend (May - September 2026)</span>
                <span className="font-semibold text-slate-700">Materials • Labor • Subcontractors</span>
              </div>

              <div className="grid grid-cols-5 gap-3 h-56 items-end pb-6 pt-2 border-b border-slate-200">
                {monthlyExpenses.map((m, idx) => {
                  const maxExpense = 480000;
                  const heightPercent = Math.round((m.total / maxExpense) * 100);

                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group">
                      <div className="text-[11px] font-mono font-bold text-slate-800 mb-1 group-hover:text-amber-600 transition">
                        €{(m.total / 1000).toFixed(1)}k
                      </div>
                      <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end transition-all group-hover:ring-2 group-hover:ring-amber-500">
                        <div
                          className="w-full bg-slate-800 rounded-t-lg transition-all duration-500 flex flex-col justify-end overflow-hidden"
                          style={{ height: `${heightPercent * 1.8}px` }}
                        >
                          <div
                            className="bg-amber-500 w-full"
                            style={{ height: `${(m.materials / m.total) * 100}%` }}
                            title={`Materials: €${m.materials.toLocaleString()}`}
                          />
                          <div
                            className="bg-blue-600 w-full"
                            style={{ height: `${(m.labor / m.total) * 100}%` }}
                            title={`Labor: €${m.labor.toLocaleString()}`}
                          />
                          <div
                            className="bg-emerald-600 w-full"
                            style={{ height: `${(m.subs / m.total) * 100}%` }}
                            title={`Subcontractors: €${m.subs.toLocaleString()}`}
                          />
                        </div>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 mt-2 text-center truncate w-full">
                        {m.month.split(' ')[0]}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Materials
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> Labor Payroll
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span> Subcontractors
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Recent Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Site Activity</h3>
              <p className="text-xs text-slate-500">Real-time audit log of company operations</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
              >
                <div className="mt-0.5 shrink-0">
                  {act.type === 'report' && (
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                  )}
                  {act.type === 'material' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  )}
                  {act.type === 'worker' && (
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  )}
                  {act.type === 'expense' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Euro className="w-4 h-4" />
                    </div>
                  )}
                  {act.type === 'task' && (
                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                  )}
                  {act.type === 'project' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="truncate">{act.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {act.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{act.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveTab('daily-reports')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
            >
              Inspect All Site Reports & Logs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
