/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';

// Main Views
import { DashboardView } from './components/dashboard/DashboardView';
import { ProjectsView } from './components/projects/ProjectsView';
import { ProjectDetailView } from './components/projects/ProjectDetailView';
import { TasksView } from './components/tasks/TasksView';
import { DailyReportsView } from './components/daily-reports/DailyReportsView';
import { WorkersView } from './components/workers/WorkersView';
import { SubcontractorsView } from './components/subcontractors/SubcontractorsView';
import { MaterialsView } from './components/materials/MaterialsView';
import { PurchaseOrdersView } from './components/purchase-orders/PurchaseOrdersView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { NewDailyReportModal } from './components/modals/NewDailyReportModal';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { NewExpenseModal } from './components/modals/NewExpenseModal';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { NewPurchaseOrderModal } from './components/modals/NewPurchaseOrderModal';
import { NewWorkerModal } from './components/modals/NewWorkerModal';
import { NewSubcontractorModal } from './components/modals/NewSubcontractorModal';
import { UploadDocumentModal } from './components/modals/UploadDocumentModal';

const AppContent: React.FC = () => {
  const { activeTab, selectedProjectId } = useApp();

  // Modal visibility states
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewPOOpen, setIsNewPOOpen] = useState(false);
  const [isNewWorkerOpen, setIsNewWorkerOpen] = useState(false);
  const [isNewSubcontractorOpen, setIsNewSubcontractorOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);

  const renderActiveView = () => {
    // If a project detail is selected, prioritize project workspace
    if (selectedProjectId) {
      return (
        <ProjectDetailView
          projectId={selectedProjectId}
          onOpenNewTask={() => setIsNewTaskOpen(true)}
          onOpenNewReport={() => setIsNewReportOpen(true)}
          onOpenNewExpense={() => setIsNewExpenseOpen(true)}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenNewReport={() => setIsNewReportOpen(true)}
            onOpenNewTask={() => setIsNewTaskOpen(true)}
            onOpenNewExpense={() => setIsNewExpenseOpen(true)}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            onOpenNewProject={() => setIsNewProjectOpen(true)}
          />
        );
      case 'tasks':
        return (
          <TasksView
            onOpenNewTask={() => setIsNewTaskOpen(true)}
          />
        );
      case 'daily-reports':
        return (
          <DailyReportsView
            onOpenNewReport={() => setIsNewReportOpen(true)}
          />
        );
      case 'workers':
        return (
          <WorkersView
            onOpenNewWorker={() => setIsNewWorkerOpen(true)}
          />
        );
      case 'subcontractors':
        return (
          <SubcontractorsView
            onOpenNewSubcontractor={() => setIsNewSubcontractorOpen(true)}
          />
        );
      case 'materials':
        return (
          <MaterialsView
            onOpenNewPO={() => setIsNewPOOpen(true)}
          />
        );
      case 'purchase-orders':
        return (
          <PurchaseOrdersView
            onOpenNewPO={() => setIsNewPOOpen(true)}
          />
        );
      case 'expenses':
        return (
          <ExpensesView
            onOpenNewExpense={() => setIsNewExpenseOpen(true)}
          />
        );
      case 'documents':
        return (
          <DocumentsView
            onOpenUploadModal={() => setIsUploadDocOpen(true)}
          />
        );
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onOpenNewReport={() => setIsNewReportOpen(true)}
            onOpenNewTask={() => setIsNewTaskOpen(true)}
            onOpenNewExpense={() => setIsNewExpenseOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          onOpenNewReport={() => setIsNewReportOpen(true)}
          onOpenNewTask={() => setIsNewTaskOpen(true)}
          onOpenNewExpense={() => setIsNewExpenseOpen(true)}
        />

        {/* Viewport Scroll Body */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* 3. Global Modals */}
      <NewDailyReportModal
        isOpen={isNewReportOpen}
        onClose={() => setIsNewReportOpen(false)}
        defaultProjectId={selectedProjectId || undefined}
      />

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        defaultProjectId={selectedProjectId || undefined}
      />

      <NewExpenseModal
        isOpen={isNewExpenseOpen}
        onClose={() => setIsNewExpenseOpen(false)}
        defaultProjectId={selectedProjectId || undefined}
      />

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
      />

      <NewPurchaseOrderModal
        isOpen={isNewPOOpen}
        onClose={() => setIsNewPOOpen(false)}
      />

      <NewWorkerModal
        isOpen={isNewWorkerOpen}
        onClose={() => setIsNewWorkerOpen(false)}
      />

      <NewSubcontractorModal
        isOpen={isNewSubcontractorOpen}
        onClose={() => setIsNewSubcontractorOpen(false)}
      />

      <UploadDocumentModal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
      />

      {/* 4. Global Toast System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
