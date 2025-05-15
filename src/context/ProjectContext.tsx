
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, FilterOptions, GanttTask } from '../types';
import { projects as mockProjects, ganttTasks as mockGanttTasks } from '../data/mockData';
import { toast } from "sonner";

interface ProjectContextType {
  projects: Project[];
  ganttTasks: GanttTask[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updatedProject: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  filterProjects: (options: FilterOptions) => Project[];
  updateGanttTask: (taskId: string, updates: Partial<GanttTask>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with mock data
  useEffect(() => {
    try {
      // In a real app, this would be an API call
      setProjects(mockProjects);
      setGanttTasks(mockGanttTasks);
      setLoading(false);
    } catch (err) {
      setError('Failed to load projects');
      setLoading(false);
    }
  }, []);

  const addProject = (project: Omit<Project, 'id'>) => {
    try {
      const newProject: Project = {
        ...project,
        id: Date.now().toString(), // Generate a simple ID
      };
      setProjects([...projects, newProject]);
      
      // Create gantt task for the new project
      const newGanttTask: GanttTask = {
        id: newProject.id,
        name: newProject.name,
        start: new Date(newProject.startDate),
        end: new Date(newProject.endDate),
        progress: 0,
        project: newProject.id,
        status: newProject.status,
      };
      setGanttTasks([...ganttTasks, newGanttTask]);
      
      toast.success("프로젝트가 추가되었습니다.");
    } catch (err) {
      setError('Failed to add project');
      toast.error("프로젝트 추가 실패");
    }
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    try {
      const updatedProjects = projects.map(project => 
        project.id === id ? { ...project, ...updatedProject } : project
      );
      setProjects(updatedProjects);

      // Update main gantt task if dates or status changed
      if (updatedProject.startDate || updatedProject.endDate || updatedProject.status || updatedProject.name) {
        const updatedGanttTasks = ganttTasks.map(task => {
          if (task.id === id) {
            const updates: Partial<GanttTask> = {};
            if (updatedProject.name) updates.name = updatedProject.name;
            if (updatedProject.startDate) updates.start = new Date(updatedProject.startDate);
            if (updatedProject.endDate) updates.end = new Date(updatedProject.endDate);
            if (updatedProject.status) updates.status = updatedProject.status;
            return { ...task, ...updates };
          }
          return task;
        });
        setGanttTasks(updatedGanttTasks);
      }
      
      toast.success("프로젝트가 업데이트되었습니다.");
    } catch (err) {
      setError('Failed to update project');
      toast.error("프로젝트 업데이트 실패");
    }
  };

  const deleteProject = (id: string) => {
    try {
      setProjects(projects.filter(project => project.id !== id));
      setGanttTasks(ganttTasks.filter(task => task.project !== id));
      toast.success("프로젝트가 삭제되었습니다.");
    } catch (err) {
      setError('Failed to delete project');
      toast.error("프로젝트 삭제 실패");
    }
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const filterProjects = (options: FilterOptions): Project[] => {
    return projects.filter(project => {
      // Filter by client
      if (options.client && project.clientName !== options.client) {
        return false;
      }
      
      // Filter by status
      if (options.status && project.status !== options.status) {
        return false;
      }
      
      // Filter by date range
      if (options.dateRange) {
        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);
        const filterStart = new Date(options.dateRange.start);
        const filterEnd = new Date(options.dateRange.end);
        
        if (projectEnd < filterStart || projectStart > filterEnd) {
          return false;
        }
      }
      
      // Filter by assignee
      if (options.assignee) {
        const isDesigner = project.designerIds.includes(options.assignee);
        const isDeveloper = project.developerIds.includes(options.assignee);
        if (!isDesigner && !isDeveloper) {
          return false;
        }
      }
      
      return true;
    });
  };

  const updateGanttTask = (taskId: string, updates: Partial<GanttTask>) => {
    try {
      const updatedTasks = ganttTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      setGanttTasks(updatedTasks);

      // Update project if this is a main project task
      const task = ganttTasks.find(t => t.id === taskId);
      const projectId = task?.id;
      
      if (projectId && projects.some(p => p.id === projectId)) {
        const updatedProject: Partial<Project> = {};
        if (updates.start) updatedProject.startDate = updates.start.toISOString().split('T')[0];
        if (updates.end) updatedProject.endDate = updates.end.toISOString().split('T')[0];
        if (updates.status) updatedProject.status = updates.status;
        
        if (Object.keys(updatedProject).length > 0) {
          updateProject(projectId, updatedProject);
        }
      }
    } catch (err) {
      setError('Failed to update task');
      toast.error("태스크 업데이트 실패");
    }
  };

  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        ganttTasks, 
        loading, 
        error, 
        addProject, 
        updateProject, 
        deleteProject, 
        getProjectById, 
        filterProjects,
        updateGanttTask
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
