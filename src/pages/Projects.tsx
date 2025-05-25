import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectForm } from '../components/projects/ProjectForm';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { NewProject } from '../lib/api/projects';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, AlertCircle, Plus, Search } from 'lucide-react';

const Projects = () => {
  const { user } = useAuth();
  const { projects, isLoading, error, addProject } = useProjects();
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateProject = async (data: Omit<NewProject, 'created_by'>) => {
    if (!user) return;
    
    const newProject = {
      ...data,
      created_by: user.id
    };
    
    await addProject(newProject);
  };

  // 프로젝트 필터링
  const filteredProjects = projects.filter(project => {
    const query = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      project.code.toLowerCase().includes(query) ||
      project.client.toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">내 프로젝트</h1>
          <p className="text-gray-500 mt-1">모든 프로젝트를 관리하세요.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="프로젝트 검색..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsProjectFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            새 프로젝트
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2">프로젝트 로딩 중...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            프로젝트를 불러오는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.
          </AlertDescription>
        </Alert>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : searchQuery ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">
            "{searchQuery}" 검색 결과가 없습니다.
          </p>
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-gray-500 mb-4">
            아직 프로젝트가 없습니다. 새 프로젝트를 생성해 보세요!
          </p>
          <Button onClick={() => setIsProjectFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            새 프로젝트 생성하기
          </Button>
        </Card>
      )}
      
      <ProjectForm
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        onSubmit={handleCreateProject}
      />
    </Layout>
  );
};

export default Projects;
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import ProjectList from "@/components/projects/ProjectList";
import ProjectDialog from "@/components/projects/ProjectDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ProjectStatus } from "@/types";

const statusOptions: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "모든 상태" },
  { value: "planning", label: "기획 중" },
  { value: "design", label: "설계 중" },
  { value: "development", label: "개발 중" },
  { value: "testing", label: "테스트 중" },
  { value: "completed", label: "완료" },
  { value: "onhold", label: "보류" },
];

const Projects: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { projects, deleteProject, loading } = useProjects();
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredProjects = projects.filter((project) => {
    // Apply status filter
    if (statusFilter !== "all" && project.status !== statusFilter) {
      return false;
    }

    // Apply search term filter (project name, client, or project code)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.name.toLowerCase().includes(searchLower) ||
        project.clientName.toLowerCase().includes(searchLower) ||
        project.projectCode.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
  };

  const handleViewProject = (project: { id: string }) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">프로젝트</h2>
          <p className="text-muted-foreground">
            프로젝트 목록을 관리하고 일정을 확인하세요
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          새 프로젝트
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="프로젝트 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as ProjectStatus | "all")}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="상태로 필터링" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ProjectList
        projects={filteredProjects}
        onDelete={handleDeleteProject}
        onView={handleViewProject}
      />

      <ProjectDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default Projects;
