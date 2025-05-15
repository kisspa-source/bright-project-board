
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Project, ProjectStatus, User } from "@/types";
import { useProjects } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { users } from "@/data/mockData";

interface ProjectDialogProps {
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "기획 중" },
  { value: "design", label: "설계 중" },
  { value: "development", label: "개발 중" },
  { value: "testing", label: "테스트 중" },
  { value: "completed", label: "완료" },
  { value: "onhold", label: "보류" },
];

const ProjectDialog: React.FC<ProjectDialogProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { addProject, updateProject } = useProjects();

  // Filter users by role
  const designers = users.filter((u) => u.id !== user?.id);
  const developers = users.filter((u) => u.id !== user?.id);

  const [formData, setFormData] = useState<{
    projectCode: string;
    name: string;
    clientName: string;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
    designerIds: string[];
    developerIds: string[];
    description?: string;
  }>(
    project
      ? { ...project }
      : {
          projectCode: "",
          name: "",
          clientName: "",
          startDate: "",
          endDate: "",
          status: "planning",
          designerIds: [],
          developerIds: [],
          description: "",
        }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for the field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for the field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleMultiSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[name as keyof typeof prev] as string[];
      const isArray = Array.isArray(currentValues);
      
      if (isArray) {
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [name]: currentValues.filter((id) => id !== value),
          };
        } else {
          return {
            ...prev,
            [name]: [...currentValues, value],
          };
        }
      }
      
      return prev;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.projectCode) {
      newErrors.projectCode = "프로젝트 코드는 필수입니다";
    }
    
    if (!formData.name) {
      newErrors.name = "프로젝트 이름은 필수입니다";
    }
    
    if (!formData.clientName) {
      newErrors.clientName = "고객사명은 필수입니다";
    }
    
    if (!formData.startDate) {
      newErrors.startDate = "시작일은 필수입니다";
    }
    
    if (!formData.endDate) {
      newErrors.endDate = "종료일은 필수입니다";
    } else if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "종료일은 시작일 이후여야 합니다";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    if (user) {
      if (project) {
        // Update existing project
        updateProject(project.id, formData);
      } else {
        // Create new project
        addProject({
          ...formData,
          createdBy: user.id,
        });
      }
      
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {project ? "프로젝트 수정" : "새 프로젝트"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="projectCode">
              프로젝트 코드 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="projectCode"
              name="projectCode"
              value={formData.projectCode}
              onChange={handleChange}
              className={errors.projectCode ? "border-red-500" : ""}
            />
            {errors.projectCode && (
              <p className="text-xs text-red-500">{errors.projectCode}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              프로젝트명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">
              고객사명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className={errors.clientName ? "border-red-500" : ""}
            />
            {errors.clientName && (
              <p className="text-xs text-red-500">{errors.clientName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">상태</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleSelectChange("status", value as ProjectStatus)
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">
              시작일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && (
              <p className="text-xs text-red-500">{errors.startDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">
              종료일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className={errors.endDate ? "border-red-500" : ""}
            />
            {errors.endDate && (
              <p className="text-xs text-red-500">{errors.endDate}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="designers">설계자</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {designers.map((designer) => (
                <Button
                  key={designer.id}
                  type="button"
                  size="sm"
                  variant={
                    formData.designerIds.includes(designer.id)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleMultiSelectChange("designerIds", designer.id)}
                  className="mb-1"
                >
                  {designer.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="developers">개발자</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {developers.map((developer) => (
                <Button
                  key={developer.id}
                  type="button"
                  size="sm"
                  variant={
                    formData.developerIds.includes(developer.id)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleMultiSelectChange("developerIds", developer.id)}
                  className="mb-1"
                >
                  {developer.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit}>
            {project ? "수정" : "추가"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
