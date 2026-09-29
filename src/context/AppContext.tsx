import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavigationTab,
  Project,
  Task,
  DailyReport,
  Worker,
  Subcontractor,
  Material,
  PurchaseOrder,
  Expense,
  DocumentItem,
  ActivityItem,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_DAILY_REPORTS,
  INITIAL_WORKERS,
  INITIAL_SUBCONTRACTORS,
  INITIAL_MATERIALS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EXPENSES,
  INITIAL_DOCUMENTS,
  INITIAL_ACTIVITIES,
} from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedProjectId: string | null;
  projectDetailSubTab: string;
  setProjectDetailSubTab: (tab: string) => void;
  openProjectDetails: (projectId: string, subTab?: string) => void;
  closeProjectDetails: () => void;
  
  selectedWorkerId: string | null;
  setSelectedWorkerId: (id: string | null) => void;

  selectedPOId: string | null;
  setSelectedPOId: (id: string | null) => void;

  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;

  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  showDemoBanner: boolean;
  setShowDemoBanner: (show: boolean) => void;

  projects: Project[];
  tasks: Task[];
  dailyReports: DailyReport[];
  workers: Worker[];
  subcontractors: Subcontractor[];
  materials: Material[];
  purchaseOrders: PurchaseOrder[];
  expenses: Expense[];
  documents: DocumentItem[];
  activities: ActivityItem[];
  toasts: Toast[];

  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  addDailyReport: (report: Omit<DailyReport, 'id'>) => void;
  addWorker: (worker: Omit<Worker, 'id'>) => void;
  updateWorker: (id: string, updates: Partial<Worker>) => void;
  addSubcontractor: (sub: Omit<Subcontractor, 'id'>) => void;
  updateMaterialStock: (id: string, newStock: number) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  updatePOStatus: (id: string, status: PurchaseOrder['status']) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addDocument: (doc: Omit<DocumentItem, 'id'>) => void;
  resetToDemoData: () => void;
  notify: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'buildcore_belgium_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectDetailSubTab, setProjectDetailSubTab] = useState<string>('overview');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [selectedPOId, setSelectedPOId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [showDemoBanner, setShowDemoBanner] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persistent state initialized from localStorage or defaults
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + 'projects');
      return stored ? JSON.parse(stored) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + 'tasks');
      return stored ? JSON.parse(stored) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [dailyReports, setDailyReports] = useState<DailyReport[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + 'dailyReports');
      return stored ? JSON.parse(stored) : INITIAL_DAILY_REPORTS;
    } catch {
      return INITIAL_DAILY_REPORTS;
    }
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + 'workers');
      return stored ? JSON.parse(stored) : INITIAL_WORKERS;
    } catch {
      return INITIAL_WORKERS;
    }
  });

  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + 'subcontractors');
      return stored ? JSON.parse(stored) : INITIAL_SUBCONTRACTORS;
    } catch {
      return INITIAL_SUBCONTRACTORS;
    }
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + 'materials');
      return stored ? JSON.parse(stored) : INITIAL_MATERIALS;
    } catch {
      return INITIAL_MATERIALS;
    }
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + 'purchaseOrders');
      return stored ? JSON.parse(stored) : INITIAL_PURCHASE_ORDERS;
    } catch {
      return INITIAL_PURCHASE_ORDERS;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + 'expenses');
      return stored ? JSON.parse(stored) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + 'documents');
      return stored ? JSON.parse(stored) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'projects', JSON.stringify(projects));
    } catch (e) {
      console.warn('localStorage save failed', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('localStorage save failed', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'dailyReports', JSON.stringify(dailyReports));
    } catch (e) {
      console.warn('localStorage save failed', e);
    }
  }, [dailyReports]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'expenses', JSON.stringify(expenses));
    } catch (e) {
      console.warn('localStorage save failed', e);
    }
  }, [expenses]);

  const notify = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openProjectDetails = (projectId: string, subTab: string = 'overview') => {
    setSelectedProjectId(projectId);
    setProjectDetailSubTab(subTab);
    setActiveTab('projects');
  };

  const closeProjectDetails = () => {
    setSelectedProjectId(null);
  };

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newId = 'proj-' + (projects.length + 1);
    const newProject: Project = { ...projectData, id: newId };
    setProjects((prev) => [newProject, ...prev]);
    
    // Log activity
    const newAct: ActivityItem = {
      id: 'act-' + Date.now(),
      type: 'project',
      title: `Project initialized: ${newProject.name}`,
      description: `Contract value €${newProject.budget.toLocaleString()} assigned to ${newProject.projectManager}`,
      timestamp: 'Just now',
      projectId: newId,
    };
    setActivities((prev) => [newAct, ...prev]);
    notify(`Project "${newProject.name}" created successfully`);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    notify('Project details updated');
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newId = 'task-' + (tasks.length + 1);
    const newTask: Task = { ...taskData, id: newId };
    setTasks((prev) => [newTask, ...prev]);

    const newAct: ActivityItem = {
      id: 'act-' + Date.now(),
      type: 'task',
      title: `Task assigned: ${newTask.name}`,
      description: `Assigned to ${newTask.assignedEmployee} (${newTask.projectName}) - Due: ${newTask.dueDate}`,
      timestamp: 'Just now',
      projectId: newTask.projectId,
    };
    setActivities((prev) => [newAct, ...prev]);
    notify(`Task "${newTask.name}" added`);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    notify('Task updated');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    notify('Task deleted', 'info');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus: Task['status'] =
            t.status === 'Completed'
              ? 'To Do'
              : t.status === 'To Do'
              ? 'In Progress'
              : t.status === 'In Progress'
              ? 'Waiting'
              : 'Completed';
          
          if (nextStatus === 'Completed') {
            const newAct: ActivityItem = {
              id: 'act-' + Date.now(),
              type: 'task',
              title: `Task marked completed: ${t.name}`,
              description: `Completed by ${t.assignedEmployee} on ${t.projectName}`,
              timestamp: 'Just now',
              projectId: t.projectId,
            };
            setActivities((prevAct) => [newAct, ...prevAct]);
            notify(`Task "${t.name}" marked completed!`);
          } else {
            notify(`Task status moved to: ${nextStatus}`, 'info');
          }
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const addDailyReport = (reportData: Omit<DailyReport, 'id'>) => {
    const newId = 'rep-' + (dailyReports.length + 1);
    const newReport: DailyReport = { ...reportData, id: newId };
    setDailyReports((prev) => [newReport, ...prev]);

    const newAct: ActivityItem = {
      id: 'act-' + Date.now(),
      type: 'report',
      title: `Site report submitted for ${newReport.projectName}`,
      description: `${newReport.siteManager} logged ${newReport.workersOnSite} workers on site.`,
      timestamp: 'Just now',
      projectId: newReport.projectId,
    };
    setActivities((prev) => [newAct, ...prev]);
    notify(`Daily Site Report for ${newReport.projectName} logged successfully!`);
  };

  const addWorker = (workerData: Omit<Worker, 'id'>) => {
    const newId = 'w-' + (workers.length + 1);
    const newWorker: Worker = { ...workerData, id: newId };
    setWorkers((prev) => [...prev, newWorker]);
    
    const newAct: ActivityItem = {
      id: 'act-' + Date.now(),
      type: 'worker',
      title: `Worker onboarded: ${newWorker.name}`,
      description: `${newWorker.role} deployed to ${newWorker.currentProjectName}`,
      timestamp: 'Just now',
    };
    setActivities((prev) => [newAct, ...prev]);
    notify(`Worker ${newWorker.name} added to roster`);
  };

  const updateWorker = (id: string, updates: Partial<Worker>) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
    notify('Worker profile updated');
  };

  const addSubcontractor = (subData: Omit<Subcontractor, 'id'>) => {
    const newId = 'sub-' + (subcontractors.length + 1);
    const newSub: Subcontractor = { ...subData, id: newId };
    setSubcontractors((prev) => [...prev, newSub]);
    notify(`Subcontractor "${newSub.company}" added`);
  };

  const updateMaterialStock = (id: string, newStock: number) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const status: Material['status'] =
            newStock <= m.minimumStock * 0.5
              ? 'Critical Low'
              : newStock <= m.minimumStock
              ? 'LOW STOCK'
              : 'In Stock';
          return { ...m, currentStock: newStock, status };
        }
        return m;
      })
    );
    notify('Material stock level updated');
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id'>) => {
    const newId = 'po-' + (purchaseOrders.length + 1);
    const newPO: PurchaseOrder = { ...poData, id: newId };
    setPurchaseOrders((prev) => [newPO, ...prev]);

    const newAct: ActivityItem = {
      id: 'act-' + Date.now(),
      type: 'material',
      title: `Purchase Order created: ${newPO.poNumber}`,
      description: `${newPO.supplier} for ${newPO.projectName} - Total €${newPO.total.toLocaleString()}`,
      timestamp: 'Just now',
      projectId: newPO.projectId,
      amount: newPO.total,
    };
    setActivities((prev) => [newAct, ...prev]);
    notify(`Purchase Order ${newPO.poNumber} created`);
  };

  const updatePOStatus = (id: string, status: PurchaseOrder['status']) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === id) {
          if (status === 'Approved') {
            const newAct: ActivityItem = {
              id: 'act-' + Date.now(),
              type: 'material',
              title: `Material request approved: ${po.poNumber}`,
              description: `PO for ${po.supplier} approved for €${po.total.toLocaleString()}`,
              timestamp: 'Just now',
              projectId: po.projectId,
              amount: po.total,
            };
            setActivities((prevAct) => [newAct, ...prevAct]);
          }
          return { ...po, status };
        }
        return po;
      })
    );
    notify(`PO status updated to ${status}`);
  };

  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newId = 'exp-' + (expenses.length + 1);
    const newExp: Expense = { ...expData, id: newId };
    setExpenses((prev) => [newExp, ...prev]);

    // Also update project spent
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === newExp.projectId) {
          const newSpent = p.spent + newExp.amount;
          return { ...p, spent: newSpent };
        }
        return p;
      })
    );

    const newAct: ActivityItem = {
      id: 'act-' + Date.now(),
      type: 'expense',
      title: `Expense of €${newExp.amount.toLocaleString()} recorded`,
      description: `${newExp.supplier} - ${newExp.description} (${newExp.projectName})`,
      timestamp: 'Just now',
      projectId: newExp.projectId,
      amount: newExp.amount,
    };
    setActivities((prev) => [newAct, ...prev]);
    notify(`Expense of €${newExp.amount.toLocaleString()} recorded`);
  };

  const addDocument = (docData: Omit<DocumentItem, 'id'>) => {
    const newId = 'doc-' + (documents.length + 1);
    const newDoc: DocumentItem = { ...docData, id: newId };
    setDocuments((prev) => [newDoc, ...prev]);
    notify(`Document "${newDoc.title}" archived`);
  };

  const resetToDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'projects');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'tasks');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'dailyReports');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'workers');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'subcontractors');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'materials');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'purchaseOrders');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'expenses');
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'documents');
    } catch {}
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setDailyReports(INITIAL_DAILY_REPORTS);
    setWorkers(INITIAL_WORKERS);
    setSubcontractors(INITIAL_SUBCONTRACTORS);
    setMaterials(INITIAL_MATERIALS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setExpenses(INITIAL_EXPENSES);
    setDocuments(INITIAL_DOCUMENTS);
    setActivities(INITIAL_ACTIVITIES);
    notify('Demo dataset reset to initial state', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProjectId,
        projectDetailSubTab,
        setProjectDetailSubTab,
        openProjectDetails,
        closeProjectDetails,
        selectedWorkerId,
        setSelectedWorkerId,
        selectedPOId,
        setSelectedPOId,
        selectedReportId,
        setSelectedReportId,
        globalSearchQuery,
        setGlobalSearchQuery,
        showDemoBanner,
        setShowDemoBanner,
        projects,
        tasks,
        dailyReports,
        workers,
        subcontractors,
        materials,
        purchaseOrders,
        expenses,
        documents,
        activities,
        toasts,
        addProject,
        updateProject,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        addDailyReport,
        addWorker,
        updateWorker,
        addSubcontractor,
        updateMaterialStock,
        addPurchaseOrder,
        updatePOStatus,
        addExpense,
        addDocument,
        resetToDemoData,
        notify,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
