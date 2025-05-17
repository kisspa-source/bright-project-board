
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { Navigate } from "react-router-dom";
import StatsCard from "@/components/ui/stats-card";
import {
  Calendar,
  CheckCircle,
  Clock,
  LayoutGrid,
  Users,
} from "lucide-react";
import { dashboardStats } from "@/data/mockData";
import RecentProjects from "@/components/dashboard/RecentProjects";
import GanttChart from "@/components/charts/GanttChart";

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { projects, ganttTasks, loading } = useProjects();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // Get only main project tasks
  const mainProjectTasks = ganttTasks.filter(
    (task) => !task.type || task.type !== "task"
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">대시보드</h2>
        <p className="text-muted-foreground">
          프로젝트 현황 및 주요 지표를 확인하세요
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="총 프로젝트"
          value={dashboardStats.totalProjects}
          icon={<LayoutGrid className="h-4 w-4" />}
        />
        <StatsCard
          title="진행 중인 프로젝트"
          value={dashboardStats.inProgressProjects}
          icon={<Clock className="h-4 w-4" />}
          trend="up"
          trendValue="2"
        />
        <StatsCard
          title="완료된 프로젝트"
          value={dashboardStats.completedProjects}
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <StatsCard
          title="고객사 수"
          value={dashboardStats.clientCount}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm overflow-hidden">
            <h3 className="text-lg font-medium mb-4">프로젝트 일정</h3>
            <GanttChart tasks={mainProjectTasks} />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <RecentProjects projects={projects} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
