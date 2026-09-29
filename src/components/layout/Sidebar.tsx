import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  ClipboardList,
  Users,
  Building2,
  Package,
  ShoppingCart,
  Receipt,
  FileText,
  BarChart3,
  Settings,
  HardHat,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, selectedProjectId, closeProjectDetails, tasks, materials, purchaseOrders } = useApp();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const lowStockCount = materials.filter((m) => m.status === 'LOW STOCK' || m.status === 'Critical Low').length;
  const pendingPOCount = purchaseOrders.filter((po) => po.status === 'Pending').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: '8' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'daily-reports', label: 'Daily Site Reports', icon: ClipboardList },
    { id: 'workers', label: 'Workers', icon: Users, badge: '45' },
    { id: 'subcontractors', label: 'Subcontractors', icon: Building2 },
    { id: 'materials', label: 'Materials', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined, badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart, badge: pendingPOCount > 0 ? pendingPOCount : undefined, badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    if (selectedProjectId) {
      closeProjectDetails();
    }
    setActiveTab(tabId);
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            <HardHat className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              BuildCore
              <span className="text-[10px] uppercase font-semibold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                ERP
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span>Belgium</span>
              <span>•</span>
              <span className="text-amber-400 font-mono font-medium">EUR (€)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm shadow-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400 group-hover:text-amber-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-slate-950/20 text-slate-950'
                      : item.badgeColor || 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Summary Pill */}
      <div className="px-3 pb-2">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5 text-xs text-slate-400">
          <div className="flex justify-between items-center mb-1 text-slate-300">
            <span className="font-medium">Company Status</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sites (8)
            </span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Staff Deployed:</span>
            <span className="font-semibold text-slate-200">45 Active</span>
          </div>
        </div>
      </div>

      {/* User & Company Identity Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-800/60 hover:border-slate-700 transition">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-inner">
              BC
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white tracking-tight leading-none truncate">
                BuildCore Construction Belgium
              </div>
              <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1 mt-1 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Admin User
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
