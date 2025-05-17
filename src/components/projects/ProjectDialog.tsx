
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Project } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { formatISO } from 'date-fns';

const projectFormSchema = z.object({
  projectCode: z.string().min(2, {
    message: "Project code must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  clientName: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(['planning', 'design', 'development', 'testing', 'completed', 'onhold']),
  designerIds: z.array(z.string()).default([]),
  developerIds: z.array(z.string()).default([]),
  description: z.string().optional(),
});

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitData?: (data: Omit<Project, 'id'>) => void;
  project?: Project; // 추가: 기존 프로젝트 데이터 (수정 시)
}

const ProjectDialog: React.FC<ProjectDialogProps> = ({ isOpen, onClose, onSubmitData, project }) => {
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectCode: "",
      name: "",
      clientName: "",
      startDate: new Date(),
      endDate: new Date(),
      status: 'planning',
      designerIds: [],
      developerIds: [],
      description: "",
    },
  });

  // 프로젝트 데이터가 제공되면 폼 값 설정
  useEffect(() => {
    if (project) {
      form.reset({
        projectCode: project.projectCode,
        name: project.name,
        clientName: project.clientName,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
        status: project.status,
        designerIds: project.designerIds,
        developerIds: project.developerIds,
        description: project.description || "",
      });
    }
  }, [project, form]);

  const submitData = () => {
    if (!form.formState.isValid) return;

    const data = form.getValues();

    // 모든 필수 필드가 있는지 확인
    const formattedData = {
      projectCode: data.projectCode, // 필수 필드 명시적 할당
      name: data.name, // 필수 필드 명시적 할당
      clientName: data.clientName, // 필수 필드 명시적 할당
      startDate: formatISO(data.startDate, { representation: 'date' }),
      endDate: formatISO(data.endDate, { representation: 'date' }),
      status: data.status, // 필수 필드 명시적 할당
      designerIds: data.designerIds,
      developerIds: data.developerIds,
      description: data.description || "",
      createdBy: user ? user.name : "Unknown User",
    };

    if (onSubmitData) {
      onSubmitData(formattedData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project ? '프로젝트 수정' : '새 프로젝트'}</DialogTitle>
          <DialogDescription>
            {project ? '프로젝트를 수정하세요.' : '새 프로젝트를 추가하세요.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectCode" className="text-right">
              프로젝트 코드
            </Label>
            <Input id="projectCode"  className="col-span-3"  {...form.register("projectCode")} />
            {form.formState.errors.projectCode && (
              <p className="col-span-4 text-sm text-red-500">{form.formState.errors.projectCode.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              프로젝트명
            </Label>
            <Input id="name"  className="col-span-3" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="col-span-4 text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientName" className="text-right">
              클라이언트명
            </Label>
            <Input id="clientName"  className="col-span-3" {...form.register("clientName")} />
            {form.formState.errors.clientName && (
              <p className="col-span-4 text-sm text-red-500">{form.formState.errors.clientName.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              시작일
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !form.getValues("startDate") && "text-muted-foreground"
                  )}
                >
                  {form.getValues("startDate") ? (
                    format(form.getValues("startDate"), "yyyy-MM-dd")
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.getValues("startDate")}
                  onSelect={(date) => form.setValue("startDate", date!)}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              마감일
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !form.getValues("endDate") ? "text-muted-foreground" : ""
                  )}
                >
                  {form.getValues("endDate") ? (
                    format(form.getValues("endDate"), "yyyy-MM-dd")
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.getValues("endDate")}
                  onSelect={(date) => form.setValue("endDate", date!)}
                  disabled={(date) =>
                    date < form.getValues("startDate")!
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={submitData}>{project ? '수정' : '저장'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
