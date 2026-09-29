import React from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Building,
  Euro,
  CheckSquare,
  AlertTriangle,
  Clock,
  FileCheck2,
  Receipt,
  FileText,
  Users,
  Package,
  Plus,
  TrendingUp,
  Download,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectStatus } from '../../types';

interface ProjectDetailViewProps {
  projectId: string;
  onOpenNewTask: () => void;
  onOpenNewReport: () => void;
  onOpenNewExpense: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  projectId,
  onOpenNewTask,
  onOpenNewReport,
  onOpenNewExpense,
}) => {
  const {
    projects,
    tasks,
    dailyReports,
    workers,
    materials,
    expenses,
    documents,
    closeProjectDetails,
    projectDetailSubTab,
    setProjectDetailSubTab,
    toggleTaskStatus,
    setSelectedReportId,
  } = useApp();

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-600 mb-3">Project not found or was removed.</p>
        <button
          onClick={closeProjectDetails}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold"
        >
          Return to Projects List
        </button>
      </div>
    );
  }

  const remaining = project.budget - project.spent;
  const spendPercent = Math.round((project.spent / project.budget) * 100);

  // Filtered collections for this project
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const openTasks = projectTasks.filter((t) => t.status !== 'Completed');
  const projectReports = dailyReports.filter((r) => r.projectId === project.id);
  const projectExpenses = expenses.filter((e) => e.projectId === project.id);
  const projectWorkers = workers.filter(
    (w) => w.currentProjectId === project.id || w.name === project.projectManager
  );
  const projectDocs = documents.filter(
    (d) => d.projectId === project.id || !d.projectId
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'tasks', label: `Tasks (${projectTasks.length})`, icon: CheckSquare },
    { id: 'workers', label: `Workers (${projectWorkers.length})`, icon: Users },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'expenses', label: `Expenses (${projectExpenses.length})`, icon: Receipt },
    { id: 'daily-reports', label: `Daily Reports (${projectReports.length})`, icon: FileCheck2 },
    { id: 'documents', label: `Documents (${projectDocs.length})`, icon: FileText },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back button & Project Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <button
          onClick={closeProjectDetails}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 mb-4 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span>Back to All Projects</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {project.type}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  project.status === 'On Track'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : project.status === 'At Risk'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : project.status === 'Delayed'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {project.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {project.id}</span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {project.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Client: <strong className="text-slate-700">{project.client}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                PM: <strong className="text-slate-700">{project.projectManager}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenNewReport}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <FileCheck2 className="w-4 h-4" />
              + Daily Report
            </button>
            <button
              onClick={onOpenNewTask}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <CheckSquare className="w-4 h-4 text-amber-400" />
              + Task
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 border-t border-slate-100 mt-6 pt-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = projectDetailSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setProjectDetailSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {projectDetailSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Financial & Progress Metric Cards (Per Spec) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">Contract Budget</div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                €{project.budget.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Fixed-price commercial contract</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">Amount Spent</div>
              <div className="text-2xl font-black text-amber-700 font-mono">
                €{project.spent.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {spendPercent}% of total budget committed
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">Remaining Budget</div>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                €{remaining.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                Positive margin buffer preserved
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">Project Progress</div>
              <div className="text-2xl font-black text-slate-900">
                {project.progress}%
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Project Timeline & Upcoming Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  Project Timeline & Milestone Milestones
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  {project.startDate} → {project.expectedCompletion}
                </span>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 space-y-5 my-2">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div className="font-bold text-xs text-slate-800">
                    Phase 1: Mobilization & Site Groundwork (Completed)
                  </div>
                  <div className="text-xs text-slate-500">
                    Foundation piles driven, municipal permits approved, water drainage connected.
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-white animate-pulse" />
                  <div className="font-bold text-xs text-slate-900">
                    Phase 2: Structural Frame & Exterior Enclosure (Active - 68%)
                  </div>
                  <div className="text-xs text-slate-500">
                    Structural steel framing, curtain wall glazing, level 4 slab reinforcement.
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="font-bold text-xs text-slate-400">
                    Phase 3: MEP Installations & Interior Fit-out (Upcoming)
                  </div>
                  <div className="text-xs text-slate-400">
                    HVAC ductwork, AREI / RGIE electrical commissioning, acoustic ceiling panels.
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="font-bold text-xs text-slate-400">
                    Phase 4: Commissioning & Handover ({project.expectedCompletion})
                  </div>
                  <div className="text-xs text-slate-400">
                    Final municipal building inspection, snag list sign-off, client key handover.
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <Clock className="w-4 h-4 text-rose-500" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="font-bold text-amber-900">Concrete Slab Level 4 Inspection</div>
                  <div className="text-amber-700 text-[11px] mt-0.5">Due Oct 02, 2026 • Structural Engineer</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800">Facade Curtain Wall Delivery (Batch 2)</div>
                  <div className="text-slate-600 text-[11px] mt-0.5">Due Oct 05, 2026 • Saint-Gobain</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800">Monthly Client Progress Billing</div>
                  <div className="text-slate-600 text-[11px] mt-0.5">Due Oct 15, 2026 • Finance Dept</div>
                </div>
              </div>
            </div>
          </div>

          {/* Open Tasks & Recent Site Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Open Tasks */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Active Tasks on Site ({openTasks.length})
                </h3>
                <button
                  onClick={() => setProjectDetailSubTab('tasks')}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  Manage All
                </button>
              </div>

              {openTasks.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No open tasks for this project.</p>
              ) : (
                <div className="space-y-2">
                  {openTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          onClick={() => toggleTaskStatus(t.id)}
                          className="w-4 h-4 rounded border border-slate-300 hover:border-amber-500 flex items-center justify-center shrink-0"
                        >
                          {t.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-slate-800 truncate">{t.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {t.assignedEmployee} • Due: {t.dueDate}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
                          t.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : t.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Site Reports */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Recent Site Reports ({projectReports.length})
                </h3>
                <button
                  onClick={() => setProjectDetailSubTab('daily-reports')}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  View History
                </button>
              </div>

              {projectReports.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">
                  <p>No site reports logged yet for this site.</p>
                  <button
                    onClick={onOpenNewReport}
                    className="mt-2 text-xs font-semibold text-amber-600 hover:underline"
                  >
                    + Submit today's report
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {projectReports.map((rep) => (
                    <div
                      key={rep.id}
                      onClick={() => setSelectedReportId(rep.id)}
                      className="p-3 rounded-lg border border-slate-100 hover:border-amber-300 hover:bg-amber-50/20 cursor-pointer transition"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                        <span>Report: {rep.date}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          {rep.workersOnSite} workers on site
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{rep.workCompleted}</p>
                      <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
                        <span>Supervisor: {rep.siteManager}</span>
                        <span className="text-emerald-600 font-semibold">{rep.safetyIssues}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Expenses Ledger for this Project */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Project Expenses Ledger (€{project.spent.toLocaleString()} spent)
                </h3>
                <p className="text-xs text-slate-500">All supplier invoices, equipment rentals, and payroll charges</p>
              </div>
              <button
                onClick={onOpenNewExpense}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700"
              >
                + Record Expense
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Supplier</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {projectExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">{exp.date}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{exp.description}</td>
                      <td className="py-2.5 px-3 text-slate-600">{exp.supplier}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        €{exp.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
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
      )}

      {/* TAB 2: TASKS */}
      {projectDetailSubTab === 'tasks' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Project Tasks & Deadlines</h3>
              <p className="text-xs text-slate-500">Track and assign site deliverables for {project.name}</p>
            </div>
            <button
              onClick={onOpenNewTask}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {projectTasks.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    className="w-5 h-5 rounded border border-slate-300 hover:border-amber-500 flex items-center justify-center"
                  >
                    {t.status === 'Completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                  <div>
                    <div className={`text-sm font-semibold ${t.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                      <span>Assigned: <strong>{t.assignedEmployee}</strong> ({t.assignedEmployeeRole})</span>
                      <span>•</span>
                      <span>Due: <strong>{t.dueDate}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    t.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : t.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : t.status === 'Waiting'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WORKERS */}
      {projectDetailSubTab === 'workers' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Assigned Personnel & Trade Crew</h3>
              <p className="text-xs text-slate-500">Staff members currently deployed at {project.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectWorkers.map((w) => (
              <div key={w.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-slate-900">{w.name}</div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {w.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">{w.role}</div>
                <div className="text-xs text-slate-600 font-mono">{w.phone}</div>
                <div className="text-xs text-slate-600 pt-1 border-t border-slate-200/60 flex justify-between">
                  <span>Hours this week:</span>
                  <span className="font-bold text-slate-900">{w.hoursThisWeek} hrs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MATERIALS */}
      {projectDetailSubTab === 'materials' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Allocated Materials & Deliveries</h3>
              <p className="text-xs text-slate-500">Inventory earmarked for this construction site</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.slice(0, 6).map((m) => (
              <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{m.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    m.status === 'LOW STOCK' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">Supplier: {m.supplier}</div>
                <div className="text-xs font-mono font-semibold text-slate-800">
                  Stock: {m.currentStock} {m.unit} (Min: {m.minimumStock})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EXPENSES */}
      {projectDetailSubTab === 'expenses' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Project Expenses Ledger</h3>
              <p className="text-xs text-slate-500">Total recorded expenses for {project.name}: €{project.spent.toLocaleString()}</p>
            </div>
            <button
              onClick={onOpenNewExpense}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {projectExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-500">{exp.date}</td>
                    <td className="py-2.5 px-3">{exp.category}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{exp.description}</td>
                    <td className="py-2.5 px-3 text-slate-600">{exp.supplier}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">€{exp.amount.toLocaleString()}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {exp.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: DAILY REPORTS */}
      {projectDetailSubTab === 'daily-reports' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Site Daily Logs & Safety Compliance</h3>
              <p className="text-xs text-slate-500">Historical daily reports submitted by site managers</p>
            </div>
            <button
              onClick={onOpenNewReport}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Submit Report
            </button>
          </div>

          <div className="space-y-4">
            {projectReports.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedReportId(r.id)}
                className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 cursor-pointer transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-slate-900">
                    Report Date: {r.date} — Supervisor: {r.siteManager}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {r.workersOnSite} workers on site
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">Weather: {r.weather}</div>
                <div className="text-xs text-slate-700"><strong className="text-slate-900">Work Done:</strong> {r.workCompleted}</div>
                <div className="text-xs text-slate-700"><strong className="text-slate-900">Safety & Incidents:</strong> {r.safetyIssues}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: DOCUMENTS */}
      {projectDetailSubTab === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Project Documents & Drawings</h3>
              <p className="text-xs text-slate-500">Engineering drawings, building permits, safety plans</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projectDocs.map((doc) => (
              <div key={doc.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    {doc.fileType}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 truncate max-w-xs">{doc.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {doc.category} • {doc.fileSize} • Uploaded by {doc.uploadedBy}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Downloading verified document: ${doc.title}`)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
