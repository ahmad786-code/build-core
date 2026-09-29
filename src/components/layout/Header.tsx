import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  HardHat,
  FileSpreadsheet,
  MessageSquare,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenNewReport?: () => void;
  onOpenNewTask?: () => void;
  onOpenNewExpense?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewReport,
  onOpenNewTask,
  onOpenNewExpense,
}) => {
  const {
    activeTab,
    selectedProjectId,
    projects,
    activities,
    globalSearchQuery,
    setGlobalSearchQuery,
    showDemoBanner,
    setShowDemoBanner,
    setActiveTab,
    openProjectDetails,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const currentProject = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId)
    : null;

  const getTabTitle = () => {
    if (selectedProjectId && currentProject) {
      return `Project: ${currentProject.name}`;
    }
    switch (activeTab) {
      case 'dashboard':
        return 'Executive Overview Dashboard';
      case 'projects':
        return 'Active Construction Projects (8)';
      case 'tasks':
        return 'Site Operations & Task Management';
      case 'daily-reports':
        return 'Daily Site Inspection & Progress Reports';
      case 'workers':
        return 'Workforce & Site Labor Management (45 Employees)';
      case 'subcontractors':
        return 'Subcontractors & Trade Partners';
      case 'materials':
        return 'Materials Inventory & Warehouse Stock';
      case 'purchase-orders':
        return 'Procurement & Purchase Orders';
      case 'expenses':
        return 'Project Cost Ledger & Expenses';
      case 'documents':
        return 'Construction Documents & Permits Vault';
      case 'reports':
        return 'Financial, Labor & Site Analytics';
      case 'settings':
        return 'System & Company Settings';
      default:
        return 'BuildCore Management';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      {/* Transformation Story / Demo Pitch Bar */}
      {showDemoBanner && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-amber-600/30">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Demo Showcase
            </span>
            <div className="flex items-center gap-2 text-slate-200 truncate font-medium">
              <span className="text-slate-400 line-through flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-rose-400 inline" /> 14 Disjointed Excel Sheets
              </span>
              <span className="text-slate-400">+</span>
              <span className="text-slate-400 line-through flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> Unstructured WhatsApp Chats
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-semibold">
                Replaced with One Centralized BuildCore Internal ERP
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('reports')}
              className="text-amber-400 hover:text-amber-300 underline font-semibold text-[11px]"
            >
              See Financial Profitability
            </button>
            <button
              onClick={() => setShowDemoBanner(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <div className="px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Current Page Title & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
              <span>BuildCore Construction Belgium</span>
              <span>/</span>
              <span className="capitalize font-medium text-slate-700">
                {selectedProjectId ? 'Projects' : activeTab.replace('-', ' ')}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate">
              {getTabTitle()}
            </h1>
          </div>
        </div>

        {/* Center: Quick Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects, tasks, workers, materials, POs..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
            />
            {globalSearchQuery && (
              <button
                onClick={() => setGlobalSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Actions & Notifications */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Action Button */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Quick Action</span>
            </button>

            {showQuickMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setShowQuickMenu(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Site Operations
                </div>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenNewReport?.();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2.5 transition"
                >
                  <FileCheck2 className="w-4 h-4 text-amber-600" />
                  + New Daily Site Report
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenNewTask?.();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2.5 transition"
                >
                  <Calendar className="w-4 h-4 text-blue-600" />
                  + Add Project Task
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenNewExpense?.();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2.5 transition"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  + Record Site Expense
                </button>
              </div>
            )}
          </div>

          {/* Activity / Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
              title="Recent Activity"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50"
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Recent Site Activity
                  </span>
                  <span className="text-[11px] text-amber-600 font-semibold">Live Feed</span>
                </div>
                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {activities.slice(0, 5).map((act) => (
                    <div key={act.id} className="text-xs border-b border-slate-50 pb-2 last:border-none">
                      <div className="font-semibold text-slate-800 flex items-center justify-between">
                        <span className="truncate">{act.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal shrink-0 ml-1">
                          {act.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {act.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Currency & Country pill */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Belgium</span>
            <span className="text-slate-300">|</span>
            <span className="font-mono font-bold text-slate-800">EUR (€)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
