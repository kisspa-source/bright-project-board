
import React from "react";
import { Project } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import { getUserById } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecentProjectsProps {
  projects: Project[];
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ projects }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  const getCreatorName = (createdById: string) => {
    const creator = getUserById(createdById);
    return creator ? creator.name : "알 수 없음";
  };

  const sortedProjects = [...projects]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 프로젝트</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedProjects.length > 0 ? (
          sortedProjects.map((project) => (
            <div
              key={project.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div>
                <h4 className="font-medium">{project.name}</h4>
                <div className="text-sm text-gray-500 mt-1">
                  <div>
                    {project.clientName} · {getCreatorName(project.createdBy)}
                  </div>
                  <div>
                    {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={project.status} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            프로젝트가 없습니다
          </div>
        )}
        
        {sortedProjects.length > 0 && (
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={() => navigate("/projects")}
          >
            모든 프로젝트 보기
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProjects;
