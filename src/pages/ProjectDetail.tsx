import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ProjectForm } from '../components/projects/ProjectForm';
import { getProjectById, updateProject, Project } from '../lib/api/projects';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { 
  CalendarDays, 
  Users, 
  ListTodo, 
  Settings, 
  Edit, 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 프로젝트 상태 텍스트 변환
const getStatusText = (status: string) => {
  switch (status) {
    case 'PLANNING':
      return '기획 중';
    case 'IN_PROGRESS':
      return '진행 중';
    case 'COMPLETED':
      return '완료됨';
    case 'ON_HOLD':
      return '보류 중';
    default:
      return status;
  }
};

// 프로젝트 상태에 따른 배지 색상 결정
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'PLANNING':
      return 'secondary';
    case 'IN_PROGRESS':
      return 'default';
    case 'COMPLETED':
      return 'success';
    case 'ON_HOLD':
      return 'destructive';
    default:
      return 'outline';
  }
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProject: updateProjectInContext } = useProjects();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getProjectById(id);
        
        if (error) {
          throw new Error('프로젝트를 불러오는 중 오류가 발생했습니다.');
        }
        
        if (!data) {
          throw new Error('프로젝트를 찾을 수 없습니다.');
        }
        
        setProject(data);
      } catch (err) {
        console.error('프로젝트 상세 조회 오류:', err);
        setError(err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);
  
  const handleProjectUpdate = async (updatedData: Partial<Project>) => {
    if (!id || !project) return;
    
    try {
      const { data, error } = await updateProject(id, updatedData);
      
      if (error) {
        throw new Error('프로젝트 업데이트 중 오류가 발생했습니다.');
      }
      
      setProject(data);
      updateProjectInContext(id, updatedData);
    } catch (err) {
      console.error('프로젝트 업데이트 오류:', err);
      throw err;
    }
  };
  
  const isCreator = user?.id === project?.created_by;
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2">프로젝트 불러오는 중...</span>
        </div>
      </Layout>
    );
  }
  
  if (error || !project) {
    return (
      <Layout>
        <div className="mb-4">
          <Button variant="outline" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            프로젝트 목록으로
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || '프로젝트를 찾을 수 없습니다.'}
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            프로젝트 목록으로
          </Button>
          
          {isCreator && (
            <Button onClick={() => setIsEditFormOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              프로젝트 편집
            </Button>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{project.name}</CardTitle>
                  <Badge variant={getStatusBadgeVariant(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                </div>
                <p className="text-gray-500">{project.code}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Building className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium">고객사</h3>
                  <p>{project.client}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CalendarDays className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium">프로젝트 기간</h3>
                  <p>
                    {format(new Date(project.start_date), 'yyyy년 MM월 dd일', { locale: ko })}
                    {' ~ '}
                    {format(new Date(project.end_date), 'yyyy년 MM월 dd일', { locale: ko })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tasks">
        <TabsList className="mb-4">
          <TabsTrigger value="tasks">
            <ListTodo className="h-4 w-4 mr-2" />
            작업
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            팀원
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            설정
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>작업 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">아직 등록된 작업이 없습니다.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>팀원 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">아직 등록된 팀원이 없습니다.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>프로젝트 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">프로젝트 설정 기능은 개발 중입니다.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <ProjectForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSubmit={handleProjectUpdate}
        initialData={project}
        title="프로젝트 수정"
      />
    </Layout>
  );
};

export default ProjectDetail;
import React, { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import { getUserById, getUsersByIds } from "@/data/mockData";
import { Edit, ArrowLeft, Trash2 } from "lucide-react";
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
import ProjectDialog from "@/components/projects/ProjectDialog";
import GanttChart from "@/components/charts/GanttChart";
import { GanttTask } from "@/types";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, ganttTasks, deleteProject, loading } = useProjects();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">프로젝트를 찾을 수 없습니다</h2>
        <Button onClick={() => navigate("/projects")}>프로젝트 목록으로</Button>
      </div>
    );
  }

  const handleDeleteProject = () => {
    deleteProject(project.id);
    navigate("/projects");
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  const creator = getUserById(project.createdBy);
  const designers = getUsersByIds(project.designerIds);
  const developers = getUsersByIds(project.developerIds);

  // Filter tasks for this project
  const projectTasks: GanttTask[] = ganttTasks.filter(
    (task) => task.project === project.id
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/projects")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">{project.name}</h2>
            <StatusBadge status={project.status} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              편집
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>프로젝트 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    프로젝트 코드
                  </p>
                  <p className="font-medium">{project.projectCode}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    고객사
                  </p>
                  <p className="font-medium">{project.clientName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    시작일
                  </p>
                  <p className="font-medium">{formatDate(project.startDate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    종료일
                  </p>
                  <p className="font-medium">{formatDate(project.endDate)}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    설명
                  </p>
                  <p className="text-sm">{project.description || "설명 없음"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>팀 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  담당자
                </p>
                <p className="font-medium">{creator?.name || "알 수 없음"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  설계자
                </p>
                {designers.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {designers.map((designer) => (
                      <div
                        key={designer.id}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
                      >
                        {designer.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">지정된 설계자 없음</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  개발자
                </p>
                {developers.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {developers.map((developer) => (
                      <div
                        key={developer.id}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
                      >
                        {developer.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">지정된 개발자 없음</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>일정</CardTitle>
          </CardHeader>
          <CardContent>
            <GanttChart tasks={projectTasks} />
          </CardContent>
        </Card>
      </div>

      <ProjectDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        project={project}
      />

      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
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
            <AlertDialogAction onClick={handleDeleteProject}>
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDetail;
