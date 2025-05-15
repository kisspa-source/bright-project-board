
import React, { useState } from "react";
import { Project } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import ProjectDialog from "./ProjectDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getUsersByIds } from "@/data/mockData";

interface ProjectListProps {
  projects: Project[];
  onDelete: (id: string) => void;
  onView?: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onDelete,
  onView,
}) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleDeleteClick = (projectId: string) => {
    setDeleteProjectId(projectId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteProjectId) {
      onDelete(deleteProjectId);
      setDeleteConfirmOpen(false);
      setDeleteProjectId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">등록된 프로젝트가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>프로젝트 코드</TableHead>
              <TableHead>프로젝트명</TableHead>
              <TableHead>고객사</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>기간</TableHead>
              <TableHead>참여인원</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const teamMembers = [
                ...getUsersByIds(project.designerIds),
                ...getUsersByIds(project.developerIds),
              ];

              return (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    {project.projectCode}
                  </TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.clientName}</TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>
                    {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {teamMembers.slice(0, 3).map((member) => (
                        <span
                          key={member.id}
                          className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                          title={member.name}
                        >
                          {member.name.charAt(0)}
                        </span>
                      ))}
                      {teamMembers.length > 3 && (
                        <span className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                          +{teamMembers.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(project)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {editingProject && (
        <ProjectDialog
          project={editingProject}
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
        />
      )}

      <AlertDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>프로젝트 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 프로젝트를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectList;
