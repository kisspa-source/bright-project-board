
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GanttChart from "@/components/charts/GanttChart";

const Calendar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { ganttTasks, loading } = useProjects();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // Get all tasks
  const allTasks = [...ganttTasks];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">일정</h2>
        <p className="text-muted-foreground">
          전체 프로젝트 일정을 확인하세요
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>전체 프로젝트 일정</CardTitle>
        </CardHeader>
        <CardContent>
          <GanttChart tasks={allTasks} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
