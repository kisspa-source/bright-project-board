// User types
export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  email: string;
  avatarUrl: string;
}

// Project types
export interface Project {
  id: string;
  projectCode: string;
  name: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'design' | 'development' | 'testing' | 'completed' | 'onhold';
  designerIds: string[];
  developerIds: string[];
  createdBy: string;
  description: string;
}

// Gantt chart task types
export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies?: string;
  type?: 'task' | 'milestone' | 'project';
  project: string;
  status?: 'planning' | 'design' | 'development' | 'testing' | 'completed' | 'onhold';
  assignee?: string;
}

// Filter options type
export interface FilterOptions {
  client?: string;
  status?: 'planning' | 'design' | 'development' | 'testing' | 'completed' | 'onhold';
  dateRange?: {
    start: Date;
    end: Date;
  };
  assignee?: string;
}

// Dashboard stats type
export interface DashboardStats {
  totalProjects: number;
  inProgressProjects: number;
  completedProjects: number;
  clientCount: number;
}
