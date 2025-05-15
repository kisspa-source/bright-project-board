
export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  email: string;
  avatarUrl?: string;
}

export type ProjectStatus = 'planning' | 'design' | 'development' | 'testing' | 'completed' | 'onhold';

export interface Project {
  id: string;
  projectCode: string;
  name: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  designerIds: string[];
  developerIds: string[];
  createdBy: string;
  description?: string;
}

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies?: string;
  type?: string;
  project?: string;
  status?: ProjectStatus;
}

export interface FilterOptions {
  client?: string;
  status?: ProjectStatus;
  dateRange?: {
    start: string;
    end: string;
  };
  assignee?: string;
}

export interface DashboardStats {
  totalProjects: number;
  inProgressProjects: number;
  completedProjects: number;
  clientCount: number;
}
