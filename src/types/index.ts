export type NavigationTab =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'daily-reports'
  | 'workers'
  | 'subcontractors'
  | 'materials'
  | 'purchase-orders'
  | 'expenses'
  | 'documents'
  | 'reports'
  | 'settings';

export type ProjectStatus = 'On Track' | 'At Risk' | 'Delayed' | 'Completed';

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  projectManager: string;
  startDate: string;
  expectedCompletion: string;
  budget: number;
  spent: number;
  progress: number;
  status: ProjectStatus;
  description: string;
  type: 'Commercial' | 'Residential' | 'Industrial' | 'Renovation';
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Waiting' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  assignedEmployee: string;
  assignedEmployeeRole: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  description?: string;
  isOverdue?: boolean;
}

export interface DailyReport {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  siteManager: string;
  weather: string;
  workersOnSite: number;
  workCompleted: string;
  materialsUsed: string;
  equipmentUsed: string;
  problemsDelays: string;
  safetyIssues: string;
  notes: string;
  photos: string[];
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  currentProjectId: string;
  currentProjectName: string;
  hoursThisWeek: number;
  status: 'Active on Site' | 'Available' | 'On Leave' | 'Safety Standby';
  certifications: string[];
  hourlyRate: number;
}

export type SubcontractorTrade =
  | 'Electrical'
  | 'Plumbing'
  | 'Roofing'
  | 'HVAC'
  | 'Concrete'
  | 'Painting'
  | 'Scaffolding'
  | 'Earthwork';

export interface Subcontractor {
  id: string;
  company: string;
  contactPerson: string;
  trade: SubcontractorTrade;
  phone: string;
  email: string;
  projectId: string;
  projectName: string;
  contractValue: number;
  status: 'Active' | 'Pending Review' | 'Completed' | 'Contract Signed';
}

export interface Material {
  id: string;
  name: string;
  category: 'Structural' | 'Masonry' | 'Carpentry' | 'Insulation' | 'Electrical' | 'Plumbing' | 'Finishes';
  currentStock: number;
  minimumStock: number;
  unit: string;
  supplier: string;
  status: 'In Stock' | 'LOW STOCK' | 'Critical Low';
  location: string;
  unitPrice: number;
}

export interface PurchaseOrderItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  projectId: string;
  projectName: string;
  items: PurchaseOrderItem[];
  total: number;
  requestedBy: string;
  date: string;
  expectedDelivery: string;
  status: 'Pending' | 'Approved' | 'Ordered' | 'Delivered';
  notes?: string;
}

export type ExpenseCategory =
  | 'Materials'
  | 'Labor'
  | 'Equipment'
  | 'Subcontractors'
  | 'Transportation'
  | 'Other';

export interface Expense {
  id: string;
  date: string;
  projectId: string;
  projectName: string;
  category: ExpenseCategory;
  description: string;
  supplier: string;
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Processing';
  receiptRef?: string;
}

export type DocumentCategory =
  | 'Contracts'
  | 'Invoices'
  | 'Site Reports'
  | 'Purchase Orders'
  | 'Project Documents';

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  projectId?: string;
  projectName?: string;
  uploadedBy: string;
  date: string;
  fileSize: string;
  fileType: 'PDF' | 'DWG' | 'DOCX' | 'XLSX' | 'JPG';
}

export interface ActivityItem {
  id: string;
  type: 'report' | 'material' | 'worker' | 'expense' | 'task' | 'project';
  title: string;
  description: string;
  timestamp: string;
  projectId?: string;
  amount?: number;
}
