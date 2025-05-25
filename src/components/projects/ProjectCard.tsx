import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, Users } from 'lucide-react';
import { Project } from '../../lib/api/projects';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const statusVariant = getStatusBadgeVariant(project.status);
  const statusText = getStatusText(project.status);
  
  // 날짜 포맷팅
  const formattedStartDate = format(new Date(project.start_date), 'yyyy년 MM월 dd일', { locale: ko });
  const formattedEndDate = format(new Date(project.end_date), 'yyyy년 MM월 dd일', { locale: ko });
  
  // 남은 날짜 계산
  const today = new Date();
  const endDate = new Date(project.end_date);
  const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <Link to={`/projects/${project.id}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription className="text-sm">{project.code}</CardDescription>
            </div>
            <Badge variant={statusVariant}>{statusText}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-gray-500 mb-2">고객사: {project.client}</p>
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedStartDate} ~ {formattedEndDate}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span>담당자: 미정</span>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="w-full flex justify-between items-center">
            <div className="text-sm">
              {daysLeft > 0 ? (
                <span className="text-blue-600 font-medium">D-{daysLeft}</span>
              ) : daysLeft === 0 ? (
                <span className="text-red-600 font-medium">오늘 마감</span>
              ) : (
                <span className="text-gray-500 font-medium">마감됨</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {project.created_at ? format(new Date(project.created_at), 'yyyy-MM-dd 생성', { locale: ko }) : ''}
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};
