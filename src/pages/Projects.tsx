
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

const statusOptions: { value: ProjectStatus | ""; label: string }[] = [
  { value: "", label: "모든 상태" },
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
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "">("");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredProjects = projects.filter((project) => {
    // Apply status filter
    if (statusFilter && project.status !== statusFilter) {
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
          onValueChange={(value) => setStatusFilter(value as ProjectStatus | "")}
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
